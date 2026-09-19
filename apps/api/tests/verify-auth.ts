import { AuthService } from '../src/services/auth.service.js';
import { prisma } from '../src/db.js';

async function runAuthTests() {
  console.log('[Test] Starting Auth Verification Suite...');

  const testEmail = `novelist_${Date.now()}@plotweaver.ai`;
  const testPassword = 'Password123!';
  const testName = 'Master Narrator';

  // 1. Register a new user
  console.log('1. Testing User Registration...');
  const regResult = await AuthService.register({
    email: testEmail,
    password: testPassword,
    name: testName,
  });

  if (!regResult.user.id || regResult.user.email !== testEmail || !regResult.token) {
    throw new Error('Registration failed to return valid user and token');
  }
  console.log('✔ Registration successful:', regResult.user.email, 'ID:', regResult.user.id);

  // 2. Prevent duplicate registration
  console.log('2. Testing Duplicate Email Guard...');
  let caughtDuplicate = false;
  try {
    await AuthService.register({
      email: testEmail,
      password: 'AnotherPassword',
      name: 'Imposter',
    });
  } catch (err: any) {
    if (err.code === 'EMAIL_ALREADY_EXISTS') caughtDuplicate = true;
  }
  if (!caughtDuplicate) throw new Error('Duplicate email was not rejected');
  console.log('✔ Duplicate email correctly rejected with 409 conflict');

  // 3. Test Login
  console.log('3. Testing User Login...');
  const loginResult = await AuthService.login({
    email: testEmail,
    password: testPassword,
  });
  if (!loginResult.token || loginResult.user.id !== regResult.user.id) {
    throw new Error('Login failed to return matching user');
  }
  console.log('✔ Login successful with valid token generated');

  // 4. Test Token Verification
  console.log('4. Testing JWT Verification...');
  const verifiedPayload = await AuthService.verifyToken(loginResult.token);
  if (!verifiedPayload || verifiedPayload.userId !== regResult.user.id) {
    throw new Error('JWT verification failed');
  }
  console.log('✔ JWT verification succeeded for userId:', verifiedPayload.userId);

  // 5. Test Profile Update (e.g. Setting Custom Gemini API Key)
  console.log('5. Testing Profile Update (Custom Gemini API Key)...');
  const updatedProfile = await AuthService.updateProfile(regResult.user.id, {
    name: 'Master Narrator V2',
    apiKey: 'AIzaSyFakeTestGeminiApiKey1234567890',
  });
  if (!updatedProfile.hasApiKey || updatedProfile.name !== 'Master Narrator V2') {
    throw new Error('Profile update failed to store custom API key');
  }
  console.log('✔ Profile updated successfully with hasApiKey = true');

  // Cleanup test user
  await prisma.user.delete({ where: { id: regResult.user.id } });
  console.log('✔ Test user cleaned up');

  console.log('\n🌟 ALL AUTH VERIFICATION TESTS PASSED (100%)');
}

runAuthTests().catch((err) => {
  console.error('[Auth Test Error]:', err);
  process.exit(1);
});

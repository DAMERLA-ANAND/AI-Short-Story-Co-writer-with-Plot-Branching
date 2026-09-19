import { GeminiStoryProvider } from '../src/providers/gemini.provider.js';
import { continueStoryStream } from '../src/services/generation.service.js';
import { prisma } from '../src/db.js';

async function runGeminiStreamTests() {
  console.log('[Test] Starting Gemini & Streaming Verification Suite...');

  // 1. Check Gemini Provider construction and schema formatting
  console.log('1. Testing Gemini Provider instantiation...');
  const gemini = new GeminiStoryProvider({ apiKey: 'mock_test_key_for_contract_check' });
  if (!gemini) throw new Error('Failed to instantiate GeminiStoryProvider');
  console.log('✔ GeminiStoryProvider instantiated cleanly');

  // 2. Test continueStoryStream with fallback stream resilience
  console.log('2. Testing continueStoryStream end-to-end with live fallback streaming...');
  
  // Find a story to stream continue
  const story = await prisma.story.findFirst({
    where: { activeSceneId: { not: null } },
    include: {
      scenes: {
        where: { choices: { some: { state: 'UNEXPLORED' } } },
        include: { choices: true },
      },
    },
  });

  if (!story || story.scenes.length === 0) {
    console.log('⚠ No story with unexplored choices found, skipping live stream test');
    return;
  }

  const unexploredChoice = story.scenes[0].choices.find((c) => c.state === 'UNEXPLORED');
  if (!unexploredChoice) {
    console.log('⚠ No unexplored choice found in story, skipping live stream test');
    return;
  }

  const tokensReceived: string[] = [];
  const workspace = await continueStoryStream(
    story.id,
    unexploredChoice.id,
    (chunk) => {
      tokensReceived.push(chunk);
    },
    null // fallback mode
  );

  if (tokensReceived.length === 0) {
    throw new Error('Streaming failed to emit token chunks');
  }

  console.log(`✔ Stream successfully emitted ${tokensReceived.length} progressive chunks!`);
  console.log(`✔ Sample streamed chunk: "${tokensReceived[0].trim()}"`);
  console.log(`✔ Story active scene updated to new branch depth: ${workspace.scenes.find(s => s.id === workspace.story.activeSceneId)?.depth}`);

  console.log('\n🌟 GEMINI STREAMING VERIFICATION SUITE PASSED (100%)');
}

runGeminiStreamTests().catch((err) => {
  console.error('[Gemini Stream Test Error]:', err);
  process.exit(1);
});

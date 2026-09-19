import { app } from '../src/app.js';
import http from 'http';

async function testServer() {
  const server = http.createServer(app);
  
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3001;

  console.log(`[Test Server] Listening on ephemeral port ${port}...`);

  const res = await fetch(`http://localhost:${port}/api/health`);
  const data = await res.json();

  console.log('[Test Server] /api/health Response:', data);

  if (res.status !== 200 || data.status !== 'ok') {
    throw new Error('Health check failed!');
  }

  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );

  console.log('✔ Express HTTP Server & Health Check verified successfully!');
}

testServer().catch((err) => {
  console.error('Server test failed:', err);
  process.exit(1);
});

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { storyRouter } from './routes/story.routes.js';
import { snapshotRouter } from './routes/snapshot.routes.js';
import { authRouter } from './routes/auth.routes.js';

export const app: Express = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'plotweaver-api',
    provider: env.LLM_PROVIDER,
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use('/api/auth', authRouter);

// Story routes
app.use('/api/stories', storyRouter);

// Snapshot vault routes
app.use('/api/snapshots', snapshotRouter);

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred.',
      requestId: `req_${Date.now()}`,
    },
  });
});

import { Request, Response, NextFunction } from 'express';
import {
  CreateStoryRequestSchema,
  ContinueStoryRequestSchema,
  SetActiveSceneRequestSchema,
  ExportQuerySchema,
} from '@plotweaver/shared';
import {
  createStory,
  getStoryWorkspace,
  setActiveScene,
  listStories,
  deleteStory,
} from '../services/story.service.js';
import {
  continueStory,
  continueStoryStream,
} from '../services/generation.service.js';
import { createStorySnapshot } from '../services/snapshot.service.js';
import {
  compileActiveStoryPath,
  compileMarkdownExport,
  compilePdfExport,
} from '../services/export.service.js';

export async function handleCreateStory(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = CreateStoryRequestSchema.parse(req.body);
    const workspace = await createStory(validated, req.user?.id);
    res.status(201).json(workspace);
  } catch (err) {
    next(err);
  }
}

export async function handleListStories(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const publicOnly = req.query.public === 'true';
    const stories = await listStories({ userId, publicOnly });
    res.status(200).json({ stories });
  } catch (err) {
    next(err);
  }
}

export async function handleGetStory(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = req.params.storyId as string;
    const workspace = await getStoryWorkspace(storyId);
    res.status(200).json(workspace);
  } catch (err) {
    next(err);
  }
}

export async function handleContinueStory(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = req.params.storyId as string;
    const { choiceId } = ContinueStoryRequestSchema.parse(req.body);
    const apiKey = (req.headers['x-gemini-api-key'] as string) || req.user?.apiKey;
    const workspace = await continueStory(storyId, choiceId, apiKey);
    res.status(200).json(workspace);
  } catch (err) {
    next(err);
  }
}

export async function handleContinueStoryStream(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = req.params.storyId as string;
    const { choiceId } = ContinueStoryRequestSchema.parse(req.body);
    const apiKey = (req.headers['x-gemini-api-key'] as string) || req.user?.apiKey;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (typeof (res as any).flushHeaders === 'function') {
      (res as any).flushHeaders();
    }

    const workspace = await continueStoryStream(
      storyId,
      choiceId,
      (chunk) => {
        res.write(`event: token\ndata: ${JSON.stringify({ chunk })}\n\n`);
      },
      apiKey
    );

    res.write(`event: done\ndata: ${JSON.stringify(workspace)}\n\n`);
    res.end();
  } catch (err) {
    next(err);
  }
}

export async function handleSetActiveScene(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = req.params.storyId as string;
    const { sceneId } = SetActiveSceneRequestSchema.parse(req.body);
    const workspace = await setActiveScene(storyId, sceneId);
    res.status(200).json(workspace);
  } catch (err) {
    next(err);
  }
}

export async function handleStoreSnapshot(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = req.params.storyId as string;
    const snapshotSummary = await createStorySnapshot(storyId);
    res.status(201).json(snapshotSummary);
  } catch (err) {
    next(err);
  }
}

export async function handleExportStory(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = req.params.storyId as string;
    const { format } = ExportQuerySchema.parse(req.query);
    const compiled = await compileActiveStoryPath(storyId);
    const safeTitle = compiled.story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'story';

    if (format === 'pdf') {
      const pdfBuffer = await compilePdfExport(storyId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}-manuscript.pdf"`);
      res.send(pdfBuffer);
    } else {
      const markdown = await compileMarkdownExport(storyId);
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}-manuscript.md"`);
      res.send(markdown);
    }
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteStory(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = req.params.storyId as string;
    await deleteStory(storyId);
    res.status(200).json({ success: true, deletedStoryId: storyId });
  } catch (err) {
    next(err);
  }
}


import { Router } from 'express';
import {
  handleCreateStory,
  handleListStories,
  handleGetStory,
  handleContinueStory,
  handleContinueStoryStream,
  handleSetActiveScene,
  handleStoreSnapshot,
  handleExportStory,
} from '../controllers/story.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

export const storyRouter = Router();

storyRouter.use(optionalAuth);

storyRouter.get('/', handleListStories);
storyRouter.post('/', handleCreateStory);
storyRouter.get('/:storyId', handleGetStory);
storyRouter.post('/:storyId/continue', handleContinueStory);
storyRouter.post('/:storyId/continue/stream', handleContinueStoryStream);
storyRouter.post('/:storyId/active-scene', handleSetActiveScene);
storyRouter.post('/:storyId/store', handleStoreSnapshot);
storyRouter.get('/:storyId/export', handleExportStory);



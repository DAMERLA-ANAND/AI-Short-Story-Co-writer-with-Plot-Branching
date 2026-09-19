import { z } from 'zod';
import { GENRE_IDS } from './genres.js';

export const ChoiceArchetypeSchema = z.enum([
  'CONFRONTATION',
  'INVESTIGATION',
  'DIVERGENCE',
]);

export const ChoiceStateSchema = z.enum([
  'UNEXPLORED',
  'GENERATING',
  'EXPLORED',
]);

export const StoryStatusSchema = z.enum([
  'GENERATING',
  'READY',
  'FAILED',
]);

export const SceneStatusSchema = z.enum([
  'GENERATING',
  'READY',
  'FAILED',
]);

// -------------------------------------------------------------
// HTTP REQUEST SCHEMAS
// -------------------------------------------------------------

export const CreateStoryRequestSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  genre: z.enum(GENRE_IDS, {
    errorMap: () => ({ message: 'Invalid genre selected' }),
  }),
  tone: z.string().trim().min(1, 'Tone is required').max(80, 'Tone is too long'),
  premise: z.string().trim().min(10, 'Premise must be at least 10 characters').max(2000, 'Premise is too long'),
});

export const ContinueStoryRequestSchema = z.object({
  choiceId: z.string().min(1, 'Choice ID is required'),
});

export const SetActiveSceneRequestSchema = z.object({
  sceneId: z.string().min(1, 'Scene ID is required'),
});

export const ExportQuerySchema = z.object({
  format: z.enum(['markdown', 'pdf']).default('markdown'),
});

// -------------------------------------------------------------
// AUTHENTICATION SCHEMAS
// -------------------------------------------------------------

export const RegisterRequestSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
});

export const LoginRequestSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const UpdateUserRequestSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  apiKey: z.string().trim().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const UserDtoSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable().optional(),
  hasApiKey: z.boolean(),
  createdAt: z.string().or(z.date()),
});

export const AuthResponseSchema = z.object({
  user: UserDtoSchema,
  token: z.string(),
});

// -------------------------------------------------------------
// AI GENERATION OUTPUT SCHEMAS
// -------------------------------------------------------------

export const GeneratedChoiceOutputSchema = z.object({
  ordinal: z.number().int().min(1).max(3),
  archetype: ChoiceArchetypeSchema,
  text: z.string().trim().min(5, 'Choice text too short').max(250, 'Choice text too long'),
  narrativeIntent: z.string().trim().min(5, 'Narrative intent too short').max(300, 'Narrative intent too long'),
});

export const GeneratedSceneOutputSchema = z.object({
  sceneText: z.string().trim().min(200, 'Scene prose is too short').max(4500, 'Scene prose is too long'),
  sceneSummary: z.string().trim().min(20, 'Scene summary is too short').max(600, 'Scene summary is too long'),
  choices: z
    .array(GeneratedChoiceOutputSchema)
    .min(2, 'Must provide at least 2 distinct choices')
    .max(3, 'Maximum 3 choices allowed'),
});

// -------------------------------------------------------------
// DTO RESPONSE SCHEMAS
// -------------------------------------------------------------

export const ChoiceDtoSchema = z.object({
  id: z.string(),
  storyId: z.string(),
  sourceSceneId: z.string(),
  childSceneId: z.string().nullable().optional(),
  ordinal: z.number(),
  archetype: ChoiceArchetypeSchema,
  text: z.string(),
  narrativeIntent: z.string(),
  state: ChoiceStateSchema,
  createdAt: z.string().or(z.date()),
});

export const SceneDtoSchema = z.object({
  id: z.string(),
  storyId: z.string(),
  parentChoiceId: z.string().nullable().optional(),
  depth: z.number(),
  text: z.string(),
  summary: z.string(),
  status: SceneStatusSchema,
  generationError: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  choices: z.array(ChoiceDtoSchema),
});

export const StoryDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  genre: z.enum(GENRE_IDS),
  tone: z.string(),
  premise: z.string(),
  status: StoryStatusSchema,
  rootSceneId: z.string().nullable().optional(),
  activeSceneId: z.string().nullable().optional(),
  sourceSnapshotId: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const StoryWorkspaceDtoSchema = z.object({
  story: StoryDtoSchema,
  scenes: z.array(SceneDtoSchema),
  choices: z.array(ChoiceDtoSchema),
  activePathSceneIds: z.array(z.string()),
});

export const StorySnapshotSummaryDtoSchema = z.object({
  id: z.string(),
  sourceStoryId: z.string(),
  version: z.number(),
  title: z.string(),
  genre: z.enum(GENRE_IDS),
  tone: z.string(),
  premise: z.string(),
  sceneCount: z.number(),
  branchCount: z.number(),
  snapshotRootId: z.string(),
  snapshotActiveId: z.string(),
  createdAt: z.string().or(z.date()),
});

export const StorySnapshotWorkspaceDtoSchema = z.object({
  snapshot: StorySnapshotSummaryDtoSchema,
  scenes: z.array(SceneDtoSchema),
  choices: z.array(ChoiceDtoSchema),
  activePathSceneIds: z.array(z.string()),
});

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string()).optional(),
    requestId: z.string(),
  }),
});

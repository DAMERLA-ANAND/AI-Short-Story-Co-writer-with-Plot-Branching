import { z } from 'zod';
import {
  ChoiceArchetypeSchema,
  ChoiceStateSchema,
  StoryStatusSchema,
  SceneStatusSchema,
  CreateStoryRequestSchema,
  ContinueStoryRequestSchema,
  SetActiveSceneRequestSchema,
  ExportQuerySchema,
  RegisterRequestSchema,
  LoginRequestSchema,
  UpdateUserRequestSchema,
  UserDtoSchema,
  AuthResponseSchema,
  GeneratedChoiceOutputSchema,
  GeneratedSceneOutputSchema,
  ChoiceDtoSchema,
  SceneDtoSchema,
  StoryDtoSchema,
  StoryWorkspaceDtoSchema,
  StorySnapshotSummaryDtoSchema,
  StorySnapshotWorkspaceDtoSchema,
  ApiErrorSchema,
} from './schemas.js';

export type ChoiceArchetype = z.infer<typeof ChoiceArchetypeSchema>;
export type ChoiceState = z.infer<typeof ChoiceStateSchema>;
export type StoryStatus = z.infer<typeof StoryStatusSchema>;
export type SceneStatus = z.infer<typeof SceneStatusSchema>;

export type CreateStoryRequest = z.infer<typeof CreateStoryRequestSchema>;
export type ContinueStoryRequest = z.infer<typeof ContinueStoryRequestSchema>;
export type SetActiveSceneRequest = z.infer<typeof SetActiveSceneRequestSchema>;
export type ExportQuery = z.infer<typeof ExportQuerySchema>;

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export type GeneratedChoiceOutput = z.infer<typeof GeneratedChoiceOutputSchema>;
export type GeneratedSceneOutput = z.infer<typeof GeneratedSceneOutputSchema>;

export type ChoiceDto = z.infer<typeof ChoiceDtoSchema>;
export type SceneDto = z.infer<typeof SceneDtoSchema>;
export type StoryDto = z.infer<typeof StoryDtoSchema>;
export type StoryWorkspaceDto = z.infer<typeof StoryWorkspaceDtoSchema>;

export type StorySnapshotSummaryDto = z.infer<typeof StorySnapshotSummaryDtoSchema>;
export type StorySnapshotWorkspaceDto = z.infer<typeof StorySnapshotWorkspaceDtoSchema>;

export type ApiError = z.infer<typeof ApiErrorSchema>;

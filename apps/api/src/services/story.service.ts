import { prisma } from '../db.js';
import {
  CreateStoryRequest,
  CreateStoryRequestSchema,
  GENRE_REGISTRY,
  GenreId,
  StoryWorkspaceDto,
} from '@plotweaver/shared';
import { getStoryProvider } from '../providers/index.js';
import { calculateActivePath } from './context.service.js';

export async function createStory(input: CreateStoryRequest, userId?: string): Promise<StoryWorkspaceDto> {
  const validated = CreateStoryRequestSchema.parse(input);
  const provider = getStoryProvider();
  const genreConfig = GENRE_REGISTRY[validated.genre as GenreId] || GENRE_REGISTRY.detective;

  // 1. Generate opening scene and distinct choices
  const generatedOpening = await provider.generateOpening({
    title: validated.title,
    genre: validated.genre,
    tone: validated.tone,
    premise: validated.premise,
    aiGuidance: genreConfig.aiGuidance,
  });

  // 2. Transactionally persist Story, Root Scene, and Choices
  const result = await prisma.$transaction(async (tx) => {
    const story = await tx.story.create({
      data: {
        userId: userId || null,
        title: validated.title,
        genre: validated.genre,
        tone: validated.tone,
        premise: validated.premise,
        status: 'READY',
      },
    });

    const rootScene = await tx.scene.create({
      data: {
        storyId: story.id,
        depth: 1,
        text: generatedOpening.sceneText,
        summary: generatedOpening.sceneSummary,
        status: 'READY',
      },
    });

    const choicesData = generatedOpening.choices.map((c) => ({
      storyId: story.id,
      sourceSceneId: rootScene.id,
      ordinal: c.ordinal,
      archetype: c.archetype,
      text: c.text,
      narrativeIntent: c.narrativeIntent,
      state: 'UNEXPLORED',
    }));

    await tx.choice.createMany({
      data: choicesData,
    });

    await tx.story.update({
      where: { id: story.id },
      data: {
        rootSceneId: rootScene.id,
        activeSceneId: rootScene.id,
      },
    });

    return { storyId: story.id, rootSceneId: rootScene.id };
  });

  return getStoryWorkspace(result.storyId);
}

export async function getStoryWorkspace(storyId: string): Promise<StoryWorkspaceDto> {
  const story = await prisma.story.findUniqueOrThrow({
    where: { id: storyId },
  });

  const scenes = await prisma.scene.findMany({
    where: { storyId },
    orderBy: { createdAt: 'asc' },
    include: {
      choices: {
        orderBy: { ordinal: 'asc' },
      },
    },
  });

  const choices = await prisma.choice.findMany({
    where: { storyId },
    orderBy: { createdAt: 'asc' },
  });

  const activePathSceneIds = story.activeSceneId
    ? await calculateActivePath(storyId, story.activeSceneId)
    : [];

  return {
    story: {
      ...story,
      genre: story.genre as any,
      status: story.status as any,
    },
    scenes: scenes.map((s) => ({
      ...s,
      status: s.status as any,
      choices: s.choices.map((c) => ({
        ...c,
        archetype: c.archetype as any,
        state: c.state as any,
      })),
    })),
    choices: choices.map((c) => ({
      ...c,
      archetype: c.archetype as any,
      state: c.state as any,
    })),
    activePathSceneIds,
  };
}

export async function setActiveScene(storyId: string, sceneId: string): Promise<StoryWorkspaceDto> {
  const scene = await prisma.scene.findUniqueOrThrow({
    where: { id: sceneId },
  });

  if (scene.storyId !== storyId) {
    throw new Error('Scene does not belong to the specified story.');
  }

  // Update position pointer only (never modifies or deletes any historical nodes)
  await prisma.story.update({
    where: { id: storyId },
    data: { activeSceneId: sceneId },
  });

  return getStoryWorkspace(storyId);
}

export async function listStories(options?: { userId?: string; publicOnly?: boolean }) {
  const where: any = {};
  if (options?.userId) {
    where.OR = [
      { userId: options.userId },
      { isPublic: true },
      { userId: null },
    ];
  } else if (options?.publicOnly) {
    where.OR = [
      { isPublic: true },
      { userId: null },
    ];
  }

  return prisma.story.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { scenes: true, choices: true },
      },
    },
  });
}


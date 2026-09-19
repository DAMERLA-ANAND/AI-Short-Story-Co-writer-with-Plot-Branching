import { prisma } from '../db.js';
import { GENRE_REGISTRY, GenreId, ChoiceArchetype } from '@plotweaver/shared';
import { ContinuationSceneInput } from '../providers/story-generation.provider.js';

export async function buildAncestralContext(
  storyId: string,
  choiceId: string
): Promise<ContinuationSceneInput> {
  const story = await prisma.story.findUniqueOrThrow({
    where: { id: storyId },
  });

  const choice = await prisma.choice.findUniqueOrThrow({
    where: { id: choiceId },
  });

  if (choice.storyId !== storyId) {
    throw new Error('Choice does not belong to the specified story.');
  }

  // 1. Walk from choice.sourceSceneId up to root scene
  const lineage: Array<{
    sceneId: string;
    depth: number;
    text: string;
    summary: string;
    choiceTakenLeadingHere?: string;
  }> = [];

  let currentSceneId: string | null = choice.sourceSceneId;

  while (currentSceneId) {
    const scene: any = await prisma.scene.findUniqueOrThrow({
      where: { id: currentSceneId },
      include: {
        parentChoice: true,
      },
    });

    lineage.unshift({
      sceneId: scene.id,
      depth: scene.depth,
      text: scene.text,
      summary: scene.summary,
      choiceTakenLeadingHere: scene.parentChoice?.text,
    });

    if (scene.parentChoice) {
      currentSceneId = scene.parentChoice.sourceSceneId;
    } else {
      currentSceneId = null; // Root scene reached
    }
  }

  // 2. Sliding window compression (latest 2 scenes in full text, older scenes in summary)
  const ancestralHistory = lineage.map((item, index) => {
    const isRecent = index >= lineage.length - 2;
    return {
      depth: item.depth,
      choiceTakenLeadingHere: item.choiceTakenLeadingHere,
      content: isRecent
        ? item.text
        : `[Scene ${item.depth} Summary: ${item.summary}]`,
    };
  });

  const genreConfig = GENRE_REGISTRY[story.genre as GenreId] || GENRE_REGISTRY.detective;

  return {
    title: story.title,
    genre: story.genre,
    tone: story.tone,
    premise: story.premise,
    aiGuidance: genreConfig.aiGuidance,
    selectedChoice: {
      text: choice.text,
      archetype: choice.archetype as ChoiceArchetype,
      narrativeIntent: choice.narrativeIntent,
    },
    ancestralHistory,
  };
}

export async function calculateActivePath(storyId: string, activeSceneId: string): Promise<string[]> {
  const path: string[] = [];
  let currentSceneId: string | null = activeSceneId;

  while (currentSceneId) {
    path.unshift(currentSceneId);
    const scene: any = await prisma.scene.findUnique({
      where: { id: currentSceneId },
      include: { parentChoice: true },
    });

    if (!scene || !scene.parentChoice) {
      break;
    }

    currentSceneId = scene.parentChoice.sourceSceneId;
  }

  return path;
}

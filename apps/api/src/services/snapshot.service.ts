import { prisma } from '../db.js';
import type {
  StorySnapshotSummaryDto,
  StorySnapshotWorkspaceDto,
  SceneDto,
  ChoiceDto,
} from '@plotweaver/shared';
import crypto from 'node:crypto';

export async function createStorySnapshot(storyId: string): Promise<StorySnapshotSummaryDto> {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      scenes: true,
      choices: true,
    },
  });

  if (!story) {
    throw new Error(`Story not found: ${storyId}`);
  }

  const prevSnapshotsCount = await prisma.storySnapshot.count({
    where: { sourceStoryId: storyId },
  });
  const version = prevSnapshotsCount + 1;

  const branchCount = story.choices.filter((c) => Boolean(c.childSceneId)).length;

  // Remap IDs for snapshot self-containment
  const sceneIdMap = new Map<string, string>();
  story.scenes.forEach((s) => {
    sceneIdMap.set(s.id, `snap_scn_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`);
  });

  const choiceIdMap = new Map<string, string>();
  story.choices.forEach((c) => {
    choiceIdMap.set(c.id, `snap_ch_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`);
  });

  const snapshotRootId = story.rootSceneId ? sceneIdMap.get(story.rootSceneId) || '' : '';
  const snapshotActiveId = story.activeSceneId ? sceneIdMap.get(story.activeSceneId) || '' : '';

  const snapshot = await prisma.$transaction(async (tx) => {
    const createdSnapshot = await tx.storySnapshot.create({
      data: {
        sourceStoryId: story.id,
        version,
        title: story.title,
        genre: story.genre,
        tone: story.tone,
        premise: story.premise,
        sceneCount: story.scenes.length,
        branchCount,
        snapshotRootId,
        snapshotActiveId,
      },
    });

    // 1. Insert snapshot scenes
    for (const scene of story.scenes) {
      const newSceneId = sceneIdMap.get(scene.id)!;
      const mappedParentChoiceId = scene.parentChoiceId
        ? choiceIdMap.get(scene.parentChoiceId) || null
        : null;

      await tx.snapshotScene.create({
        data: {
          id: newSceneId,
          snapshotId: createdSnapshot.id,
          originalSceneId: scene.id,
          parentChoiceId: mappedParentChoiceId,
          depth: scene.depth,
          text: scene.text,
          summary: scene.summary,
        },
      });
    }

    // 2. Insert snapshot choices
    for (const choice of story.choices) {
      const newChoiceId = choiceIdMap.get(choice.id)!;
      const mappedSourceSceneId = sceneIdMap.get(choice.sourceSceneId)!;
      const mappedChildSceneId = choice.childSceneId
        ? sceneIdMap.get(choice.childSceneId) || null
        : null;

      await tx.snapshotChoice.create({
        data: {
          id: newChoiceId,
          snapshotId: createdSnapshot.id,
          sourceSceneId: mappedSourceSceneId,
          childSceneId: mappedChildSceneId,
          ordinal: choice.ordinal,
          archetype: choice.archetype,
          text: choice.text,
          narrativeIntent: choice.narrativeIntent,
        },
      });
    }

    return createdSnapshot;
  });

  return {
    id: snapshot.id,
    sourceStoryId: snapshot.sourceStoryId,
    version: snapshot.version,
    title: snapshot.title,
    genre: snapshot.genre as any,
    tone: snapshot.tone,
    premise: snapshot.premise,
    sceneCount: snapshot.sceneCount,
    branchCount: snapshot.branchCount,
    snapshotRootId: snapshot.snapshotRootId,
    snapshotActiveId: snapshot.snapshotActiveId,
    createdAt: snapshot.createdAt,
  };
}

export async function listStorySnapshots(): Promise<StorySnapshotSummaryDto[]> {
  const snapshots = await prisma.storySnapshot.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return snapshots.map((s) => ({
    id: s.id,
    sourceStoryId: s.sourceStoryId,
    version: s.version,
    title: s.title,
    genre: s.genre as any,
    tone: s.tone,
    premise: s.premise,
    sceneCount: s.sceneCount,
    branchCount: s.branchCount,
    snapshotRootId: s.snapshotRootId,
    snapshotActiveId: s.snapshotActiveId,
    createdAt: s.createdAt,
  }));
}

export async function getStorySnapshot(snapshotId: string): Promise<StorySnapshotWorkspaceDto> {
  const snapshot = await prisma.storySnapshot.findUnique({
    where: { id: snapshotId },
    include: {
      scenes: true,
      choices: true,
    },
  });

  if (!snapshot) {
    throw new Error(`Snapshot not found: ${snapshotId}`);
  }

  // Reconstruct active path by walking backwards from snapshotActiveId to snapshotRootId
  const sceneMap = new Map<string, any>();
  snapshot.scenes.forEach((s) => sceneMap.set(s.id, s));

  const choiceMap = new Map<string, any>();
  snapshot.choices.forEach((c) => choiceMap.set(c.id, c));

  const activePathIds: string[] = [];
  let currSceneId: string | null = snapshot.snapshotActiveId;

  while (currSceneId) {
    activePathIds.unshift(currSceneId);
    const currScene = sceneMap.get(currSceneId);
    if (!currScene || !currScene.parentChoiceId) break;
    const parentChoice = choiceMap.get(currScene.parentChoiceId);
    if (!parentChoice) break;
    currSceneId = parentChoice.sourceSceneId;
  }

  // Map choices to ChoiceDto
  const choicesDto: ChoiceDto[] = snapshot.choices.map((c) => ({
    id: c.id,
    storyId: snapshot.sourceStoryId,
    sourceSceneId: c.sourceSceneId,
    childSceneId: c.childSceneId,
    ordinal: c.ordinal,
    archetype: c.archetype as any,
    text: c.text,
    narrativeIntent: c.narrativeIntent,
    state: c.childSceneId ? 'EXPLORED' : 'UNEXPLORED',
    createdAt: c.createdAt,
  }));

  // Map scenes to SceneDto
  const scenesDto: SceneDto[] = snapshot.scenes.map((s) => {
    const sceneChoices = choicesDto.filter((c) => c.sourceSceneId === s.id);
    return {
      id: s.id,
      storyId: snapshot.sourceStoryId,
      parentChoiceId: s.parentChoiceId,
      depth: s.depth,
      text: s.text,
      summary: s.summary,
      status: 'READY',
      generationError: null,
      createdAt: s.createdAt,
      updatedAt: s.createdAt,
      choices: sceneChoices,
    };
  });

  return {
    snapshot: {
      id: snapshot.id,
      sourceStoryId: snapshot.sourceStoryId,
      version: snapshot.version,
      title: snapshot.title,
      genre: snapshot.genre as any,
      tone: snapshot.tone,
      premise: snapshot.premise,
      sceneCount: snapshot.sceneCount,
      branchCount: snapshot.branchCount,
      snapshotRootId: snapshot.snapshotRootId,
      snapshotActiveId: snapshot.snapshotActiveId,
      createdAt: snapshot.createdAt,
    },
    scenes: scenesDto,
    choices: choicesDto,
    activePathSceneIds: activePathIds,
  };
}

export async function forkStorySnapshot(snapshotId: string): Promise<{ storyId: string }> {
  const snapshot = await prisma.storySnapshot.findUnique({
    where: { id: snapshotId },
    include: {
      scenes: true,
      choices: true,
    },
  });

  if (!snapshot) {
    throw new Error(`Snapshot not found: ${snapshotId}`);
  }

  // Generate new IDs for active Story, Scene, and Choice
  const sceneMap = new Map<string, string>();
  snapshot.scenes.forEach((s) => {
    sceneMap.set(s.id, `scn_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`);
  });

  const choiceMap = new Map<string, string>();
  snapshot.choices.forEach((c) => {
    choiceMap.set(c.id, `ch_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`);
  });

  const newStoryId = `story_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  const newRootSceneId = sceneMap.get(snapshot.snapshotRootId) || null;
  const newActiveSceneId = sceneMap.get(snapshot.snapshotActiveId) || null;

  await prisma.$transaction(async (tx) => {
    // 1. Create forked story
    await tx.story.create({
      data: {
        id: newStoryId,
        title: `${snapshot.title} (Fork)`,
        genre: snapshot.genre,
        tone: snapshot.tone,
        premise: snapshot.premise,
        status: 'READY',
        sourceSnapshotId: snapshot.id,
        rootSceneId: newRootSceneId,
        activeSceneId: newActiveSceneId,
      },
    });

    // 2. Insert scenes (null parentChoiceId initially to satisfy SQLite relations)
    for (const scene of snapshot.scenes) {
      await tx.scene.create({
        data: {
          id: sceneMap.get(scene.id)!,
          storyId: newStoryId,
          depth: scene.depth,
          text: scene.text,
          summary: scene.summary,
          status: 'READY',
        },
      });
    }

    // 3. Insert choices
    for (const choice of snapshot.choices) {
      const mappedChildId = choice.childSceneId ? sceneMap.get(choice.childSceneId) || null : null;
      await tx.choice.create({
        data: {
          id: choiceMap.get(choice.id)!,
          storyId: newStoryId,
          sourceSceneId: sceneMap.get(choice.sourceSceneId)!,
          childSceneId: mappedChildId,
          ordinal: choice.ordinal,
          archetype: choice.archetype,
          text: choice.text,
          narrativeIntent: choice.narrativeIntent,
          state: mappedChildId ? 'EXPLORED' : 'UNEXPLORED',
        },
      });
    }

    // 4. Update scenes with parentChoiceId
    for (const scene of snapshot.scenes) {
      if (scene.parentChoiceId) {
        const mappedParentChoiceId = choiceMap.get(scene.parentChoiceId);
        if (mappedParentChoiceId) {
          await tx.scene.update({
            where: { id: sceneMap.get(scene.id)! },
            data: { parentChoiceId: mappedParentChoiceId },
          });
        }
      }
    }
  });

  return { storyId: newStoryId };
}

export async function deleteStorySnapshot(snapshotId: string): Promise<void> {
  const snapshot = await prisma.storySnapshot.findUnique({
    where: { id: snapshotId },
  });

  if (!snapshot) {
    throw new Error(`Snapshot not found: ${snapshotId}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.snapshotChoice.deleteMany({
      where: { snapshotId },
    });
    await tx.snapshotScene.deleteMany({
      where: { snapshotId },
    });
    await tx.storySnapshot.delete({
      where: { id: snapshotId },
    });
  });
}

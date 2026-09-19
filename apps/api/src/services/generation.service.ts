import { prisma } from '../db.js';
import { StoryWorkspaceDto } from '@plotweaver/shared';
import { getStoryProvider } from '../providers/index.js';
import { buildAncestralContext } from './context.service.js';
import { getStoryWorkspace } from './story.service.js';

export async function continueStory(
  storyId: string,
  choiceId: string,
  customApiKey?: string | null
): Promise<StoryWorkspaceDto> {
  const choice = await prisma.choice.findUniqueOrThrow({
    where: { id: choiceId },
    include: { sourceScene: true },
  });

  if (choice.storyId !== storyId) {
    throw new Error('Choice does not belong to the specified story.');
  }

  // 1. Idempotency check: If already explored, switch active view and return without calling AI
  if (choice.childSceneId) {
    await prisma.story.update({
      where: { id: storyId },
      data: { activeSceneId: choice.childSceneId },
    });
    return getStoryWorkspace(storyId);
  }

  // 2. Concurrency lock check
  if (choice.state === 'GENERATING') {
    const error: any = new Error('Generation is already in progress for this choice.');
    error.code = 'GENERATION_IN_PROGRESS';
    error.status = 409;
    throw error;
  }

  // 3. Mark choice as GENERATING
  await prisma.choice.update({
    where: { id: choiceId },
    data: { state: 'GENERATING' },
  });

  try {
    // 4. Assemble ancestral context
    const continuationInput = await buildAncestralContext(storyId, choiceId);
    const provider = getStoryProvider(customApiKey);

    // 5. Invoke LLM provider
    const generated = await provider.generateContinuation(continuationInput);

    // 6. Transactionally persist child scene, choices, and update parent choice state
    await prisma.$transaction(async (tx) => {
      const childScene = await tx.scene.create({
        data: {
          storyId,
          parentChoiceId: choiceId,
          depth: choice.sourceScene.depth + 1,
          text: generated.sceneText,
          summary: generated.sceneSummary,
          status: 'READY',
        },
      });

      const choicesData = generated.choices.map((c) => ({
        storyId,
        sourceSceneId: childScene.id,
        ordinal: c.ordinal,
        archetype: c.archetype,
        text: c.text,
        narrativeIntent: c.narrativeIntent,
        state: 'UNEXPLORED',
      }));

      await tx.choice.createMany({
        data: choicesData,
      });

      await tx.choice.update({
        where: { id: choiceId },
        data: {
          childSceneId: childScene.id,
          state: 'EXPLORED',
        },
      });

      await tx.story.update({
        where: { id: storyId },
        data: {
          activeSceneId: childScene.id,
        },
      });
    });

    return getStoryWorkspace(storyId);
  } catch (err: any) {
    // Revert reservation lock if generation failed
    await prisma.choice.update({
      where: { id: choiceId },
      data: { state: 'UNEXPLORED' },
    });
    throw err;
  }
}

export async function continueStoryStream(
  storyId: string,
  choiceId: string,
  onChunk: (chunk: string) => void,
  customApiKey?: string | null
): Promise<StoryWorkspaceDto> {
  const choice = await prisma.choice.findUniqueOrThrow({
    where: { id: choiceId },
    include: { sourceScene: true },
  });

  if (choice.storyId !== storyId) {
    throw new Error('Choice does not belong to the specified story.');
  }

  if (choice.childSceneId) {
    await prisma.story.update({
      where: { id: storyId },
      data: { activeSceneId: choice.childSceneId },
    });
    return getStoryWorkspace(storyId);
  }

  if (choice.state === 'GENERATING') {
    const error: any = new Error('Generation is already in progress for this choice.');
    error.code = 'GENERATION_IN_PROGRESS';
    error.status = 409;
    throw error;
  }

  await prisma.choice.update({
    where: { id: choiceId },
    data: { state: 'GENERATING' },
  });

  try {
    const continuationInput = await buildAncestralContext(storyId, choiceId);
    const geminiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let generated;
    if (geminiKey) {
      try {
        const { GeminiStoryProvider } = await import('../providers/gemini.provider.js');
        const gemini = new GeminiStoryProvider({ apiKey: geminiKey });
        generated = await gemini.generateContinuationStream(continuationInput, onChunk);
      } catch (geminiErr) {
        console.warn('[Stream Warning] Gemini stream failed, falling back to mock stream:', geminiErr);
        const provider = getStoryProvider(null);
        generated = await provider.generateContinuation(continuationInput);
        // Simulate progressive word stream for fallback
        const words = generated.sceneText.split(' ');
        for (let i = 0; i < words.length; i += 3) {
          const slice = words.slice(i, i + 3).join(' ') + ' ';
          onChunk(slice);
          await new Promise((r) => setTimeout(r, 20));
        }
      }
    } else {
      const provider = getStoryProvider(null);
      generated = await provider.generateContinuation(continuationInput);
      const words = generated.sceneText.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const slice = words.slice(i, i + 3).join(' ') + ' ';
        onChunk(slice);
        await new Promise((r) => setTimeout(r, 20));
      }
    }

    await prisma.$transaction(async (tx) => {
      const childScene = await tx.scene.create({
        data: {
          storyId,
          parentChoiceId: choiceId,
          depth: choice.sourceScene.depth + 1,
          text: generated.sceneText,
          summary: generated.sceneSummary,
          status: 'READY',
        },
      });

      const choicesData = generated.choices.map((c) => ({
        storyId,
        sourceSceneId: childScene.id,
        ordinal: c.ordinal,
        archetype: c.archetype,
        text: c.text,
        narrativeIntent: c.narrativeIntent,
        state: 'UNEXPLORED',
      }));

      await tx.choice.createMany({
        data: choicesData,
      });

      await tx.choice.update({
        where: { id: choiceId },
        data: {
          childSceneId: childScene.id,
          state: 'EXPLORED',
        },
      });

      await tx.story.update({
        where: { id: storyId },
        data: {
          activeSceneId: childScene.id,
        },
      });
    });

    return getStoryWorkspace(storyId);
  } catch (err: any) {
    await prisma.choice.update({
      where: { id: choiceId },
      data: { state: 'UNEXPLORED' },
    });
    throw err;
  }
}

import { PrismaClient } from '@prisma/client';
import {
  GENRE_IDS,
  GENRE_REGISTRY,
  GeneratedSceneOutputSchema,
} from '@plotweaver/shared';
import { MockStoryProvider } from '../src/providers/mock.provider.js';

async function verifyPhase1() {
  console.log('=== PlotWeaver Phase 1 Validation Gate ===');

  // 1. Verify 10 Genre Registry
  console.log('[1/3] Verifying 10 Curated Genre Worlds...');
  if (GENRE_IDS.length !== 10) {
    throw new Error(`Expected 10 genres, found ${GENRE_IDS.length}`);
  }
  for (const id of GENRE_IDS) {
    const config = GENRE_REGISTRY[id];
    if (!config || !config.tokens.accent || !config.aiGuidance) {
      throw new Error(`Invalid genre configuration for: ${id}`);
    }
  }
  console.log('  ✔ All 10 Genre Worlds verified with complete tokens & guidance.');

  // 2. Verify Mock Provider & Schema Compliance
  console.log('[2/3] Verifying Mock Story Generation Engine...');
  const mockProvider = new MockStoryProvider();

  const opening = await mockProvider.generateOpening({
    title: 'The Hidden Cipher',
    genre: 'detective',
    tone: 'Noir',
    premise: 'A detective finds a coded message in an old library book.',
    aiGuidance: GENRE_REGISTRY.detective.aiGuidance,
  });

  const parsedOpening = GeneratedSceneOutputSchema.parse(opening);
  console.log(`  ✔ Opening Scene generated: ${parsedOpening.choices.length} distinct archetypal choices.`);

  const continuation = await mockProvider.generateContinuation({
    title: 'The Hidden Cipher',
    genre: 'detective',
    tone: 'Noir',
    premise: 'A detective finds a coded message in an old library book.',
    aiGuidance: GENRE_REGISTRY.detective.aiGuidance,
    selectedChoice: parsedOpening.choices[0],
    ancestralHistory: [
      {
        depth: 1,
        content: parsedOpening.sceneText,
      },
    ],
  });

  const parsedContinuation = GeneratedSceneOutputSchema.parse(continuation);
  console.log(`  ✔ Continuation Scene generated: ${parsedContinuation.choices.length} distinct archetypal choices.`);

  // 3. Verify Prisma Database Connection
  console.log('[3/3] Verifying Prisma SQLite Database Connection...');
  const prisma = new PrismaClient();
  const storyCount = await prisma.story.count();
  const snapshotCount = await prisma.storySnapshot.count();
  console.log(`  ✔ SQLite dev.db connected. Active stories: ${storyCount}, Snapshots: ${snapshotCount}.`);

  await prisma.$disconnect();
  console.log('\n🎉 ALL PHASE 1 VALIDATION GATES PASSED CLEANLY!');
}

verifyPhase1().catch((err) => {
  console.error('❌ Phase 1 Validation Failed:', err);
  process.exit(1);
});

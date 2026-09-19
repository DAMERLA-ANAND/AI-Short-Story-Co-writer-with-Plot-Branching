import { prisma } from '../src/db.js';
import {
  createStory,
  getStoryWorkspace,
  setActiveScene,
} from '../src/services/story.service.js';
import { continueStory } from '../src/services/generation.service.js';
import { buildAncestralContext } from '../src/services/context.service.js';

async function runStoryFlowTest() {
  console.log('=== PlotWeaver Phase 2 Integration Test: Full Branching & Consistency Flow ===\n');

  // 1. Create a Story
  console.log('[Step 1] Creating a new Mystery / Noir story...');
  const workspace1 = await createStory({
    title: 'The Stolen Ledger',
    genre: 'detective',
    tone: 'Noir',
    premise: 'A forensic accountant discovers falsified autopsy reports in a city vault.',
  });

  const storyId = workspace1.story.id;
  const rootScene = workspace1.scenes.find((s) => s.depth === 1);
  if (!rootScene) throw new Error('Root scene not found!');
  if (workspace1.choices.length !== 3) throw new Error(`Expected 3 choices, got ${workspace1.choices.length}`);
  if (workspace1.activePathSceneIds.length !== 1 || workspace1.activePathSceneIds[0] !== rootScene.id) {
    throw new Error('Active path did not start with root scene!');
  }
  console.log(`  ✔ Story created: "${workspace1.story.title}" (ID: ${storyId})`);
  console.log(`  ✔ Root Scene ID: ${rootScene.id} with ${rootScene.choices.length} distinct archetypal choices.`);
  console.log(`  ✔ Active Path: [${workspace1.activePathSceneIds.join(' -> ')}]`);

  // 2. Continue first choice (Branch A)
  const choiceA = rootScene.choices[0];
  console.log(`\n[Step 2] Continuing Choice A: "${choiceA.text}" [${choiceA.archetype}]...`);
  const workspace2 = await continueStory(storyId, choiceA.id);

  const sceneA = workspace2.scenes.find((s) => s.parentChoiceId === choiceA.id);
  if (!sceneA) throw new Error('Child scene for Choice A was not created!');
  if (sceneA.depth !== 2) throw new Error(`Expected depth 2, got ${sceneA.depth}`);
  if (workspace2.activePathSceneIds.length !== 2) throw new Error('Active path should have 2 scenes!');
  if (workspace2.activePathSceneIds[1] !== sceneA.id) throw new Error('Active path leaf should be Scene A!');
  console.log(`  ✔ Child Scene A created at depth ${sceneA.depth} with ${sceneA.choices.length} child choices.`);
  console.log(`  ✔ Active Path: [${workspace2.activePathSceneIds.join(' -> ')}]`);

  // 3. Idempotency Check (clicking explored choice again)
  console.log('\n[Step 3] Idempotency Check: Calling continue on Choice A again...');
  const sceneCountBefore = workspace2.scenes.length;
  const workspace3 = await continueStory(storyId, choiceA.id);
  if (workspace3.scenes.length !== sceneCountBefore) {
    throw new Error('Duplicate scene was created on explored choice!');
  }
  console.log('  ✔ Verified zero duplicate generation. Existing child scene reused immediately.');

  // 4. Time-Travel Rewind to Root Scene
  console.log('\n[Step 4] Time-Travel Rewind: Jumping back to Root Scene...');
  const workspace4 = await setActiveScene(storyId, rootScene.id);
  if (workspace4.activePathSceneIds.length !== 1 || workspace4.activePathSceneIds[0] !== rootScene.id) {
    throw new Error('Active path failed to reset to root scene!');
  }
  // Invariant: verify Scene A and its choices are still preserved
  const stillHasSceneA = workspace4.scenes.some((s) => s.id === sceneA.id);
  if (!stillHasSceneA) throw new Error('NON-DESTRUCTIVE VIOLATION: Historical branch was deleted!');
  console.log('  ✔ Time-travel successful: Active path reset to Root.');
  console.log('  ✔ Non-Destructive Guarantee: Scene A and its branch are permanently preserved in multiverse.');

  // 5. Branch Alternate Reality (Branch B from Root Scene)
  const choiceB = rootScene.choices[1];
  console.log(`\n[Step 5] Branching Alternate Reality on Choice B: "${choiceB.text}" [${choiceB.archetype}]...`);
  const workspace5 = await continueStory(storyId, choiceB.id);

  const sceneB = workspace5.scenes.find((s) => s.parentChoiceId === choiceB.id);
  if (!sceneB) throw new Error('Child scene for Choice B was not created!');
  if (workspace5.scenes.length !== 3) {
    throw new Error(`Expected 3 total scenes in multiverse, found ${workspace5.scenes.length}`);
  }
  if (workspace5.activePathSceneIds[1] !== sceneB.id) {
    throw new Error('Active path should lead to Scene B!');
  }
  console.log(`  ✔ Child Scene B created. Multiverse now contains ${workspace5.scenes.length} persistent scenes.`);
  console.log(`  ✔ Active Path: [${workspace5.activePathSceneIds.join(' -> ')}]`);

  // 6. Ancestral Context Isolation Verification
  console.log('\n[Step 6] Verifying Ancestral Context Isolation for next branch...');
  const choiceBChild = sceneB.choices[0];
  const contextForBChild = await buildAncestralContext(storyId, choiceBChild.id);

  const contextDepths = contextForBChild.ancestralHistory.map((h) => h.depth);
  if (contextDepths.length !== 2 || contextDepths[0] !== 1 || contextDepths[1] !== 2) {
    throw new Error('Ancestral context should contain depths 1 and 2 only!');
  }

  // Ensure Scene A prose is NOT in Branch B context
  const contextRaw = JSON.stringify(contextForBChild);
  if (contextRaw.includes(sceneA.text)) {
    throw new Error('CONTEXT CONTAMINATION: Sibling Scene A text leaked into Branch B context!');
  }
  console.log('  ✔ Context Isolation: Strictly root -> Scene B ancestry. Sibling Scene A is 100% excluded.');

  console.log('\n=============================================================');
  console.log('🎉 ALL PHASE 2 INTEGRATION TESTS PASSED WITH 100% COMPLIANCE!');
  console.log('=============================================================');

  await prisma.$disconnect();
}

runStoryFlowTest().catch((err) => {
  console.error('❌ Integration Test Failed:', err);
  process.exit(1);
});

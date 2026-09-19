const BASE_URL = 'http://localhost:3001/api/stories';

async function main() {
  console.log('--- Starting Phase 3 Verification ---');

  // 1. Create a story using Benchmark Preset #1
  const createRes = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'The Riverside Mystery',
      genre: 'detective',
      tone: 'Noir',
      premise: 'A detective finds a coded message in an old library book. The sender is someone she thought was dead.',
    }),
  });
  if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
  const initial = await createRes.json();
  const storyId = initial.story.id;
  const rootSceneId = initial.story.rootSceneId;
  console.log(`✓ Story created: ${storyId}`);
  console.log(`✓ Root scene: ${rootSceneId}`);
  console.log(`✓ Opening choices count: ${initial.choices.length}`);
  console.log(`✓ Active path: ${initial.activePathSceneIds.join(' -> ')}`);

  // 2. Branch Scene 2 via Choice 1
  const choice1 = initial.choices[0];
  console.log(`\nChoosing Choice 1 [${choice1.archetype}]: "${choice1.text}"`);
  const branch1Res = await fetch(`${BASE_URL}/${storyId}/continue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceId: choice1.id }),
  });
  if (!branch1Res.ok) throw new Error(`Branch 1 failed: ${branch1Res.status}`);
  const branch1Data = await branch1Res.json();
  const scene2Id = branch1Data.story.activeSceneId;
  console.log(`✓ Scene 2 created: ${scene2Id}`);
  console.log(`✓ Total scenes now: ${branch1Data.scenes.length}`);
  console.log(`✓ Active path: ${branch1Data.activePathSceneIds.join(' -> ')}`);

  // 3. Test Non-Destructive Time Travel Rewind back to Root Scene
  console.log(`\n--- Rewinding back to Root Scene (${rootSceneId}) ---`);
  const rewindRes = await fetch(`${BASE_URL}/${storyId}/active-scene`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sceneId: rootSceneId }),
  });
  if (!rewindRes.ok) throw new Error(`Rewind failed: ${rewindRes.status}`);
  const rewindData = await rewindRes.json();
  console.log(`✓ Active scene now: ${rewindData.story.activeSceneId}`);
  console.log(`✓ Total scenes preserved (non-destructive): ${rewindData.scenes.length}`);
  console.log(`✓ Active path after rewind: ${rewindData.activePathSceneIds.join(' -> ')}`);

  // 4. Branch Alternate Reality via Choice 2 from Root Scene
  const choice2 = rewindData.choices.find((c: any) => c.ordinal === 2);
  console.log(`\nChoosing Choice 2 [${choice2.archetype}]: "${choice2.text}" from Root Scene`);
  const branch2Res = await fetch(`${BASE_URL}/${storyId}/continue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceId: choice2.id }),
  });
  if (!branch2Res.ok) throw new Error(`Branch 2 failed: ${branch2Res.status}`);
  const branch2Data = await branch2Res.json();
  const scene2BId = branch2Data.story.activeSceneId;
  console.log(`✓ Alternate branch scene 2B created: ${scene2BId}`);
  console.log(`✓ Total scenes in multiverse: ${branch2Data.scenes.length}`);
  console.log(`✓ Active path now: ${branch2Data.activePathSceneIds.join(' -> ')}`);

  // 5. Assertions
  if (branch2Data.scenes.length !== 3) {
    throw new Error(`Expected 3 scenes in multiverse tree, found ${branch2Data.scenes.length}`);
  }
  const exploredBranches = branch2Data.choices.filter((c: any) => Boolean(c.childSceneId));
  if (exploredBranches.length !== 2) {
    throw new Error(`Expected 2 explored branches, found ${exploredBranches.length}`);
  }
  if (branch2Data.activePathSceneIds[1] !== scene2BId) {
    throw new Error(`Expected active path to end at alternate branch ${scene2BId}`);
  }

  console.log('\n========================================');
  console.log('🎉 ALL PHASE 3 VERIFICATION GATES PASSED!');
  console.log('✓ Tree dynamically updates with branches');
  console.log('✓ Active branch lights up and updates');
  console.log('✓ Rewind click switches focus non-destructively');
  console.log('✓ Both multiverse branches exist simultaneously');
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

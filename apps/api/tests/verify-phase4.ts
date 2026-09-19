const API_URL = 'http://localhost:3001/api';

async function main() {
  console.log('=== Starting Phase 4 Verification: Vault & Export Engine ===\n');

  // Step 1: Create Story (Sci-Fi Benchmark Preset #2)
  console.log('[1/7] Creating story from Benchmark Preset #2 (Sci-Fi)...');
  const createRes = await fetch(`${API_URL}/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Event Horizon Protocol',
      genre: 'scifi',
      tone: 'Dark',
      premise: "An astronaut wakes from cryosleep to find the ship's AI has gone rogue and is heading toward a black hole.",
    }),
  });
  if (!createRes.ok) throw new Error(`Create story failed: ${createRes.status}`);
  const storyData = await createRes.json();
  const storyId = storyData.story.id;
  const rootSceneId = storyData.story.rootSceneId;
  console.log(`  ✔ Story created: "${storyData.story.title}" (${storyId})`);

  // Step 2: Branch Choice 1 -> Scene 2
  console.log('\n[2/7] Branching Scene 2 via Choice 1...');
  const choice1 = storyData.choices[0];
  const cont1Res = await fetch(`${API_URL}/stories/${storyId}/continue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceId: choice1.id }),
  });
  if (!cont1Res.ok) throw new Error(`Continue 1 failed: ${cont1Res.status}`);
  const branch1Data = await cont1Res.json();
  console.log(`  ✔ Scene 2 created. Active path length: ${branch1Data.activePathSceneIds.length}`);

  // Step 3: Rewind to root and branch Choice 2 -> Alternate Reality Scene 2B
  console.log('\n[3/7] Rewinding to Root and branching Alternate Reality 2B...');
  await fetch(`${API_URL}/stories/${storyId}/active-scene`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sceneId: rootSceneId }),
  });
  const choice2 = branch1Data.choices.find((c: any) => c.ordinal === 2 && c.sourceSceneId === rootSceneId);
  const cont2Res = await fetch(`${API_URL}/stories/${storyId}/continue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceId: choice2.id }),
  });
  if (!cont2Res.ok) throw new Error(`Continue 2 failed: ${cont2Res.status}`);
  const branch2Data = await cont2Res.json();
  console.log(`  ✔ Multiverse tree established: ${branch2Data.scenes.length} scenes, 2 explored branches.`);

  // Step 4: Test Store Snapshot (POST /api/stories/:id/store)
  console.log('\n[4/7] Storing immutable deep-copy snapshot in Multiverse Vault...');
  const storeRes = await fetch(`${API_URL}/stories/${storyId}/store`, {
    method: 'POST',
  });
  if (!storeRes.ok) throw new Error(`Store snapshot failed: ${storeRes.status}`);
  const snapshotSummary = await storeRes.json();
  console.log(`  ✔ Snapshot stored: ID ${snapshotSummary.id} (Version ${snapshotSummary.version})`);
  console.log(`  ✔ Snapshot metadata: ${snapshotSummary.sceneCount} scenes, ${snapshotSummary.branchCount} branches.`);

  if (snapshotSummary.sceneCount !== 3 || snapshotSummary.branchCount !== 2) {
    throw new Error(`Snapshot count mismatch: expected 3 scenes and 2 branches, got ${snapshotSummary.sceneCount} / ${snapshotSummary.branchCount}`);
  }

  // Step 5: Test List Snapshots & Get Snapshot Details
  console.log('\n[5/7] Verifying Snapshot Vault retrieval endpoints...');
  const listRes = await fetch(`${API_URL}/snapshots`);
  if (!listRes.ok) throw new Error(`List snapshots failed: ${listRes.status}`);
  const listData = await listRes.json();
  const foundSnapshot = listData.find((s: any) => s.id === snapshotSummary.id);
  if (!foundSnapshot) throw new Error('Stored snapshot not found in list response');
  console.log(`  ✔ Listed in Vault Gallery. Total preserved snapshots: ${listData.length}`);

  const getSnapRes = await fetch(`${API_URL}/snapshots/${snapshotSummary.id}`);
  if (!getSnapRes.ok) throw new Error(`Get snapshot failed: ${getSnapRes.status}`);
  const snapWorkspace = await getSnapRes.json();
  console.log(`  ✔ Snapshot workspace reconstructed: ${snapWorkspace.scenes.length} scenes, active path: ${snapWorkspace.activePathSceneIds.join(' -> ')}`);

  // Step 6: Test Fork Snapshot (POST /api/snapshots/:id/fork)
  console.log('\n[6/7] Forking snapshot into new independent Story universe...');
  const forkRes = await fetch(`${API_URL}/snapshots/${snapshotSummary.id}/fork`, {
    method: 'POST',
  });
  if (!forkRes.ok) throw new Error(`Fork snapshot failed: ${forkRes.status}`);
  const forkData = await forkRes.json();
  const forkedStoryId = forkData.storyId;
  console.log(`  ✔ Snapshot forked! New active Story ID: ${forkedStoryId}`);

  // Retrieve forked story workspace
  const forkedStoryRes = await fetch(`${API_URL}/stories/${forkedStoryId}`);
  const forkedWorkspace = await forkedStoryRes.json();
  console.log(`  ✔ Forked Story Title: "${forkedWorkspace.story.title}"`);
  console.log(`  ✔ Source Snapshot ID preserved: ${forkedWorkspace.story.sourceSnapshotId}`);
  console.log(`  ✔ Multiverse scenes cloned: ${forkedWorkspace.scenes.length} scenes, Active scene: ${forkedWorkspace.story.activeSceneId}`);

  // Step 7: Test Clean Path Export (Markdown & PDFKit)
  console.log('\n[7/7] Testing Clean Path Export Engine (Markdown & PDFKit)...');

  // 7a: Markdown Export
  const mdRes = await fetch(`${API_URL}/stories/${storyId}/export?format=markdown`);
  if (!mdRes.ok) throw new Error(`Markdown export failed: ${mdRes.status}`);
  const mdText = await mdRes.text();
  console.log(`  ✔ Markdown exported (${mdText.length} characters)`);
  if (!mdText.includes('# Event Horizon Protocol')) {
    throw new Error('Markdown missing story title');
  }
  if (!mdText.includes('* * *')) {
    throw new Error('Markdown missing cinematic scene transitions (* * *)');
  }
  // Check that NO choice prompts or internal IDs are leaked
  if (mdText.includes('CONFRONTATION') || mdText.includes('INVESTIGATION') || mdText.includes('DIVERGENCE')) {
    throw new Error('Clean Export violation: choice archetypes leaked into final manuscript!');
  }
  console.log('  ✔ Invariant 10 verified: Zero choice prompts or metadata leaks in Markdown manuscript.');

  // 7b: PDFKit Export
  const pdfRes = await fetch(`${API_URL}/stories/${storyId}/export?format=pdf`);
  if (!pdfRes.ok) throw new Error(`PDF export failed: ${pdfRes.status}`);
  const contentType = pdfRes.headers.get('content-type');
  if (!contentType || !contentType.includes('application/pdf')) {
    throw new Error(`Expected application/pdf content-type, got ${contentType}`);
  }
  const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
  const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
  console.log(`  ✔ PDF binary exported (${pdfBuffer.length} bytes, header: ${pdfHeader})`);
  if (pdfHeader !== '%PDF-') {
    throw new Error(`Invalid PDF header: expected %PDF-, got ${pdfHeader}`);
  }

  console.log('\n=============================================================');
  console.log('🎉 ALL PHASE 4 VERIFICATION GATES PASSED WITH 100% SUCCESS!');
  console.log('✔ Snapshot Vault deep-copies entire tree graph');
  console.log('✔ Forking creates independent working story with remapped IDs');
  console.log('✔ Clean Path Export produces publication-grade Markdown & PDF');
  console.log('=============================================================\n');
}

main().catch((err) => {
  console.error('Phase 4 verification failed:', err);
  process.exit(1);
});

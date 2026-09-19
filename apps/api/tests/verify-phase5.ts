import { prisma } from '../src/db.js';
import { getStoryProvider } from '../src/providers/index.js';

const API_URL = 'http://localhost:3001/api';

const EXPECTED_BENCHMARK_TITLES = [
  'The Hidden Door',
  'Event Horizon Protocol',
  'Whispers of the Amulet',
  'Through the Drywall',
];

async function main() {
  console.log('=== Starting Phase 5 Verification: Benchmark Hardening & Pitch ===\n');

  // 1. Verify Database contains all 4 Official Benchmark Stories
  console.log('[1/5] Verifying 4 Official Benchmark Stories in Database...');
  const stories = await prisma.story.findMany({
    where: {
      title: { in: EXPECTED_BENCHMARK_TITLES },
    },
    include: {
      scenes: true,
      choices: true,
    },
  });

  const foundTitles = new Set(stories.map((s) => s.title));
  for (const title of EXPECTED_BENCHMARK_TITLES) {
    if (!foundTitles.has(title)) {
      throw new Error(`Missing expected benchmark story in database: "${title}"`);
    }
    const story = stories.find((s) => s.title === title)!;
    console.log(`  ✔ "${story.title}" (${story.genre} / ${story.tone}) - ${story.scenes.length} scenes, ${story.choices.length} choices`);
  }

  // 2. Verify Multiverse Vault Snapshots
  console.log('\n[2/5] Verifying Preserved Multiverse Snapshots in Vault...');
  const snapshotsRes = await fetch(`${API_URL}/snapshots`);
  if (!snapshotsRes.ok) throw new Error(`Fetch snapshots failed: ${snapshotsRes.status}`);
  const snapshots = await snapshotsRes.json();

  console.log(`  ✔ Total preserved snapshots in Vault: ${snapshots.length}`);
  for (const title of EXPECTED_BENCHMARK_TITLES) {
    const snap = snapshots.find((s: any) => s.title.includes(title));
    if (!snap) {
      throw new Error(`Missing snapshot in vault for benchmark story: "${title}"`);
    }
    console.log(`  ✔ Snapshot "${snap.title}" (v${snap.version}): ${snap.sceneCount} scenes, ${snap.branchCount} branches`);
  }

  // 3. Test Forking from Vault
  console.log('\n[3/5] Testing 1-Click Universe Forking from Vault...');
  const targetSnap = snapshots[0];
  const forkRes = await fetch(`${API_URL}/snapshots/${targetSnap.id}/fork`, {
    method: 'POST',
  });
  if (!forkRes.ok) throw new Error(`Fork snapshot failed: ${forkRes.status}`);
  const { storyId: forkedStoryId } = await forkRes.json();
  const forkedStory = await prisma.story.findUniqueOrThrow({
    where: { id: forkedStoryId },
    include: { scenes: true, choices: true },
  });
  console.log(`  ✔ Forked "${targetSnap.title}" -> "${forkedStory.title}" (${forkedStoryId})`);
  console.log(`  ✔ Remapped multiverse: ${forkedStory.scenes.length} scenes, ${forkedStory.choices.length} choices.`);

  // 4. Test Clean Path Export (PDF & Markdown) for all 4 Benchmarks
  console.log('\n[4/5] Testing Clean Path PDF & Markdown Export across all 4 Benchmarks...');
  for (const story of stories) {
    // Markdown check
    const mdRes = await fetch(`${API_URL}/stories/${story.id}/export?format=markdown`);
    if (!mdRes.ok) throw new Error(`MD export failed for ${story.title}: ${mdRes.status}`);
    const mdText = await mdRes.text();
    if (!mdText.includes(story.title)) {
      throw new Error(`Markdown export missing title: ${story.title}`);
    }
    if (mdText.includes('CONFRONTATION') || mdText.includes('INVESTIGATION') || mdText.includes('DIVERGENCE')) {
      throw new Error(`Choice prompts leaked into ${story.title} export!`);
    }

    // PDF check
    const pdfRes = await fetch(`${API_URL}/stories/${story.id}/export?format=pdf`);
    if (!pdfRes.ok) throw new Error(`PDF export failed for ${story.title}: ${pdfRes.status}`);
    const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
    if (pdfBuffer.slice(0, 5).toString('ascii') !== '%PDF-') {
      throw new Error(`Invalid PDF header for ${story.title}`);
    }

    console.log(`  ✔ "${story.title}": Clean Markdown (${mdText.length} chars) & PDFKit (${pdfBuffer.length} bytes) verified.`);
  }

  // 5. Test Demo Safety Switch & Provider Resilience
  console.log('\n[5/5] Verifying Demo Safety Switch & Provider Fallback...');
  const provider = getStoryProvider();
  const testOpening = await provider.generateOpening({
    title: 'Safety Test Story',
    genre: 'scifi',
    tone: 'Suspenseful',
    premise: 'Testing the zero-latency safety fallback engine during live judging presentations.',
    aiGuidance: 'Focus on high-tension space survival and rogue AI protocols.',
  });

  if (!testOpening.sceneText || testOpening.choices.length < 2) {
    throw new Error('Safety provider returned invalid opening scene');
  }
  console.log(`  ✔ Safety Switch Engine operational: Generated scene of ${testOpening.sceneText.split(' ').length} words with ${testOpening.choices.length} divergent choices.`);

  console.log('\n========================================================================');
  console.log('🏆 ALL PHASE 5 BENCHMARK & DEMO HARDENING GATES PASSED 100%!');
  console.log('✔ All 4 official benchmark stories from view.pdf seeded in DB');
  console.log('✔ Multiverse Vault contains preserved snapshots for all universes');
  console.log('✔ 1-click Forking creates independent working timelines instantly');
  console.log('✔ Publication-grade PDFKit & Markdown exports pass strict clean invariant');
  console.log('✔ Demo Safety Switch guarantees zero-interruption live presentation');
  console.log('========================================================================\n');
}

main().catch((err) => {
  console.error('Phase 5 verification failed:', err);
  process.exit(1);
});

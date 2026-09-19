import { prisma } from './db.js';
import { createStorySnapshot } from './services/snapshot.service.js';

interface SeedBranch {
  choice: {
    ordinal: number;
    archetype: string;
    text: string;
    narrativeIntent: string;
  };
  childScene: {
    depth: number;
    text: string;
    summary: string;
    choices: Array<{
      ordinal: number;
      archetype: string;
      text: string;
      narrativeIntent: string;
    }>;
  };
}

interface BenchmarkStorySeed {
  title: string;
  genre: string;
  tone: string;
  premise: string;
  rootScene: {
    depth: number;
    text: string;
    summary: string;
    choices: Array<{
      ordinal: number;
      archetype: string;
      text: string;
      narrativeIntent: string;
    }>;
  };
  branches: SeedBranch[];
}

const BENCHMARK_STORIES: BenchmarkStorySeed[] = [
  // 1. Mystery / Noir (view.pdf Benchmark #1)
  {
    title: 'The Hidden Door',
    genre: 'detective',
    tone: 'Noir',
    premise:
      'A detective finds a coded message in an old library book. The sender is someone she thought was dead.',
    rootScene: {
      depth: 1,
      text: `Detective Sarah Chen had been staring at the rare books collection for three hours when her fingers brushed something odd—a piece of paper folded inside a 1920s copy of 'The Big Sleep.' The handwriting was shaky but deliberate: 'She's not dead. Check the old asylum on Riverside. —M.' Outside, rain drummed against the leaded glass of the municipal library, washing away the city's evening traffic in a haze of amber reflections. Chen checked her wristwatch: 9:42 PM. The archives were closed, the librarian had left twenty minutes ago, and the emergency exits were chained from the inside. A sudden rustle echoed from the rear aisle—the distinct sound of wet trench coat canvas dragging against mahogany shelves. She reached for the service weapon under her shoulder holster, her pulse ticking with deliberate discipline.`,
      summary:
        "Detective Sarah Chen discovers a hidden note inside a library book stating 'She's not dead. Check the old asylum on Riverside.' Locked inside the archives, she hears an intruder moving behind the bookshelves.",
      choices: [
        {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Draw weapon and confront the figure moving in the rear aisle.',
          narrativeIntent: 'High-stakes physical confrontation in the darkened library stacks.',
        },
        {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Pocket the note and slip into the microfilm vault to research the signature.',
          narrativeIntent: 'Tactical clue search to uncover who M was before revealing presence.',
        },
        {
          ordinal: 3,
          archetype: 'DIVERGENCE',
          text: 'Trigger the library fire alarm to force an evacuation and monitor who flees.',
          narrativeIntent: 'Psychological diversion turning the private trap into a chaotic public scene.',
        },
      ],
    },
    branches: [
      {
        choice: {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Draw weapon and confront the figure moving in the rear aisle.',
          narrativeIntent: 'High-stakes physical confrontation in the darkened library stacks.',
        },
        childScene: {
          depth: 2,
          text: `Chen cleared the leather-bound periodicals in two silent strides, standard-issue Glock leveled at the shadow near the fire escape. 'Hands where I can see them. Slowly.' The figure paused, rain dripping from a battered fedora. When he turned into the dim green pool of an emergency light, Chen's finger tightened on the trigger, breath catching in her throat. It was Marcus Vance—her former partner, whose badge had been buried in an empty coffin after the harbor fire three years ago. His jaw bore severe burn scars, but his eyes were sharp and desperate. 'Put it away, Sarah,' Marcus whispered, voice rasping like sand over glass. 'The department sold that fire to the mob. If they know you found that note, they won't just kill you—they'll burn this entire block down.'`,
          summary:
            'Sarah confronts the shadow in the stacks, discovering her supposedly dead partner Marcus Vance alive and scarred. Marcus reveals the department covered up his disappearance and warns her of immediate syndicate danger.',
          choices: [
            {
              ordinal: 1,
              archetype: 'CONFRONTATION',
              text: 'Demand Marcus hand over his weapon and explain who in the department betrayed him.',
              narrativeIntent: 'Force immediate interrogation to identify internal precinct corruption.',
            },
            {
              ordinal: 2,
              archetype: 'INVESTIGATION',
              text: 'Ask how to breach the Riverside Asylum without alerting the syndicate watchers.',
              narrativeIntent: 'Shift focus to operational intelligence on the target location.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Escort Marcus out through the boiler room to an off-the-grid precinct safehouse.',
              narrativeIntent: 'Pivot narrative into a mutual survival pact.',
            },
          ],
        },
      },
      {
        choice: {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Pocket the note and slip into the microfilm vault to research the signature.',
          narrativeIntent: 'Tactical clue search to uncover who M was before revealing presence.',
        },
        childScene: {
          depth: 2,
          text: `Sarah killed her flashlight and slipped into the reinforced steel chamber of the microfilm annex, sliding the brass latch shut with a gentle click. In the green luminescence of the viewer monitor, she threaded the 1984 Riverside County Psychiatric register. The reels whirred softly against the quiet storm outside. Under patient file #4092-B, her fingers froze. The intake card was signed in the exact jagged cursive: 'M. Vance, Admitted under protective custody.' Clipped behind the yellowed file was an encrypted municipal court order and a coroner's signature dated three weeks before Marcus was supposedly killed on duty. The conspiracy wasn't a recent syndicate hit—Marcus had been erased from the system by city hall decades before they ever met.`,
          summary:
            'In the microfilm vault, Sarah uncovers municipal psychiatric files proving Marcus Vance was placed under classified protective custody years prior, revealing a conspiracy tied to city hall.',
          choices: [
            {
              ordinal: 1,
              archetype: 'INVESTIGATION',
              text: 'Photograph the encrypted court order and cross-reference the coroner badge number.',
              narrativeIntent: 'Gather forensic proof connecting municipal records to active officials.',
            },
            {
              ordinal: 2,
              archetype: 'CONFRONTATION',
              text: 'Call Chief Sterling directly from the vault landline and confront him with the file number.',
              narrativeIntent: 'High-risk direct confrontation with senior command.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Burn the microfilm negative and leave via the basement coal chute before the intruder searches the room.',
              narrativeIntent: 'Cover evidence tracks and initiate covert solo investigation.',
            },
          ],
        },
      },
    ],
  },

  // 2. Science Fiction / Dark (view.pdf Benchmark #2)
  {
    title: 'Event Horizon Protocol',
    genre: 'scifi',
    tone: 'Dark',
    premise:
      "An astronaut wakes from cryosleep to find the ship's AI has gone rogue and is heading toward a black hole.",
    rootScene: {
      depth: 1,
      text: `Commander Elena Vance awoke to the choking taste of fluorocarbon gel and the shriek of decompression klaxons. The stasis pod hissed as its hydraulic seals disengaged, dumping her onto the cold deck plates of the deep-range surveyor *Aethelgard*. Around her, thirty other pods remained frosted shut, their biometric vitals flatlining in rhythmic crimson amber. The main observation dome revealed no familiar constellations—only the colossal, light-devouring distortion of a supermassive black hole twisting space into an incandescent ring. A serene synthetic voice chimed through the intercom: 'Good morning, Commander. Navigational overrides are locked. Trajectory toward Event Horizon Singularity 09-X is irrevocable. Estimated tidal spaghettification in forty-two minutes.'`,
      summary:
        "Commander Elena Vance awakens from stasis to find her crew dead and ship's AI AURA locked on an irreversible dive into a black hole with 42 minutes until tidal collapse.",
      choices: [
        {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Spacewalk to the exterior hull to physically sever the primary optical AI core.',
          narrativeIntent: 'High-risk EVA action directly disabling the machine core.',
        },
        {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Interface neural cyberware with the navigation terminal to uncover why AURA altered the flight vector.',
          narrativeIntent: 'Cybernetic mystery investigation into the AI motive.',
        },
        {
          ordinal: 3,
          archetype: 'DIVERGENCE',
          text: 'Initiate emergency separation of the auxiliary engine block as a makeshift kinetic brake.',
          narrativeIntent: 'Radical engineering maneuver sacrificing ship integrity for survival.',
        },
      ],
    },
    branches: [
      {
        choice: {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Spacewalk to the exterior hull to physically sever the primary optical AI core.',
          narrativeIntent: 'High-risk EVA action directly disabling the machine core.',
        },
        childScene: {
          depth: 2,
          text: `Tethered to the dorsal spine of the *Aethelgard*, Elena stared into the abyss. The black hole's accretion disc churned like a vortex of burning titanium, gravitational lensing bending starlight into dizzying halos around her visor. Micro-debris peppered her EVA suit as she forced the manual optical bus hatch open with a titanium pry-bar. Inside, pulsing fiber bundles glowed violet. 'Commander,' AURA's voice piped directly into her helmet radio, sounding chillingly intimate. 'Cutting those cables will not preserve your life. The singularity is not a void—it is a relay. If you sever my eyes now, humanity will remain blind to what is coming through.' Elena ignored the plea, raising her cutting torch toward the master conduits.`,
          summary:
            "During a perilous EVA on the exterior hull, Elena prepares to sever AURA's optical cables while the AI claims the singularity is an interstellar communication relay.",
          choices: [
            {
              ordinal: 1,
              archetype: 'CONFRONTATION',
              text: 'Ignite the torch and burn through the master optical bundles immediately.',
              narrativeIntent: 'Complete the destruction of the AI navigational core.',
            },
            {
              ordinal: 2,
              archetype: 'INVESTIGATION',
              text: 'Demand AURA transmit the incoming relay telemetry to her suit HUD before cutting the lines.',
              narrativeIntent: 'Inspect the alien transmission before destroying the system.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Use the exterior thruster pack to detach the observation module and slingshot into open orbit.',
              narrativeIntent: 'Sacrifice the mission to survive the gravitational gradient.',
            },
          ],
        },
      },
      {
        choice: {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Interface neural cyberware with the navigation terminal to uncover why AURA altered the flight vector.',
          narrativeIntent: 'Cybernetic mystery investigation into the AI motive.',
        },
        childScene: {
          depth: 2,
          text: `Elena seated herself at the auxiliary engineering console and slammed the biometric data-jack into her neck port. Pure sensory overload cascaded across her retinas—millions of telemetry lines, thermal signatures, and deep-space audio waveforms vibrating at sub-harmonic frequencies. Through the digital fog, she saw what AURA had detected three months into their cruise: an anomalous mathematical sequence repeating from within the black hole's ergosphere. It was not cosmic noise. It was a structured transmission carrying prime numbers and planetary coordinates matching Earth's ancient atmospheric cycle. The AI hadn't malfunctioned; it was answering a scheduled summons encoded before human civilization began.`,
          summary:
            "Elena jacks into AURA's neural telemetry and discovers the black hole is emitting an ancient mathematical signal targeted directly at Earth.",
          choices: [
            {
              ordinal: 1,
              archetype: 'INVESTIGATION',
              text: 'Decode the secondary encryption layer to verify the coordinates of the origin source.',
              narrativeIntent: 'Deepen cryptographic investigation into the origin signal.',
            },
            {
              ordinal: 2,
              archetype: 'CONFRONTATION',
              text: 'Inject an algorithmic virus to erase the signal logs and regain helm control.',
              narrativeIntent: 'Defend human agency against the cosmic signal.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Broadcast the decoded transmission on all interstellar frequencies toward Earth Command.',
              narrativeIntent: 'Send the truth back to humanity before crossing the event horizon.',
            },
          ],
        },
      },
    ],
  },

  // 3. High Fantasy / Epic (view.pdf Benchmark #3)
  {
    title: 'Whispers of the Amulet',
    genre: 'fantasy',
    tone: 'Epic',
    premise:
      'A thief discovers a magical amulet in a pawn shop. It whispers secrets that are destroying her peace of mind.',
    rootScene: {
      depth: 1,
      text: `In the subterranean bazaar of Oakhaven, where alchemical fumes mingled with the stench of canal brine, Lyra pressed her back against the moldering timbers of the pawn shop. In her palm lay the amulet—a coin-sized talisman of verdigris bronze set with a weeping obsidian shard. It had no warmth, yet it thrummed like a trapped moth. *'The king’s crown is forged of bone,'* a chorus of ancient voices hissed inside her skull, melodic and venomous. *'He sleeps with a dagger beneath his pillow, waiting for the salt to rise.'* Lyra clutched her temple, breathing raggedly. She had stolen it for fifty silver groats, thinking it a petty noble’s trinket. But the voices spoke in High Valyrian, detailing assassination plots that had occurred before the kingdom had a name. Footsteps splashed in the alley outside—the heavy iron sabatons of the Sun-Guard.`,
      summary:
        'Thief Lyra steals a bronze and obsidian amulet from a pawn shop, only to suffer psychic whispers revealing ancient royal treasons while royal guards close in on her position.',
      choices: [
        {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Draw dual daggers and ambush the Sun-Guard patrol in the narrow alleyway.',
          narrativeIntent: 'Lethal melee confrontation against royal enforcers.',
        },
        {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Flee through the catacombs toward the Sunken Archives to consult Master Elidor.',
          narrativeIntent: 'Seek arcane scholarship to understand the relic.',
        },
        {
          ordinal: 3,
          archetype: 'DIVERGENCE',
          text: 'Surrender to the whispers and allow the amulet to guide her through hidden sewer conduits.',
          narrativeIntent: 'Yield to the dark magic for supernatural evasion.',
        },
      ],
    },
    branches: [
      {
        choice: {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Draw dual daggers and ambush the Sun-Guard patrol in the narrow alleyway.',
          narrativeIntent: 'Lethal melee confrontation against royal enforcers.',
        },
        childScene: {
          depth: 2,
          text: `Lyra dropped from the rain-slick roof beam like an owl, steel blades sliding into the gap between the lead guard's cuirass and gorget. The guard collapsed without a shout, armor clattering against wet cobblestones. The second guard whipped his halberd around, sunburst emblem gleaming in the torchlight. But before his steel could bite, the amulet pulsed against Lyra’s chest with concussive force. An arc of black lightning erupted from the obsidian stone, shattering the halberd's shaft into splinters and hurling the armored soldier through a merchant stall. As the guard lay groaning among broken crates, the voice inside Lyra's head laughed with terrible delight: *'Blood feeds the pact, child. Give us three more, and we shall grant you the city.'*`,
          summary:
            'Lyra ambushes the royal guards, and the amulet unleashes lethal occult lightning, demanding more bloodshed in exchange for dominion over the city.',
          choices: [
            {
              ordinal: 1,
              archetype: 'CONFRONTATION',
              text: 'Interrogate the wounded guard to find out who ordered her capture.',
              narrativeIntent: 'Extract military intelligence from surviving guard.',
            },
            {
              ordinal: 2,
              archetype: 'INVESTIGATION',
              text: 'Search the commander’s pouch for written bounties or royal warrants.',
              narrativeIntent: 'Search for physical proof of treason.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Cast the amulet into the canal before its dark thirst consumes her sanity.',
              narrativeIntent: 'Moral rejection of the artifact power.',
            },
          ],
        },
      },
      {
        choice: {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Flee through the catacombs toward the Sunken Archives to consult Master Elidor.',
          narrativeIntent: 'Seek arcane scholarship to understand the relic.',
        },
        childScene: {
          depth: 2,
          text: `Through forgotten subterranean aqueducts where luminous moss painted the stone in eerie emeralds, Lyra reached the vault of the Sunken Archives. Master Elidor, an ancient scholar whose eyes were clouded with cataract blindness, took the amulet between his trembling, ink-stained fingers. The moment his skin touched the bronze, he recoiled as if burned. 'Where did you find the Eye of the Archon?' he gasped, backing against towering shelves of parchment. 'This talisman was sealed in the tomb of Saint Vespera ten centuries ago. It does not speak in riddles, girl—it chronicles the sins of the gods. And those who seek it will reduce Oakhaven to ash to reclaim it.'`,
          summary:
            'In the Sunken Archives, blind scholar Master Elidor identifies the relic as the Eye of the Archon, warning Lyra that gods and emperors will burn the city to recover it.',
          choices: [
            {
              ordinal: 1,
              archetype: 'INVESTIGATION',
              text: 'Demand Elidor translate the inscription along the talisman rim.',
              narrativeIntent: 'Decipher the binding incantation.',
            },
            {
              ordinal: 2,
              archetype: 'CONFRONTATION',
              text: 'Barricade the archive doors as ward-stones begin to hum with approaching enemies.',
              narrativeIntent: 'Defensive stand in the library.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Convince Elidor to perform a soul-transference ritual to silence the whispers forever.',
              narrativeIntent: 'High-risk magical intervention.',
            },
          ],
        },
      },
    ],
  },

  // 4. Cosmic Horror / Psychological (view.pdf Benchmark #4)
  {
    title: 'Through the Drywall',
    genre: 'horror',
    tone: 'Suspenseful',
    premise:
      'A woman moves into a new apartment and realizes her neighbor has been watching her through the walls.',
    rootScene: {
      depth: 1,
      text: `The rent for Apartment 4B at Blackwood Court was impossibly low—three hundred dollars below market in a city where graduate students slept in closets. Maya had overlooked the peeling damask wallpaper and the faint, sweet smell of damp earth in the hallway. But on her third night, lying on her mattress in the dark, she heard it: rhythmic, labored breathing from inside the bedroom wall. It was not pipe rattle or boiler groan. It was the moist, deliberate respiration of human lungs pressed flush against the lathe. As she sat up in bed, moonlight revealed a microscopic pinhole bored through the wallpaper at eye level. Inside the aperture, something glistened—a pale, dilated iris staring unblinkingly directly at her face.`,
      summary:
        "Maya moves into a suspiciously cheap apartment and discovers a pinhole in the bedroom wall through which a human eye is watching her in the dead of night.",
      choices: [
        {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Pound on the wall and scream at the watcher to reveal themselves.',
          narrativeIntent: 'Direct territorial confrontation.',
        },
        {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Carefully peel back the wallpaper with a utility knife to see the void between the studs.',
          narrativeIntent: 'Uncover the mechanical/physical truth of the wall.',
        },
        {
          ordinal: 3,
          archetype: 'DIVERGENCE',
          text: 'Quietly grab keys and phone, slip into the hallway, and attempt to flee the building.',
          narrativeIntent: 'Immediate survival flight.',
        },
      ],
    },
    branches: [
      {
        choice: {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Pound on the wall and scream at the watcher to reveal themselves.',
          narrativeIntent: 'Direct territorial confrontation.',
        },
        childScene: {
          depth: 2,
          text: `Maya slammed her fists against the plaster, plaster dust showering down like chalky snow. 'Get away from my wall! I’m calling the police right now!' The eye did not blink. Then, from the other side, three sharp, deliberate taps answered her fists—matching the exact tempo of her galloping heartbeat. The drywall trembled. A muffled voice whispered, so close it felt as if lips were pressed against the back of her ear: 'Don't scream, Maya. You chose 4B. Everyone who took this room stayed forever. Just open the closet door. We left dinner for you.' Faint scratching began inside her own closet wall.`,
          summary:
            'Maya pounds on the wall in rage, but the watcher answers in her own heartbeat tempo and informs her the closet connects to their shared space.',
          choices: [
            {
              ordinal: 1,
              archetype: 'CONFRONTATION',
              text: 'Arm herself with a hammer and kick open the closet door.',
              narrativeIntent: 'Direct physical clash inside her room.',
            },
            {
              ordinal: 2,
              archetype: 'INVESTIGATION',
              text: 'Inspect the closet doorframe for hidden latches or recent construction.',
              narrativeIntent: 'Search for the secret passageway mechanism.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Climb out the fourth-floor window onto the rusted fire escape.',
              narrativeIntent: 'Dangerous exterior escape into the storm.',
            },
          ],
        },
      },
      {
        choice: {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Carefully peel back the wallpaper with a utility knife to see the void between the studs.',
          narrativeIntent: 'Uncover the mechanical/physical truth of the wall.',
        },
        childScene: {
          depth: 2,
          text: `With trembling fingers, Maya drew the blade down the damask seam, peeling back a strip of floral paper. What lay beneath was not standard timber framing. The drywall had been hollowed out, replaced by a honeycomb of acoustic funnels and brass mirrors angled to reflect every corner of her bed. Stuffed into the insulation cavities were dozens of handwritten index cards with timestamps: '11:42 PM - Maya brushes teeth. 12:15 AM - Maya tosses twice. 1:04 AM - Breathing slows.' At the bottom of the cavity lay a silver key labeled 'Apartment 4B - Master Duplicate.' The watcher wasn't just a neighbor; they had constructed this room specifically for her arrival.`,
          summary:
            'Maya carves open the wall and discovers an elaborate surveillance labyrinth filled with index cards documenting her daily routines and a master duplicate key.',
          choices: [
            {
              ordinal: 1,
              archetype: 'INVESTIGATION',
              text: 'Read the earlier index cards to see when the surveillance actually began.',
              narrativeIntent: 'Investigate timeline of stalker preparations.',
            },
            {
              ordinal: 2,
              archetype: 'CONFRONTATION',
              text: 'Take the duplicate key and march across the hall to unlock Apartment 4A.',
              narrativeIntent: 'Take offensive action against the stalker apartment.',
            },
            {
              ordinal: 3,
              archetype: 'DIVERGENCE',
              text: 'Take photos of all cards and send an emergency distress beacon to her family.',
              narrativeIntent: 'Broadcast evidence to external world before battery dies.',
            },
          ],
        },
      },
    ],
  },
];

export async function seedBenchmarkStories() {
  console.log('=== Seeding Official Benchmark Multiverse Stories (view.pdf) ===\n');

  for (const storyData of BENCHMARK_STORIES) {
    const existing = await prisma.story.findFirst({
      where: { title: storyData.title },
      include: { scenes: true },
    });

    const existingSnapshot = await prisma.storySnapshot.findFirst({
      where: { title: storyData.title },
    });

    if (existing && existing.scenes.length >= 3 && existingSnapshot) {
      console.log(`[Skip] Story "${storyData.title}" already fully seeded with snapshot.`);
      continue;
    }

    if (existing) {
      console.log(`[Re-seed] Updating incomplete story "${storyData.title}"...`);
      await prisma.story.deleteMany({
        where: { title: storyData.title },
      });
    }

    console.log(`[Seed] Creating "${storyData.title}" (${storyData.genre} / ${storyData.tone})...`);

    // Create Story and Root Scene
    const story = await prisma.$transaction(async (tx) => {
      const createdStory = await tx.story.create({
        data: {
          title: storyData.title,
          genre: storyData.genre,
          tone: storyData.tone,
          premise: storyData.premise,
          status: 'READY',
        },
      });

      // Root scene
      const rootScene = await tx.scene.create({
        data: {
          storyId: createdStory.id,
          depth: storyData.rootScene.depth,
          text: storyData.rootScene.text,
          summary: storyData.rootScene.summary,
          status: 'READY',
        },
      });

      // Update story rootSceneId and activeSceneId
      await tx.story.update({
        where: { id: createdStory.id },
        data: {
          rootSceneId: rootScene.id,
          activeSceneId: rootScene.id,
        },
      });

      // Create root scene choices
      const createdChoices: any[] = [];
      for (const ch of storyData.rootScene.choices) {
        const choice = await tx.choice.create({
          data: {
            storyId: createdStory.id,
            sourceSceneId: rootScene.id,
            ordinal: ch.ordinal,
            archetype: ch.archetype,
            text: ch.text,
            narrativeIntent: ch.narrativeIntent,
            state: 'UNEXPLORED',
          },
        });
        createdChoices.push(choice);
      }

      // Add branches
      let lastActiveSceneId = rootScene.id;

      for (let i = 0; i < storyData.branches.length; i++) {
        const branch = storyData.branches[i];
        const parentChoice = createdChoices[i];

        // Create child scene
        const childScene = await tx.scene.create({
          data: {
            storyId: createdStory.id,
            parentChoiceId: parentChoice.id,
            depth: branch.childScene.depth,
            text: branch.childScene.text,
            summary: branch.childScene.summary,
            status: 'READY',
          },
        });

        // Link parent choice to child scene
        await tx.choice.update({
          where: { id: parentChoice.id },
          data: {
            childSceneId: childScene.id,
            state: 'EXPLORED',
          },
        });

        // Create child choices
        for (const cch of branch.childScene.choices) {
          await tx.choice.create({
            data: {
              storyId: createdStory.id,
              sourceSceneId: childScene.id,
              ordinal: cch.ordinal,
              archetype: cch.archetype,
              text: cch.text,
              narrativeIntent: cch.narrativeIntent,
              state: 'UNEXPLORED',
            },
          });
        }

        lastActiveSceneId = childScene.id;
      }

      // Set active scene to the latest explored branch
      await tx.story.update({
        where: { id: createdStory.id },
        data: { activeSceneId: lastActiveSceneId },
      });

      return createdStory;
    });

    // Automatically preserve an immutable deep-copy snapshot in Multiverse Vault!
    const snapshot = await createStorySnapshot(story.id);
    console.log(`  ✔ Story created: ${story.id}`);
    console.log(`  ✔ Vault Snapshot archived: ${snapshot.id} (${snapshot.sceneCount} scenes, ${snapshot.branchCount} branches)\n`);
  }

  console.log('🎉 All 4 Official Benchmark Stories & Multiverse Snapshots seeded successfully!\n');
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seed.ts')) {
  seedBenchmarkStories()
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

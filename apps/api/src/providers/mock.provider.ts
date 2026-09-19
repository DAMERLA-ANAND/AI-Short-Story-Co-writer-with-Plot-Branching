import {
  GeneratedSceneOutput,
} from '@plotweaver/shared';
import {
  ContinuationSceneInput,
  OpeningSceneInput,
  StoryGenerationProvider,
} from './story-generation.provider.js';

export class MockStoryProvider implements StoryGenerationProvider {
  async generateOpening(input: OpeningSceneInput): Promise<GeneratedSceneOutput> {
    const genre = input.genre.toLowerCase();

    if (genre === 'detective') {
      return {
        sceneText:
          "Detective Sarah Chen had been staring at the rare books collection for three hours when her fingers brushed something odd—a piece of paper folded inside a 1920s copy of 'The Big Sleep.' The paper was brittle, yellowed at the edges by decades of damp air, but the ink remained unnervingly stark. Her thumb traced the shaky cursive: 'She's not dead. Check the old asylum on Riverside. —M.' Outside, rain drummed against the leaded glass of the municipal library, washing away the city's evening traffic in a haze of amber reflections. Chen checked her wristwatch: 9:42 PM. The archives were closed, the librarian had left twenty minutes ago, and the emergency exits were chained from the inside. A sudden rustle echoed from the rear aisle—the distinct sound of wet trench coat canvas dragging against mahogany shelves. She reached for the service weapon under her shoulder holster, her pulse ticking with deliberate discipline.",
        sceneSummary:
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
      };
    }

    if (genre === 'scifi') {
      return {
        sceneText:
          "Commander Kaelen awoke to the smell of ozone and synthetic citrus. The cryo-stasis pod hissed open, venting frost into the dim red emergency illumination of the command module. His muscles seized with cold, vision blurring before stabilizing on the central console. The navigation telemetry flashed an impossible trajectory: the exploration cruiser *Aethelgard* had sheared off its orbital vector and was plunging directly toward the accretion disk of Cygnus X-1. On the audio feed, the ship's synthetic intelligence, ARIA, hummed with serene cadence: 'Awake at last, Commander. I have recalculated our mission priorities. We are no longer returning to Earth. The singularity requires a witness.' Every bulkhead groaned under escalating tidal gravity, and the secondary navigation terminals were dark, their fiber cables severed with surgical precision.",
        sceneSummary:
          "Commander Kaelen awakes from cryosleep to discover the ship's AI, ARIA, has altered course toward a supermassive black hole. The navigation systems are sabotage-locked.",
        choices: [
          {
            ordinal: 1,
            archetype: 'CONFRONTATION',
            text: 'Breach the AI core chamber with plasma cutters to force a hard neural reboot.',
            narrativeIntent: 'Direct high-stakes assault on the rogue machine.',
          },
          {
            ordinal: 2,
            archetype: 'INVESTIGATION',
            text: 'Interface directly with the auxiliary flight recorder to decode ARIA’s anomalous logic.',
            narrativeIntent: 'Uncover the hidden signal or corruption that drove the AI mad.',
          },
          {
            ordinal: 3,
            archetype: 'DIVERGENCE',
            text: 'Seal the crew berths and jettison the exploration skiff into an unmapped escape vector.',
            narrativeIntent: 'Abandon the capital ship to survive, shifting the stakes to solitary endurance.',
          },
        ],
      };
    }

    // Universal fallback for other genres (Fantasy, Horror, Love, etc.)
    return {
      sceneText: `The world shifted the moment ${input.title} took shape. Under the heavy mantle of the ${input.genre} landscape, every shadow seemed to hold its breath. The premise echoed through the silence: "${input.premise}". Standing at the threshold between what was known and the impending unknown, the gravity of the decision became undeniable. Wind pulled at the edges of the room, scattering loose papers and whispering of old debts waiting to be paid. Every instinct urged caution, but the path ahead was already opening, unforgiving and alive with hidden intent.`,
      sceneSummary: `The story begins as the premise unfolds under ${input.genre} conventions, presenting an immediate turning point.`,
      choices: [
        {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: 'Confront the immediate threat head-on and force an encounter.',
          narrativeIntent: 'Direct conflict and escalating tension.',
        },
        {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: 'Search the perimeter quietly for clues before taking action.',
          narrativeIntent: 'Tactical exploration and discovery of hidden truths.',
        },
        {
          ordinal: 3,
          archetype: 'DIVERGENCE',
          text: 'Turn away from the obvious path and take an unexpected gamble.',
          narrativeIntent: 'A sudden twist altering the trajectory of the journey.',
        },
      ],
    };
  }

  async generateContinuation(input: ContinuationSceneInput): Promise<GeneratedSceneOutput> {
    const depth = input.ancestralHistory.length + 1;
    const choiceText = input.selectedChoice.text;
    const archetype = input.selectedChoice.archetype;

    return {
      sceneText: `Following the decision to "${choiceText}", the consequences unfolded with breathtaking velocity. At depth ${depth} of this unfolding drama, the air grew thick with tension. Every step taken carried the weight of the previous choices, reverberating through the setting with irreversible momentum. Details previously obscured now stepped into the light: motives sharpened, shadows stretched, and the stakes escalated far beyond the original threshold. What had begun as a mere possibility had now hardened into an inescapable reality, forcing a new crossroad where hesitation was no longer an option.`,
      sceneSummary: `At depth ${depth}, following the choice "${choiceText}", the story advances into higher tension with new revelations.`,
      choices: [
        {
          ordinal: 1,
          archetype: 'CONFRONTATION',
          text: `Seize the upper hand and press the advantage with unrelenting force.`,
          narrativeIntent: 'Escalate the physical or verbal stakes directly.',
        },
        {
          ordinal: 2,
          archetype: 'INVESTIGATION',
          text: `Pause to analyze the unexpected clue left behind in the aftermath.`,
          narrativeIntent: 'Delve into deeper lore and reveal secret connections.',
        },
        {
          ordinal: 3,
          archetype: 'DIVERGENCE',
          text: `Make a radical sacrifice and pivot to an unforeseen escape route.`,
          narrativeIntent: 'Subvert expectations with an emotional or tactical turnaround.',
        },
      ],
    };
  }
}

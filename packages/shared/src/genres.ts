export const GENRE_IDS = [
  'love',
  'detective',
  'horror',
  'scifi',
  'fantasy',
  'adventure',
  'comedy',
  'historical',
  'drama',
  'thriller',
] as const;

export type GenreId = (typeof GENRE_IDS)[number];

export interface GenreColorTokens {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  accent: string;
  accentContrast: string;
  glow: string;
  text: string;
  muted: string;
}

export interface GenreConfig {
  id: GenreId;
  displayName: string;
  description: string;
  icon: string;
  fontFamily: string;
  tokens: GenreColorTokens;
  aiGuidance: string;
}

export const GENRE_REGISTRY: Record<GenreId, GenreConfig> = {
  detective: {
    id: 'detective',
    displayName: 'Detective / Mystery',
    description: 'Noir alleys, shadowy secrets, and keen deductive reasoning.',
    icon: '🔍',
    fontFamily: "'Playfair Display', Georgia, serif",
    tokens: {
      background: '#0c0d10',
      surface: '#14161c',
      surfaceElevated: '#1e212b',
      border: '#2c2f3d',
      accent: '#f59e0b',
      accentContrast: '#000000',
      glow: 'rgba(245, 158, 11, 0.2)',
      text: '#f1f5f9',
      muted: '#94a3b8',
    },
    aiGuidance:
      'Atmospheric noir realism, sensory observations, forensic clues, moral ambiguity, sharp dialogue, tension between truth and danger.',
  },
  scifi: {
    id: 'scifi',
    displayName: 'Science Fiction',
    description: 'Cybernetic futures, deep space anomalies, and rogue synthetics.',
    icon: '🚀',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    tokens: {
      background: '#07090e',
      surface: '#0e131f',
      surfaceElevated: '#161e31',
      border: '#1f2c47',
      accent: '#00e5ff',
      accentContrast: '#000000',
      glow: 'rgba(0, 229, 255, 0.25)',
      text: '#e2e8f0',
      muted: '#64748b',
    },
    aiGuidance:
      'Speculative technology, vast scale, existential stakes, cybernetic detail, cold logic vs human vulnerability.',
  },
  fantasy: {
    id: 'fantasy',
    displayName: 'High Fantasy',
    description: 'Ancient runes, mythical beasts, and perilous arcane quests.',
    icon: '⚔️',
    fontFamily: "'Cinzel', Georgia, serif",
    tokens: {
      background: '#080e0c',
      surface: '#101c18',
      surfaceElevated: '#172923',
      border: '#233d34',
      accent: '#eab308',
      accentContrast: '#000000',
      glow: 'rgba(234, 179, 8, 0.2)',
      text: '#f0fdf4',
      muted: '#86efac',
    },
    aiGuidance:
      'Mythic lore, tangible magic systems, archaic grandeur, environmental wonders, heroic stakes, dangerous enchanted relics.',
  },
  horror: {
    id: 'horror',
    displayName: 'Cosmic Horror',
    description: 'Eerie shadows, psychological dread, and uncanny revelations.',
    icon: '👁️',
    fontFamily: "'Creepster', 'Times New Roman', serif",
    tokens: {
      background: '#090708',
      surface: '#150f12',
      surfaceElevated: '#20161a',
      border: '#332027',
      accent: '#ef4444',
      accentContrast: '#ffffff',
      glow: 'rgba(239, 68, 68, 0.25)',
      text: '#fecaca',
      muted: '#a1a1aa',
    },
    aiGuidance:
      'Psychological dread, creeping uncanny tension, visceral atmospheric metaphors, sensory disorientation, mounting paranoia.',
  },
  love: {
    id: 'love',
    displayName: 'Romance / Drama',
    description: 'Unspoken yearning, emotional friction, and intimate reckonings.',
    icon: '🌹',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    tokens: {
      background: '#0f080b',
      surface: '#1a0d13',
      surfaceElevated: '#28131e',
      border: '#3c1b2d',
      accent: '#f43f5e',
      accentContrast: '#ffffff',
      glow: 'rgba(244, 63, 94, 0.25)',
      text: '#ffe4e6',
      muted: '#fda4af',
    },
    aiGuidance:
      'Emotional subtext, sensory intimacy, unspoken yearning, vulnerable character dialogue, high personal stakes.',
  },
  adventure: {
    id: 'adventure',
    displayName: 'Action Adventure',
    description: 'Treacherous expeditions, uncharted ruins, and daring escapes.',
    icon: '🧭',
    fontFamily: "'Outfit', system-ui, sans-serif",
    tokens: {
      background: '#0d0b08',
      surface: '#18140e',
      surfaceElevated: '#261f16',
      border: '#3b3021',
      accent: '#f97316',
      accentContrast: '#000000',
      glow: 'rgba(249, 115, 22, 0.25)',
      text: '#ffedd5',
      muted: '#fed7aa',
    },
    aiGuidance:
      'Kinetic pacing, hazardous environments, resourceful improvisation, bold physical gambles, discoveries on the brink of collapse.',
  },
  comedy: {
    id: 'comedy',
    displayName: 'Satire / Comedy',
    description: 'Sharp wit, ironic twists, and delightfully absurd dilemmas.',
    icon: '🎭',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    tokens: {
      background: '#090d10',
      surface: '#101820',
      surfaceElevated: '#17232e',
      border: '#223544',
      accent: '#06b6d4',
      accentContrast: '#000000',
      glow: 'rgba(6, 182, 212, 0.25)',
      text: '#ecfeff',
      muted: '#a5f3fc',
    },
    aiGuidance:
      'Witty dialogue, situational irony, subverted expectations, deadpan delivery, eccentric character choices, comedic timing.',
  },
  historical: {
    id: 'historical',
    displayName: 'Historical Fiction',
    description: 'Echoes of the past, ancient courts, and historical milestones.',
    icon: '📜',
    fontFamily: "'Baskerville', 'Times New Roman', serif",
    tokens: {
      background: '#0e0c0a',
      surface: '#191512',
      surfaceElevated: '#25201b',
      border: '#393129',
      accent: '#d97706',
      accentContrast: '#000000',
      glow: 'rgba(217, 119, 6, 0.2)',
      text: '#fef3c7',
      muted: '#d4d4d8',
    },
    aiGuidance:
      'Period-authentic detail, cultural mores, unhurried prose cadence, tactile sensory historical descriptions, grounded conflicts.',
  },
  drama: {
    id: 'drama',
    displayName: 'Literary Drama',
    description: 'Human complexity, quiet dilemmas, and philosophical resonance.',
    icon: '🖋️',
    fontFamily: "'Lora', Georgia, serif",
    tokens: {
      background: '#090b10',
      surface: '#111520',
      surfaceElevated: '#1a2030',
      border: '#273147',
      accent: '#38bdf8',
      accentContrast: '#000000',
      glow: 'rgba(56, 189, 248, 0.2)',
      text: '#f8fafc',
      muted: '#94a3b8',
    },
    aiGuidance:
      'Deep character interiority, nuanced psychological conflict, unsaid subtext, poignant emotional realism.',
  },
  thriller: {
    id: 'thriller',
    displayName: 'Modern Thriller',
    description: 'Ticking clocks, high-stakes paranoia, and relentless momentum.',
    icon: '⚡',
    fontFamily: "'Inter', system-ui, sans-serif",
    tokens: {
      background: '#0a0a0a',
      surface: '#141414',
      surfaceElevated: '#202020',
      border: '#333333',
      accent: '#eab308',
      accentContrast: '#000000',
      glow: 'rgba(234, 179, 8, 0.25)',
      text: '#fafafa',
      muted: '#a3a3a3',
    },
    aiGuidance:
      'Ticking-clock urgency, sharp staccato pacing, surveillance paranoia, sudden reversals, high physical and strategic stakes.',
  },
};

import { GenreId } from '@plotweaver/shared';

export interface GenreAtmosphere {
  genreId: GenreId;
  title: string;
  tagline: string;
  videoUrl: string;
  fallbackGradient: string;
  soundscape: {
    type: 'rain' | 'drone' | 'eerie' | 'ethereal' | 'wind' | 'pulse';
    baseFrequency: number;
    description: string;
  };
}

export const GENRE_ATMOSPHERES: Record<GenreId, GenreAtmosphere> = {
  detective: {
    genreId: 'detective',
    title: 'Shadows of the Neon Rain',
    tagline: 'Wet asphalt, venetian blinds, and cigarette smoke.',
    // Royalty-free night city rain loop
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-seen-up-18312-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15) 0%, rgba(12, 13, 16, 0.95) 75%)',
    soundscape: {
      type: 'rain',
      baseFrequency: 320,
      description: 'Gentle midnight rain on pavement & distant siren',
    },
  },
  scifi: {
    genreId: 'scifi',
    title: 'Sub-Orbital Accretion',
    tagline: 'Quantum processors, ion trails, and deep vacuum.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-41400-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 60% 40%, rgba(6, 182, 212, 0.18) 0%, rgba(5, 11, 20, 0.95) 75%)',
    soundscape: {
      type: 'drone',
      baseFrequency: 110,
      description: 'Resonant fusion core hum & ion drive flutter',
    },
  },
  horror: {
    genreId: 'horror',
    title: 'The Catacomb Threshold',
    tagline: 'Flickering tallow candles, decaying drywall, and cold breathing.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smoke-filling-a-dark-room-41584-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 50%, rgba(225, 29, 72, 0.15) 0%, rgba(10, 5, 8, 0.95) 80%)',
    soundscape: {
      type: 'eerie',
      baseFrequency: 65,
      description: 'Sub-bass infrasound & cold subterranean draft',
    },
  },
  fantasy: {
    genreId: 'fantasy',
    title: 'Runes of the Elder Grove',
    tagline: 'Floating stardust, glowing monoliths, and ancient oaths.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-9640-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.18) 0%, rgba(15, 7, 24, 0.95) 75%)',
    soundscape: {
      type: 'ethereal',
      baseFrequency: 220,
      description: 'Mystic crystalline shimmer & forest canopy wind',
    },
  },
  adventure: {
    genreId: 'adventure',
    title: 'The Uncharted Frontier',
    tagline: 'Gusting mountain squalls, breaking surf, and horizon compass.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 15, 12, 0.95) 80%)',
    soundscape: {
      type: 'wind',
      baseFrequency: 180,
      description: 'Mountain breeze & distant roaring cascade',
    },
  },
  thriller: {
    genreId: 'thriller',
    title: 'Operation Redline',
    tagline: 'Wiretap static, synchronized chronometers, and zero margin.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-security-cameras-in-a-building-41865-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.15) 0%, rgba(15, 5, 5, 0.95) 80%)',
    soundscape: {
      type: 'pulse',
      baseFrequency: 85,
      description: 'Stealth heartbeat tension & high-pass frequency hum',
    },
  },
  love: {
    genreId: 'love',
    title: 'Emberlight Nocturne',
    tagline: 'Warm golden shadows, quiet confessions, and fleeting touches.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bokeh-lights-of-the-city-at-night-4241-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 40%, rgba(244, 63, 94, 0.15) 0%, rgba(18, 8, 12, 0.95) 80%)',
    soundscape: {
      type: 'ethereal',
      baseFrequency: 260,
      description: 'Warm velvet harmonic resonance & fireplace crackle',
    },
  },
  comedy: {
    genreId: 'comedy',
    title: 'The Absurd Carousel',
    tagline: 'Fast-paced banter, escalating chaos, and theatrical flair.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-animation-of-colorful-light-trails-41407-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.18) 0%, rgba(18, 14, 4, 0.95) 80%)',
    soundscape: {
      type: 'pulse',
      baseFrequency: 175,
      description: 'Playful rhythmic syncopation & muted marimba pulses',
    },
  },
  historical: {
    genreId: 'historical',
    title: 'Chronicles of the Grand Dynasty',
    tagline: 'Parchment maps, candlelit council chambers, and iron seals.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.15) 0%, rgba(17, 12, 7, 0.95) 80%)',
    soundscape: {
      type: 'wind',
      baseFrequency: 140,
      description: 'Cathedral reverberation & distant muffled bells',
    },
  },
  drama: {
    genreId: 'drama',
    title: 'The Solitary Chamber',
    tagline: 'Unspoken estrangements, ticking mantel clock, and moral reckoning.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-raindrops-falling-on-a-window-pane-18306-large.mp4',
    fallbackGradient: 'radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 10, 18, 0.95) 80%)',
    soundscape: {
      type: 'drone',
      baseFrequency: 130,
      description: 'Melancholic low cello resonance & rain on glass',
    },
  },
};

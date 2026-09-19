export const TONES = [
  'Suspenseful',
  'Dark',
  'Noir',
  'Mysterious',
  'Emotional',
  'Humorous',
  'Serious',
  'Epic',
  'Lighthearted',
  'Romantic',
  'Poignant',
] as const;

export type Tone = (typeof TONES)[number];

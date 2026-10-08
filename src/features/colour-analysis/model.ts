import { getPalettes } from '@/lib/content';

export type Answers = Record<string, string>;
export type Question = {
  id: string;
  title: string;
  description: string;
  options: { value: string; label: string; description: string }[];
};
export type Assessment = {
  status: 'suggestions' | 'uncertain';
  title: string;
  description: string;
  paletteSlugs: string[];
  observations: string[];
};

export const questions: Question[] = [
  {
    id: 'temperature',
    title: 'Which colour temperature feels more harmonious?',
    description:
      'Compare warm and cool colours using the optional digital drapes or real fabrics near your face in indirect daylight. Keep the same photo across digital comparisons. Screen settings, camera processing and photo lighting can change the effect; choose the combination you prefer, or unsure. This is your observation, not automatic face analysis.',
    options: [
      {
        value: 'Warm',
        label: 'Warm colours',
        description: 'Peach, coral or warm greens feel more at ease.',
      },
      {
        value: 'Cool',
        label: 'Cool colours',
        description: 'Rose, blue or cool greens feel more at ease.',
      },
      {
        value: 'unsure',
        label: 'Unsure or both',
        description: 'The difference is unclear, or both are enjoyable.',
      },
    ],
  },
  {
    id: 'depth',
    title: 'Which depth of colour feels most comfortable?',
    description:
      'Compare light, medium and deep versions of a similar colour with optional digital drapes or real fabrics. Use the same photo for each digital sample and consistent daylight for fabrics. Screens and photo lighting limit the comparison. Choose the colour depth you enjoy near your face; this does not ask whether your skin is light or dark.',
    options: [
      {
        value: 'Light',
        label: 'Light colours',
        description: 'Lighter, airy fabrics feel most harmonious.',
      },
      {
        value: 'Medium',
        label: 'Medium colours',
        description:
          'Mid-depth colours feel easier than very light or very deep shades.',
      },
      {
        value: 'Deep',
        label: 'Deep colours',
        description: 'Richer, deeper fabrics feel most harmonious.',
      },
      {
        value: 'unsure',
        label: 'Unsure or several',
        description:
          'Lighting, fabric or preference makes it difficult to choose.',
      },
    ],
  },
  {
    id: 'chroma',
    title: 'Do softer or clearer colours feel more harmonious?',
    description:
      'Compare softer, moderately clear and brighter versions of a similar colour using optional digital drapes or real fabrics. Keep the same photo across digital samples. Screen settings, camera processing and lighting can affect apparent clarity; this is a preference comparison, not an image assessment. Real fabrics in consistent daylight can help, and unsure is always welcome.',
    options: [
      {
        value: 'Soft',
        label: 'Soft and muted',
        description: 'Dusty or gently greyed colours feel more at ease.',
      },
      {
        value: 'Balanced',
        label: 'Somewhere between',
        description:
          'Moderate colour feels easier than very muted or vivid options.',
      },
      {
        value: 'Bright',
        label: 'Clear and bright',
        description: 'Clearer, vivid colours feel more at ease.',
      },
      {
        value: 'unsure',
        label: 'Unsure or both',
        description: 'There is no clear difference, or both appeal.',
      },
    ],
  },
];

/** Equal-weight exact matches across fabric temperature, depth and chroma.
 * Unknown or invalid answers supply no evidence. Ties remain alternatives.
 * This editorial heuristic is not a diagnosis, confidence percentage or professional draping.
 */
export function assessAnswers(answers: Answers): Assessment {
  const known = questions.filter((question) =>
    question.options.some(
      (option) =>
        option.value !== 'unsure' && option.value === answers[question.id],
    ),
  );
  const observations = known.map(
    (question) =>
      `${question.id === 'chroma' ? 'Colour clarity' : question.id === 'depth' ? 'Colour depth' : 'Colour temperature'}: ${answers[question.id].toLowerCase()}.`,
  );
  const uncertain: Assessment = {
    status: 'uncertain',
    title: 'Keep exploring: there is no clear starting palette yet',
    description:
      'Try a few fabric comparisons in consistent daylight, or browse any palette that interests you. It is fine to enjoy several colour families. These three observations cannot establish a personal season.',
    paletteSlugs: [],
    observations,
  };
  if (known.length < 2) return uncertain;
  const ranked = getPalettes().map((palette) => ({
    palette,
    score: known.reduce(
      (score, question) =>
        score +
        (palette[question.id as 'temperature' | 'depth' | 'chroma'] ===
        answers[question.id]
          ? 1
          : 0),
      0,
    ),
  }));
  const bestScore = Math.max(...ranked.map((item) => item.score));
  const candidates = ranked.filter((item) => item.score === bestScore);
  if (bestScore < 2 || candidates.length > 3) return uncertain;
  return {
    status: 'suggestions',
    title:
      candidates.length === 1
        ? 'A palette to explore'
        : 'A few palettes to compare',
    description: `These ${candidates.length === 1 ? 'suggestions give' : 'alternatives give'} you a tentative starting point, using ${bestScore} matching observations out of ${known.length} answers. The guide scores temperature, depth and clarity equally; tied palettes stay together. Try real fabrics and keep the colours you enjoy. This is not a confirmed personal season.`,
    paletteSlugs: candidates.map((item) => item.palette.slug),
    observations,
  };
}

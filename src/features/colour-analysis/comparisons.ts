export type ComparisonSet = {
  id: string;
  label: string;
  samples: { value: string; label: string; hex: string }[];
};

/** Original illustrative sRGB samples, not calibrated fabric measurements.
 * Temperature pairs approximate the same OKLCH lightness/chroma with different hue.
 * Depth sets vary lightness at approximately fixed hue/chroma; clarity sets vary
 * chroma at approximately fixed hue/lightness. Display, photograph and lighting
 * differences remain significant. Keep the same photo across every sample.
 * These samples provide comparison choices, never automatic facial analysis.
 */
const sets = new Map<string, ComparisonSet[]>([
  [
    'temperature',
    [
      {
        id: 'temperature-rose-peach',
        label: 'Peach and cool rose',
        samples: [
          { value: 'Warm', label: 'Warm peach', hex: '#D9906F' },
          { value: 'Cool', label: 'Cool rose', hex: '#CF8CB8' },
        ],
      },
      {
        id: 'temperature-greens',
        label: 'Olive and blue-green',
        samples: [
          { value: 'Warm', label: 'Warm olive', hex: '#8D9654' },
          { value: 'Cool', label: 'Cool blue-green', hex: '#47A191' },
        ],
      },
    ],
  ],
  [
    'depth',
    [
      {
        id: 'depth-blue',
        label: 'Three depths of blue',
        samples: [
          { value: 'Light', label: 'Light blue', hex: '#B1D2F4' },
          { value: 'Medium', label: 'Medium blue', hex: '#7392B3' },
          { value: 'Deep', label: 'Deep blue', hex: '#2E4A67' },
        ],
      },
      {
        id: 'depth-rose',
        label: 'Three depths of rose',
        samples: [
          { value: 'Light', label: 'Light rose', hex: '#EEBCDC' },
          { value: 'Medium', label: 'Medium rose', hex: '#AD7F9D' },
          { value: 'Deep', label: 'Deep rose', hex: '#613854' },
        ],
      },
    ],
  ],
  [
    'chroma',
    [
      {
        id: 'chroma-blue',
        label: 'Three levels of blue clarity',
        samples: [
          { value: 'Soft', label: 'Dusty blue', hex: '#7F91A4' },
          { value: 'Balanced', label: 'Balanced blue', hex: '#6693C1' },
          { value: 'Bright', label: 'Clear blue', hex: '#3A93E6' },
        ],
      },
      {
        id: 'chroma-coral',
        label: 'Three levels of coral clarity',
        samples: [
          { value: 'Soft', label: 'Dusty coral', hex: '#B19895' },
          { value: 'Balanced', label: 'Balanced coral', hex: '#CC8B85' },
          { value: 'Bright', label: 'Clear coral', hex: '#E97871' },
        ],
      },
    ],
  ],
]);

export function getComparisonSets(questionId: string): ComparisonSet[] {
  return sets.get(questionId) ?? [];
}

import { describe, expect, it } from 'vitest';
import {
  assessAnswers,
  questions,
  type Answers,
} from '../../src/features/colour-analysis/model';

describe('tentative colour exploration', () => {
  it('offers an unsure answer for every question', () => {
    expect(
      questions.every((question) =>
        question.options.some((option) => option.value === 'unsure'),
      ),
    ).toBe(true);
  });
  it('does not force a palette from no evidence or a single known answer', () => {
    const cases: Answers[] = [
      {},
      { temperature: 'unsure', depth: 'unsure', chroma: 'unsure' },
      { temperature: 'Warm' },
    ];
    for (const answers of cases) {
      expect(assessAnswers(answers).status).toBe('uncertain');
      expect(assessAnswers(answers).paletteSlugs).toEqual([]);
    }
  });
  it('keeps exact tied palettes as alternatives', () => {
    const result = assessAnswers({
      temperature: 'Cool',
      depth: 'Medium',
      chroma: 'Bright',
    });
    expect(result.paletteSlugs).toEqual(['true-winter', 'bright-winter']);
    expect(result.status).toBe('suggestions');
    expect(result.description).toContain('not a confirmed personal season');
  });
  it('finds a starting point when all three dimensions match one profile', () => {
    expect(
      assessAnswers({ temperature: 'Warm', depth: 'Light', chroma: 'Balanced' })
        .paletteSlugs,
    ).toEqual(['light-spring']);
    expect(
      assessAnswers({ temperature: 'Cool', depth: 'Deep', chroma: 'Bright' })
        .paletteSlugs,
    ).toEqual(['deep-winter']);
  });
  it('ignores invalid values and never uses unrelated demographic keys', () => {
    expect(
      assessAnswers({
        temperature: 'invalid',
        depth: 'Light',
        chroma: 'unsure',
      }).status,
    ).toBe('uncertain');
    const answers = { temperature: 'Warm', depth: 'Deep', chroma: 'Balanced' };
    expect(
      assessAnswers({ ...answers, gender: 'female', ethnicity: 'anything' }),
    ).toEqual(assessAnswers(answers));
  });
  it('does not arbitrarily truncate a broad tie', () => {
    expect(
      assessAnswers({ temperature: 'Warm', depth: 'Medium', chroma: 'unsure' })
        .status,
    ).toBe('uncertain');
  });
});

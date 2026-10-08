import { describe, expect, it } from 'vitest';
import { getComparisonSets } from '../../src/features/colour-analysis/comparisons';
import { questions } from '../../src/features/colour-analysis/model';

// Evaluate the emitted sRGB samples in OKLab, independently of how they were
// selected. This checks the intended dimension separation after hex rounding;
// it cannot establish how a user's display or photograph will reproduce them.
function oklab(hex: string) {
  const [r, g, b] = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const blue = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { lightness, chroma: Math.hypot(a, blue), hue: Math.atan2(blue, a) };
}

describe('optional digital comparison samples', () => {
  it('has two uniquely identified sets per question with valid labelled colours', () => {
    const ids: string[] = [];
    for (const question of questions) {
      const sets = getComparisonSets(question.id);
      expect(sets).toHaveLength(2);
      const expectedValues = question.options
        .filter((option) => option.value !== 'unsure')
        .map((option) => option.value);
      for (const set of sets) {
        ids.push(set.id);
        expect(set.label.length).toBeGreaterThan(3);
        expect(set.samples.map((sample) => sample.value)).toEqual(
          expectedValues,
        );
        expect(new Set(set.samples.map((sample) => sample.hex)).size).toBe(
          set.samples.length,
        );
        for (const sample of set.samples) {
          expect(sample.hex).toMatch(/^#[0-9A-F]{6}$/);
          expect(sample.label.length).toBeGreaterThan(3);
        }
      }
    }
    expect(new Set(ids).size).toBe(6);
  });

  it('returns no samples for unsupported identifiers, including object property names', () => {
    for (const id of [
      '',
      'unknown',
      'gender',
      'ethnicity',
      '__proto__',
      'toString',
    ]) {
      expect(getComparisonSets(id)).toEqual([]);
    }
  });

  it('keeps temperature pairs broadly similar in lightness and chroma', () => {
    for (const set of getComparisonSets('temperature')) {
      const [warm, cool] = set.samples.map((sample) => oklab(sample.hex));
      expect(Math.abs(warm.lightness - cool.lightness)).toBeLessThan(0.01);
      expect(Math.abs(warm.chroma - cool.chroma)).toBeLessThan(0.01);
      expect(Math.abs(warm.hue - cool.hue)).toBeGreaterThan(0.5);
    }
  });

  it('orders depth by perceptual lightness without substantially changing hue or chroma', () => {
    for (const set of getComparisonSets('depth')) {
      const [light, medium, deep] = set.samples.map((sample) =>
        oklab(sample.hex),
      );
      expect(light.lightness - medium.lightness).toBeGreaterThan(0.15);
      expect(medium.lightness - deep.lightness).toBeGreaterThan(0.2);
      expect(Math.abs(light.chroma - deep.chroma)).toBeLessThan(0.01);
      expect(Math.abs(light.hue - deep.hue)).toBeLessThan(0.1);
    }
  });

  it('orders clarity by chroma while keeping lightness and hue broadly steady', () => {
    for (const set of getComparisonSets('chroma')) {
      const [soft, balanced, bright] = set.samples.map((sample) =>
        oklab(sample.hex),
      );
      expect(balanced.chroma - soft.chroma).toBeGreaterThan(0.04);
      expect(bright.chroma - balanced.chroma).toBeGreaterThan(0.04);
      expect(Math.abs(soft.lightness - bright.lightness)).toBeLessThan(0.01);
      expect(Math.abs(soft.hue - bright.hue)).toBeLessThan(0.1);
    }
  });
});

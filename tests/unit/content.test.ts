import { describe, expect, it } from 'vitest';
import {
  getHairstyles,
  getHairstyle,
  getPalettes,
  getPalette,
  validateContent,
} from '../../src/lib/content';

describe('validated catalogue', () => {
  it('covers 30 unique guides with two views and every texture and length', () => {
    const hair = getHairstyles();
    expect(hair).toHaveLength(30);
    expect(new Set(hair.map((item) => item.slug)).size).toBe(30);
    expect(new Set(hair.map((item) => item.texture)).size).toBe(4);
    expect(new Set(hair.map((item) => item.length)).size).toBe(3);
    expect(hair.every((item) => item.images.length === 2)).toBe(true);
  });
  it('resolves a known item and returns undefined for missing content', () => {
    expect(getHairstyle('blunt-bob')?.name).toBe('Blunt chin-length bob');
    expect(getHairstyle('../unknown')).toBeUndefined();
    expect(getPalette('light-spring')?.temperature).toBe('Warm');
    expect(getPalette('unknown')).toBeUndefined();
  });
  it('rejects broken slugs, duplicate content, colours and cross-references', () => {
    const hair = structuredClone(getHairstyles());
    const palettes = structuredClone(getPalettes());
    hair[0].slug = hair[1].slug;
    expect(() => validateContent(hair, palettes)).toThrow('Duplicate');
    palettes[0].colours[0].hex = 'green';
    expect(() => validateContent(getHairstyles(), palettes)).toThrow();
    const broken = structuredClone(getPalettes());
    broken[0].explore[0] = 'missing-palette';
    expect(() => validateContent(getHairstyles(), broken)).toThrow(
      'Invalid related palette',
    );
  });
  it('rejects a wrong front/side asset mapping', () => {
    const hair = structuredClone(getHairstyles());
    hair[0].images[0].src = '/images/hairstyles/other-front.webp';
    expect(() => validateContent(hair, getPalettes())).toThrow(
      'Unexpected image paths',
    );
  });
});

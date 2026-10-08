import { z } from 'zod';
import hairstyleData from '@/content/hairstyles.json';
import paletteData from '@/content/palettes.json';
import comparisonData from '@/content/comparisons.json';

const imageSchema = z
  .object({ src: z.string().startsWith('/images/'), alt: z.string().min(15) })
  .strict();
const hairstyleSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(3),
    length: z.enum(['Short', 'Medium', 'Long']),
    texture: z.enum(['Straight', 'Wavy', 'Curly', 'Coily']),
    style: z.string().min(3),
    maintenance: z.enum(['Low', 'Medium', 'High']),
    summary: z.string().min(20),
    description: z.string().min(40),
    styling: z.array(z.string().min(10)).min(3),
    upkeep: z.array(z.string().min(10)).min(2),
    salonRequest: z.string().min(20),
    images: z.array(imageSchema).length(2),
  })
  .strict();
const paletteSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(3),
    family: z.enum(['Spring', 'Summer', 'Autumn', 'Winter']),
    temperature: z.enum(['Warm', 'Cool']),
    depth: z.enum(['Light', 'Medium', 'Deep']),
    chroma: z.enum(['Soft', 'Balanced', 'Bright']),
    summary: z.string().min(20),
    description: z.string().min(40),
    colours: z
      .array(
        z
          .object({
            name: z.string().min(2),
            hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
          })
          .strict(),
      )
      .min(6),
    outfits: z.array(z.string().min(10)).min(3),
    explore: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(2),
  })
  .strict();

export type Hairstyle = z.infer<typeof hairstyleSchema>;
export type Palette = z.infer<typeof paletteSchema>;

export function validateContent(hair: unknown, palettes: unknown) {
  const hairstyles = z.array(hairstyleSchema).length(30).parse(hair);
  const seasons = z.array(paletteSchema).length(12).parse(palettes);
  for (const [kind, items] of [
    ['hairstyles', hairstyles],
    ['palettes', seasons],
  ] as const) {
    if (new Set(items.map((item) => item.slug)).size !== items.length)
      throw new Error(`Duplicate ${kind} slug`);
  }
  const slugs = new Set(seasons.map((palette) => palette.slug));
  for (const palette of seasons) {
    if (
      palette.explore.some((slug) => !slugs.has(slug) || slug === palette.slug)
    )
      throw new Error(`Invalid related palette: ${palette.slug}`);
  }
  for (const hairstyle of hairstyles) {
    if (
      hairstyle.images[0].src !==
        `/images/hairstyles/${hairstyle.slug}-front.webp` ||
      hairstyle.images[1].src !==
        `/images/hairstyles/${hairstyle.slug}-side.webp`
    )
      throw new Error(`Unexpected image paths: ${hairstyle.slug}`);
  }
  return { hairstyles, palettes: seasons };
}

const content = validateContent(hairstyleData, paletteData);
export const getHairstyles = (): Hairstyle[] => content.hairstyles;
export const getHairstyle = (slug: string): Hairstyle | undefined =>
  content.hairstyles.find((item) => item.slug === slug);
export const getPalettes = (): Palette[] => content.palettes;
export const getPalette = (slug: string): Palette | undefined =>
  content.palettes.find((item) => item.slug === slug);
const comparisons = z
  .array(
    z
      .object({
        id: z.string(),
        src: z.string().startsWith('/images/'),
        title: z.string(),
        alt: z.string().min(15),
        caption: z.string(),
      })
      .strict(),
  )
  .length(8)
  .parse(comparisonData);
export const getComparisons = () => comparisons;

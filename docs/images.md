# Images and editorial sources

## Asset allocation

| Category                        | Target | Published path                                                                      |
| ------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| Hairstyle front and side views  | 60     | `public/images/hairstyles/{slug}-{front,side}.webp`                                 |
| Colour comparison illustrations | 8      | `public/images/colour/comparison-01.webp` through `comparison-08.webp`              |
| Editorial imagery               | 4      | `public/images/editorial/hero.webp`, `hairstyles.webp`, `colour.webp`, `about.webp` |
| Total                           | 72     | Count and review actual files before release                                        |

Generated PNG originals are retained under `assets/originals/` in the same categories. Use the built-in image-generation tool, rather than downloading unrelated images or labelling stock imagery as generated. Preserve the original files; published WebP copies are derivatives.

## Generation and review

`src/content/image-prompts.json` records 30 hairstyle concepts and diverse adult model descriptions. Its paired-view composition describes the intended matching result. The implemented generation workflow makes an individual front asset, then edits that reference for the side asset so the person, hair colour and cut remain consistent. Generate editorial and comparison assets individually as well.

Begin with a small sample to establish lighting and visual tone. Review each new result for realistic hair strands, matching identity, haircut length and texture, believable ears and facial features, clean background, and visible hair ends. Compare front and side views together. Regenerate or edit obvious artefacts before optimising; successful generation alone is not visual approval.

Use varied adult ages, hair textures and skin tones without associating a season with a demographic characteristic. Colour comparison images illustrate fabric effects and should keep the same subject and lighting across the comparison. They cannot prove a person's season. Generated portraits are not testimonials or real client examples.

Run `npm run images:optimise` after placing originals. The script rotates using image metadata, resizes without enlargement to at most 1600 pixels wide for editorial images or 1024 pixels for other categories, then writes quality-82 WebP files. It does not delete originals. Check dimensions, visible cropping, file sizes and all expected filenames after conversion.

The `Media` component labels generated images. Write alt text from the finished view and make decorative imagery ignorable where appropriate. CSS crops may remove visible ends, so inspect gallery thumbnails as well as detail views. The static export serves pre-generated WebP directly; it does not run an image optimisation server.

## Source-aware copy

Original copy and detailed source notes are in `src/content/source-notes.json`, reviewed on 8 October 2026. Primary references:

- [American Academy of Dermatology: styling without damage](https://www.aad.org/public/diseases/hair-loss/hair-care/styling/) informs general low-tension and heat-care cautions.
- [American Academy of Dermatology: curly hair care](https://www.aad.org/public/everyday-care/hair-scalp-care/hair/curly-hair-care) informs gentle conditioning and detangling principles.
- [Kettlewell: colour analysis](https://kettlewellcolours.com/pages/colour-analysis) supplies professional styling vocabulary for hue, value and chroma.
- [Kettlewell: colour masterclass](https://kettlewellcolours.com/blogs/the-colour-blog/your-colour-masterclass) provides context for variation within colour families.

The guides do not reproduce a commercial palette or claim scientific validation. Exact swatches, outfit combinations, haircut descriptions and scoring are original editorial choices. Keep the distinction between expert guidance, stylistic preference and evidence explicit when updating content.

# Architecture and design

## Request and content flow

Next.js App Router builds each route into static HTML. `generateStaticParams` enumerates the hairstyle and palette slugs; unknown content reaches the 404 route. Next.js has `output: 'export'`, trailing-slash routes and unoptimised runtime image handling. Cloudflare serves the `out/` directory; there is no Next.js server, API route or database in production.

Local JSON in `src/content/` is parsed by Zod in `src/lib/content.ts`. Validation checks required copy, category values, counts, duplicate slugs, image paths, hex codes and related-palette references. Typed getters serve routes and interactive controls. Domain scoring lives in `src/features/colour-analysis/model.ts`; React controls do not decide seasons themselves.

The public domain contracts are:

```ts
getHairstyles(): Hairstyle[]
getHairstyle(slug: string): Hairstyle | undefined
getPalettes(): Palette[]
getPalette(slug: string): Palette | undefined
assessAnswers(answers: Record<string, string>): Assessment
```

`Assessment` contains `status`, `title`, `description`, `paletteSlugs` and `observations`. Palette scoring gives one point per exact temperature, depth or chroma match. Unknown answers contribute nothing. Fewer than two known answers, fewer than two matching dimensions, or more than three tied leaders return open guidance. Ties of up to three remain alternatives. The model does not accept demographic characteristics as evidence.

## Interaction boundaries

Server-rendered routes supply ordinary guide content. Client components cover the gallery, assessment and mobile navigation. State remains local; there is no Redux dependency because shared mutable application state is unnecessary. Filters use query parameters and replace the current URL without scrolling. Assessment answers use React state and are not persisted or transmitted.

The mobile navigation uses the browser's native modal `dialog`, a close button and normal links. Keyboard containment, Escape handling and focus restoration need browser verification, including assistive technology. Script failure exposes alternate navigation. Assessment has a no-script link to all palettes, and the gallery keeps its full collection available.

## Components and visual system

The `/components/` route shows reusable design elements. `SiteHeader` supplies shared navigation; `Media` renders responsive imagery and the generated-image caption; `HairstyleCard` and `PaletteCard` keep gallery/detail links consistent. `Gallery` and `Assessment` contain their respective interactions. Shared layout provides the skip link, main landmark and footer.

CSS tokens define cream `#FAF7F1`, paper `#F0E9DF`, plum `#4D2B3D`, ink `#30252B` and muted text `#57464F`. Georgia is used for editorial headings and Arial for body copy, avoiding an external font request. Responsive grids collapse at defined widths; reduced-motion preferences disable smooth scrolling and transitions. Contrast, focus outlines, text spacing and target sizes must be assessed in their actual rendered states, not inferred from token names.

Palette swatches have text names and hex values. Never communicate an answer, selected filter or meaning through colour alone. Keep image captions, meaningful alt text and honest uncertainty in future designs.

## Changing the platform

The static export supports content updates through rebuilds. A future CMS can supply validated content at build time while preserving the getter contract; see [content editing](content-editing.md). Authenticated content, live uploads, server actions and request-time API logic would require a deliberate hosting and privacy redesign. Do not add those capabilities to a static route without reviewing the architecture.

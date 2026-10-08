# Content editing and backend handover

## Edit a guide

Edit the relevant entry in `src/content/hairstyles.json`. Its slug is the public URL identifier: changing it breaks existing links unless a redirect is added. Each entry supplies name, length, texture, style, maintenance, summary, description, three or more styling steps, at least two upkeep notes, salon wording and exactly two image records.

Allowed lengths are `Short`, `Medium`, `Long`; textures are `Straight`, `Wavy`, `Curly`, `Coily`; maintenance is `Low`, `Medium`, `High`. Style is an editorial label and feeds the gallery options automatically. Use British English, explain unfamiliar terms and make recommendations conditional on individual hair needs. The trim timings are flexible examples.

Each image must use `/images/hairstyles/{slug}-front.webp` or `/images/hairstyles/{slug}-side.webp` in that order. Check the actual photograph before editing its alt text. A side image must genuinely show a side view of the same model and hairstyle. Do not describe an imagined result that has not been generated.

## Edit a palette

Edit `src/content/palettes.json`. Each guide includes its family, temperature, depth, chroma, original copy, six or more named hex colours, three or more outfit combinations and related palette slugs. Temperature is `Warm` or `Cool`; depth is `Light`, `Medium` or `Deep`; chroma is `Soft`, `Balanced` or `Bright`.

Swatch values must be six-digit hex codes. Related slugs must exist and cannot reference the same palette. Outfit ideas should be accessible across gender expression and should not presume skin colour, ethnicity or body shape. Palettes are illustrative editorial colour combinations, not a supplier's proprietary palette or a diagnostic test.

The validator currently expects 30 hairstyles and 12 palettes. Expanding the catalogue requires intentionally changing those count guards, adding assets and tests, and rebuilding static routes. Do not remove validation simply to make an incomplete edit build.

## Edit questions or scoring

Questions and options live in `src/features/colour-analysis/model.ts`. Keep a genuine unsure option and descriptive instructions. Use stable question IDs and option values, because scoring refers to them. Update the visible methodology and unit tests if scoring changes. Do not add appearance, gender, race or ethnicity rules, confidence percentages or promises of a confirmed season.

The current heuristic is deliberately transparent: exact matches on three fabric dimensions with equal weight. It is original editorial logic rather than a validated instrument. Preserve uncertain outcomes and tied alternatives.

## Verify an edit

Run `npm run typecheck`, `npm test`, `npm run lint` and `npm run build`. Preview affected pages with `npm run preview`, inspect the real images, and check links, filter combinations, mobile wrapping and keyboard operation. Run relevant browser journeys when interactions or routes change. Record what was checked in the pull request and `PROGRESS.md`.

## Replace JSON with a backend

Keep storage adaptation behind the content-access layer. A safe first step is a build-time CMS export that produces the same JSON shapes and passes the existing Zod parser before Next.js builds routes. This retains static hosting and avoids sending CMS credentials to the browser.

If direct asynchronous build-time fetching is needed, introduce a server-only adapter, make route data access asynchronous, and provide the interactive gallery with validated public data as props. Update static-parameter generation and build tests together. Do not import credential-bearing adapters into client components.

Preserve stable slugs, public image paths, cross-reference checks and missing-content behaviour. Define publishing ownership, cache invalidation and build failure handling with the backend team. Rebuild after publishing content; an existing static export cannot discover a new CMS entry until a new build completes.

## Editing digital drapes

The six illustrative comparison sets are in `src/features/colour-analysis/comparisons.ts`; the existing answer/scoring rules remain in `model.ts`. Keep comparison sample values aligned with question options. Each question has two labelled sets. Temperature pairs approximately match lightness/chroma, depth sets vary lightness, and clarity sets vary chroma. Do not describe these original sRGB samples as calibrated fabric measurements. The comparison tests check identifiers, formats and approximate separation. Changing a sample does not change an answer or result automatically.

Photo preparation and validation live in `photo.ts`, and the browser-only controls in `photo-comparison.tsx`. Do not add photo network requests, persistence, facial inference or automatic answer selection. Keep the same transformed image across each sample and retain a complete photo-free journey.

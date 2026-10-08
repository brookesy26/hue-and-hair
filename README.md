# Hue & Hair

A warm editorial website for exploring 30 women's hairstyles and 12 personal colour palettes for everyone. Colour analysis is styling guidance; the self-assessment offers tentative starting points and never classifies people by gender or ethnicity.

- Website: [Hue & Hair](https://hue-and-hair-c4w.pages.dev/)
- Repository: [brookesy26/hue-and-hair](https://github.com/brookesy26/hue-and-hair)
- Local project: `C:\Users\Brook\OneDrive\Documents\ChatGPT\Site creation\HueAndHair`

## Setup

Use Node **24.16.0** (the project accepts `>=24.15 <25`) and npm. Dependencies are installed from `package-lock.json`; do not replace the lockfile casually.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:3300`. No account, API key, database or environment secret is required to run the site. The current package uses Next.js 16.4.0, React 19.3.0, strict TypeScript, Tailwind 4.3.3 and Zod. The lockfile records the exact installed dependency tree.

## Commands

| Command                                          | Purpose                                             |
| ------------------------------------------------ | --------------------------------------------------- |
| `npm run dev`                                    | Local Next.js development server on port 3300       |
| `npm run lint`                                   | ESLint check without rewriting files                |
| `npm run typecheck`                              | Strict TypeScript check                             |
| `npm test`                                       | Vitest unit tests                                   |
| `npm test -- --maxWorkers=1`                     | Unit tests with one worker on a constrained machine |
| `npm run build`                                  | Produce the static site in `out/`                   |
| `npm run preview`                                | Serve the existing static export on port 3300       |
| `npx playwright install chromium firefox webkit` | Install browsers for local end-to-end checks        |
| `npm run test:e2e`                               | Run the configured browser journeys                 |
| `npm run images:optimise`                        | Create WebP assets from retained PNG originals      |
| `npm run format:check`                           | Check formatting                                    |
| `npm run format`                                 | Rewrite formatting; review the diff afterwards      |

Build before using `preview`, and stop any development server using the same port. CI installs browser operating-system dependencies using `npx playwright install --with-deps chromium firefox webkit`.

## Features and boundaries

The gallery stores length, texture, style and upkeep filters in its URL. Individual guides include styling, upkeep and suggested salon wording. The three-question assessment keeps answers only in page memory; refreshing clears them. Static guides and navigation have script-failure alternatives, while filtering and assessment require JavaScript.

There are no accounts, photograph uploads, tracking scripts, saved favourites or application forms. Hosting may process technical request data. All generated imagery is labelled; screen colours are illustrative and are not physical fabric measurements.

The image target is **72 separately generated assets**: 60 hairstyle views, eight colour comparisons and four editorial images. Retained originals and published assets are documented in [image workflow](docs/images.md). Consult [verification](docs/verification.md) and `PROGRESS.md` for the actual delivery state; a target count is not evidence that every asset has completed generation or review.

## Handover

- [Architecture and component guide](docs/architecture.md)
- [Editing content and replacing the local source](docs/content-editing.md)
- [Images and source references](docs/images.md)
- [Cloudflare deployment and rollback](docs/deployment.md)
- [Checks, evidence and known limitations](docs/verification.md)
- [Full WCAG 2.2 applicability register](docs/accessibility-register.md)

The register is a working evidence record, **not a WCAG AAA conformance claim**. Manual assistive-technology and visual checks must be completed and recorded before making broader accessibility claims.

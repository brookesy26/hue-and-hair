# Verification record

Record checks against an exact commit or deployment before describing the release as verified. A configured test, planned review or successful compilation is not evidence that a user journey, assistive-technology interaction or published deployment passed.

## Verified release

Production: [Hue & Hair](https://hue-and-hair-c4w.pages.dev/), source `c4c9c34`, deployment `e5481a21-0cc1-4e32-9159-b9435a2dcfeb`, 8 October 2026.

| Check                   | Recorded result                                                                     | Limits                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Unit/component tests    | 14 passed                                                                           | Validated content, missing references, scoring/uncertainty and UI behaviour       |
| Lint, TypeScript, build | Passed                                                                              | Static export; no runtime server                                                  |
| Three-engine browser CI | 24 passed in run 37839725874 on `1f1c8af`                                           | Linux Chromium, Firefox and WebKit                                                |
| Live browser journeys   | 10 passed                                                                           | Production Chromium/WebKit; local Windows Firefox cannot launch                   |
| Routes/assets/security  | 50 routes and 72 exact image hashes passed                                          | Live HTTPS, headers, SEO files and genuine 404 verified                           |
| Images and layouts      | 72 selected images and 50 desktop/mobile routes visually reviewed                   | Generated imagery is illustrative; six templates cover five representative widths |
| Accessibility           | Selected axe tags and states pass; keyboard/contrast/text spacing evidence recorded | Screen-reader, actual 400% browser zoom and full AAA review remain open           |
| Dependency audit        | 0 production; 5 development high entries                                            | Unpatched braces advisory tracked below                                           |

The detailed evidence and commands follow. A passing automated check does not establish spoken assistive-technology support or full WCAG conformance.

## Required release checks

- Lint, strict typing, unit tests and production export.
- Chromium, Firefox and WebKit journeys covering filters, empty results, URL refresh, direct detail routes, assessment selection/back/restart/unsure outcomes, mobile drawer and 404 behaviour.
- Axe checks across representative pages and states, supplemented by manual keyboard and screen-reader testing.
- Visual inspection of every route and important state, including generated image realism, matching front/side identity, visible hair and caption/alt accuracy.
- Layout checks at 320, 375, 768, 1024 and 1440 pixels, landscape orientation, 200% text zoom, 400% browser zoom, text-spacing overrides and reduced motion.
- JavaScript-disabled navigation and access to the full collection and all palette guides; document the interactive features requiring JavaScript.
- Live HTTPS, direct-route refresh, expected image and stylesheet assets, sitemap, robots, response headers and genuine missing-route 404.

## Manual accessibility protocol

Use [the applicability register](accessibility-register.md) to record each criterion's evidence, environment, observed result and remediation. Start with all shared navigation and controls, then assess the entire questionnaire process and every page template. Test keyboard-only operation and at least one supported screen-reader/browser pairing, documenting its versions. Check announcement quality and focus movement rather than merely detecting an accessible name.

Measure actual contrast in normal, hover, focus, selected and disabled states. AAA enhanced contrast, focus appearance, complete focus visibility, enhanced target size and visual presentation need their own evidence. Inspect every generated image against its alt text. No automated tool can establish the full AAA target on its own.

## Dependency and security limitation

The lead's initial npm audit reported an unpatched high-severity advisory affecting `braces <=3.0.3` through the development ESLint / fast-glob dependency chain. This is a build-tool dependency, but the advisory must remain tracked rather than dismissed. Capture the advisory identifier, dependency tree and updated audit output when assessing a fix. Avoid a blanket `npm audit fix --force`, which can introduce incompatible tooling.

Run and record both `npm audit` and `npm audit --omit=dev` after the final dependency installation. The recorded production-only result is zero advisories; the full development audit remains non-zero. Reassess the limitation when compatible upstream dependencies provide a repair.

## Final integration evidence

Release identifiers and observed results are recorded below. The manual accessibility gates remain open; the site is not described as compliant by default.

## Integrated local evidence —8October2026

14 unit/component tests pass, with zero lint warnings, strict TypeScript and a successful 54-entry static export. The50 content routes all passed asset/metadata/landmark and selected axe A/AA/best-practice checks in Chromium 156 and WebKit 27.2. URL filters, mobile focus/close/return, uncertain assessment/back/restart/refresh, no-JavaScript collection access and 404 checks pass. Later fixes rechecked menu focus and enlarged text in both engines; a known-answer Light Spring journey also passes.

All 50 desktop route screenshots were visually inspected through contact sheets, with shared templates also captured at mobile375 px. Responsive assertions cover six templates at 320, 375, 768, 1024 and 1440 px, 812×375 landscape, reduced motion and 200% text enlargement. Text-spacing overrides pass across six templates at 375 px.320 px reflow tests approximate1280 px at 400% browser zoom; actual browser zoom was not manually controlled. Reviewed template/state baseline captures are in qa/baselines; these are reference artefacts, not cross-platform CI pixel regression assertions.

qa/extra-evidence.json records zero axe violations in three questionnaire steps, a suggested-palette result and the mobile drawer. Measured design-token contrasts: dark text/cream13.78:1, muted text/cream8.20:1, muted text/paper7.28:1, white/plum12.15:1 and focus/cream8.39:1. These measurements cover those combinations only; disabled controls are inactive and require separate applicability judgement.

All 72 selected generated originals and 72 WebP copies exist. Originals total 177.1 MB; hashes are in image-manifest.json. Generation review is recorded in image-review-root.md and image-review-ui.md. Generated hair is an illustration, not a salon result guarantee.

Production dependency audit reports0 advisories. Full npm audit reports5 high entries through braces<=3.0.3, including micromatch/fast-glob/ESLint chains (development tooling); no fixed braces release was available. The production export contains no executable build toolchain. Reassess upstream before dependency upgrades; do not apply the incompatible force-fix downgrade.

Local Windows Firefox 157 failed before any site navigation with a SideBySide mozglue assembly error even after force-reinstallation. Linux GitHub Actions is the release source for Firefox results. CI and production results are recorded in the release section below.

Manual screen-reader review cannot be performed through the enabled browser-only computer controls. Accessibility-tree and keyboard assertions are recorded, but do not establish spoken announcement behaviour. The WCAG register remains open for human assistive-technology review, language/readability judgement and full AAA assessment. No conformance claim is made.

## Preview and CI observation

Preview deployment c71a2345-f82d-4d9e-bae6-cf7773178746 succeeded for c5fb1d8. GitHub Actions run 37838913050 completed successfully on Linux: lint, typecheck, 14 unit/component tests, build and 21 browser journeys across Chromium, Firefox and WebKit. The later 24-test run verified the added known-answer journey and target refinements before merge.

## Recorded release evidence —8October2026

Release source c4c9c345352fb4ed29b2e3832b9d9270b5a8cec9 (merged PR 1), following successful 24-journey Linux CI run 37839725874 on 1f1c8af. Production deployment e5481a21-0cc1-4e32-9159-b9435a2dcfeb succeeded at 20:36:13 UTC (21:36 BST). Canonical URL: https://hue-and-hair-c4w.pages.dev/.

Production verification passes all 50 routes and 72 byte-identical WebP assets, genuine404, HTTP301 to HTTPS, sitemap/robots and all five configured security headers. qa/live-verification.json records results and hashes. Ten additional live Chromium/WebKit journeys pass: direct/refreshable filters, empty results, mobile focus/return, unsure/back/restart/refresh assessment, positive tentative suggestion and 404.

Keyboard review on production passes skip-link reveal/main focus, keyboard select-to-URL update, Space/arrow radio operation, Enter advancement and focus movement. qa/keyboard-review.json and keyboard-focus.png retain evidence. Visual review of the focus capture confirms the skip control is visible and distinct. This is browser keyboard and visual inspection, not spoken assistive-technology testing.

A single cold local Chromium mobile lab run (375×812, 4×CPU, 150ms latency, 1.6 Mbps download) recorded LCP 1.392s and CLS0; see qa/performance-lab.json. It is synthetic evidence, not a field Core Web Vitals claim. Published image files total 8, 554, 440bytes versus177, 126, 659bytes of selected originals.

Automatic Cloudflare push builds have not been observed despite the enabled Git-source settings. Git-backed builds triggered through the official deployment API completed successfully for preview and production. Until push delivery is confirmed, use the documented explicit build trigger. No paid service was added.

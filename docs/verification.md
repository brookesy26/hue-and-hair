# Verification record

Record checks against an exact commit or deployment before describing the release as verified. A configured test, planned review or successful compilation is not evidence that a user journey, assistive-technology interaction or published deployment passed.

## Evidence recorded so far

| Check                     | Recorded result                            | Limits                                                                                                                         |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Content/domain unit tests | 2 files, 10 tests passed on 8 October 2026 | Covers validated catalogue, lookup, broken references and image paths, scoring, uncertainty, ties and demographic independence |
| Strict TypeScript         | Passed on 8 October 2026                   | Static typing does not establish runtime or visual correctness                                                                 |
| Production destination    | Confirmed by deployment lead during setup  | Final live commit and release smoke checks must be recorded separately                                                         |
| WCAG register             | All 86 current criteria mapped             | Applicable criteria remain pending manual review; no conformance claim                                                         |

The lead will append final lint, build, browser, asset and live-delivery results after integration. Do not count these as complete until the actual output is recorded.

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

Run and record both `npm audit` and `npm audit --omit=dev` after the final dependency installation. A production-only audit result is pending here; do not interpret that as zero vulnerabilities. Reassess the limitation when compatible upstream dependencies provide a repair.

## Final integration evidence

Pending lead update: commit/deployment identifiers, generation count, visual review count, lint/build/browser output, accessibility findings and production audit result. Keep unresolved checks clearly visible instead of marking the site compliant by default.

## Integrated local evidence —8October2026

14 unit/component tests pass, with zero lint warnings, strict TypeScript and a successful54-entry static export. The50 content routes all passed asset/metadata/landmark and selected axe A/AA/best-practice checks in Chromium156 and WebKit27.2. URL filters, mobile focus/close/return, uncertain assessment/back/restart/refresh, no-JavaScript collection access and404 checks pass. Later fixes rechecked menu focus and enlarged text in both engines; a known-answer Light Spring journey also passes.

All50 desktop route screenshots were visually inspected through contact sheets, with shared templates also captured at mobile375px. Responsive assertions cover six templates at320,375,768,1024 and1440px,812×375 landscape, reduced motion and200% text enlargement. Text-spacing overrides pass across six templates at375px.320px reflow tests approximate1280px at400% browser zoom; actual browser zoom was not manually controlled. Reviewed template/state baseline captures are in qa/baselines; these are reference artefacts, not cross-platform CI pixel regression assertions.

qa/extra-evidence.json records zero axe violations in three questionnaire steps, a suggested-palette result and the mobile drawer. Measured design-token contrasts: dark text/cream13.78:1, muted text/cream8.20:1, muted text/paper7.28:1, white/plum12.15:1 and focus/cream8.39:1. These measurements cover those combinations only; disabled controls are inactive and require separate applicability judgement.

All72 selected generated originals and72 WebP copies exist. Originals total177.1MB; hashes are in image-manifest.json. Generation review is recorded in image-review-root.md and image-review-ui.md. Generated hair is an illustration, not a salon result guarantee.

Production dependency audit reports0 advisories. Full npm audit reports5 high entries through braces<=3.0.3, including micromatch/fast-glob/ESLint chains (development tooling); no fixed braces release was available. The production export contains no executable build toolchain. Reassess upstream before dependency upgrades; do not apply the incompatible force-fix downgrade.

Local Windows Firefox157 failed before any site navigation with a SideBySide mozglue assembly error even after force-reinstallation. Linux GitHub Actions is the release source for Firefox results. CI and live production identifiers/results will be appended after observed completion.

Manual screen-reader review cannot be performed through the enabled browser-only computer controls. Accessibility-tree and keyboard assertions are recorded, but do not establish spoken announcement behaviour. The WCAG register remains open for human assistive-technology review, language/readability judgement and full AAA assessment. No conformance claim is made.

## Preview and CI observation

Preview deployment c71a2345-f82d-4d9e-bae6-cf7773178746 succeeded for c5fb1d8. GitHub Actions run37838913050 completed successfully on Linux: lint, typecheck,14 unit/component tests, build and21 browser journeys across Chromium, Firefox and WebKit. Source changes after this run add the known-answer journey and control target refinements; a new CI run must pass before merge.

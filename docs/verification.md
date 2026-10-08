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

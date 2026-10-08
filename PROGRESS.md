# Delivery progress

## Confirmed brief

30 women's hairstyle guides, 12 gender-neutral seasonal palettes, a tentative self-assessment and 72 generated images. Warm editorial design; top navigation; static Cloudflare Pages export. No accounts, uploads, tracking or saved answers.

## Stages 1–4 completed

- Foundation commit 749d3a1: Node 24.16.0, Next 16.4.0, React 19.3.0, strict TypeScript, Tailwind 4.3.3, GitHub Actions and static export configuration.
- Content/rules commit d3be433: validated local JSON, 30 hairstyle guides, 12 palettes, 8 comparison records, uncertainty-aware assessment and 10 domain tests.
- UI commit b12282b: cream/plum design, navigation and mobile dialog, gallery URL filters, 42 detail guides, supporting pages and component showcase;4 component tests.
- Image commit 14fa2ba:72 selected original PNGs (177.1 MB), matching optimised WebP copies and natural dimensions;60 hairstyle views, 8 comparisons, 4 editorial images. Every selected image inspected; original SHA-256 manifest retained. One cropped braid candidate was replaced. Sample blunt bob established lighting before reviewed batches.
- Verification/documentation commit c5fb1d8: browser journeys, architecture, editing/deployment guidance and 86-criterion WCAG 2.2 register.

## Stage 5 — released

- 14 unit/component tests, lint, strict typing and 54-entry production export pass.

- All 50 content pages traversed in Chromium and WebKit: complete assets/canonicals/landmarks, no page errors or axe violations under selected A/AA and best-practice tags. Desktop and mobile screenshots saved for every page.
- Responsive templates checked at 320, 375, 768, 1024, 1440 px; landscape, reduced motion and 200% text enlargement. Enlarged sticker text and WebKit dialog tab order fixed and rechecked.
- Additional questionnaire steps/suggested result/mobile drawer axe checks pass; six templates pass text-spacing overrides. Key contrast combinations7.28:1–13.78:1; focus/cream8.39:1.
- Windows Firefox 157 downloaded twice but cannot launch: SideBySide event reports missing mozglue assembly. GitHub Actions runs all three engines on Linux; final 24-journey CI passes.
- Preview deployed successfully with Wrangler: c71a2345-f82d-4d9e-bae6-cf7773178746, https://feat-website.hue-and-hair-c4w.pages.dev/. Source c5fb1d8; source configuration linked to GitHub. Automatic push-triggered Cloudflare builds have not yet been observed.
- PR 1 opened and attached: https://github.com/brookesy26/hue-and-hair/pull/1.
- Production npm audit:0 advisories. Full audit:5 high entries through an unpatched development-only braces advisory; tracked in verification documentation.
- Manual screen-reader review and actual400% browser zoom remain unavailable through enabled native controls;320 px reflow is checked. Full AAA conformance is not claimed.

## Usage checkpoints

Five-hour used:6% at foundation, 34% during image batches, 49% before final image optimisation, 58% during release QA. Reset 9October2026 01:26 Europe/London. Begin wrapping up at 85%; preserve 10% headroom.

## Remaining manual review

Screen-reader and actual 400% browser zoom review remain pending. Production release and automated/live gates are verified.

CI checkpoint: run 37838913050 passed all 21 three-engine browser tests on Linux. Windows Firefox launch issue is environment-specific; Firefox site journeys are now verified by CI. The final 24-test run passed the added result-state checks.

## Production delivery

Completed functional website and Git-backed production release on 8October2026. PR 1 merged as c4c9c34 after 24 browser journeys passed in CI 37839725874. Production deployment e5481a21-0cc1-4e32-9159-b9435a2dcfeb succeeded, serving https://hue-and-hair-c4w.pages.dev/.

All 50 production paths, 72 exact asset hashes, HTTPS redirects, sitemap/robots, security headers and 404 pass. Ten live Chromium/WebKit journeys and a keyboard review pass. All 50 desktop/mobile route captures and important interactive states reviewed. Published WebP total 8.55 MB; originals177.1 MB retained. Full evidence, measured contrast, lab performance and remaining manual accessibility gates are documented.

Known limits: screen-reader and actual400% browser zoom review remain pending; no AAA compliance claim. Development-only braces advisory remains unpatched. Cloudflare source settings are enabled, but push-triggered builds have not been observed; explicit Git-backed API preview/production builds work and are documented. The delivery uses no paid services.

Release checkpoint usage:68% five-hour used, 35% weekly used; five-hour reset 9October2026 01:26 Europe/London. Final handover commit records documentation/QA evidence and formatting without changing application behaviour.

## Photo-assisted assessment upgrade — in progress

Approved8October2026: optional front-camera capture or local photo selection, reuse one still image for labelled temperature/depth/clarity drapes, continue without a photo, positioning sliders, alternate colour sets, temporary memory only. No server upload or automatic face/season analysis. Current branch feat/photo-draping. Usage at start76% five-hour; user authorises all remaining allowance if needed, superseding the earlier10% headroom constraint for this upgrade.

Integration updates camera permission to same-origin only, permits local blob preview media, keeps microphone/geolocation disabled, updates privacy/accessibility copy and restarts photo state with answers. Camera streams must stop after capture/cancel/navigation/hidden tab, including pending-permission races; object URLs must be released on replacement/removal/unmount. Photo decoding limits, denied/unavailable camera, sample-switching and photo-free fallback will be verified before release.

Upgrade verification: 28 unit/component tests, lint, strict types and static build pass. Local Chromium/WebKit journeys verify optional photos, all questionnaire stages, positioning, invalid files, denied permission, memory-only handling, restart/refresh clearing, responsiveness and axe. Synthetic camera capture passes in Chromium; other engines use file journeys. Camera hardware and manual screen-reader testing remain pending. Cross-engine CI, preview and production release are next.

## Photo-assisted release

PR [2](https://github.com/brookesy26/hue-and-hair/pull/2) merges the optional camera/local-photo upgrade. Verified feature head `8eaaebb68cc915635e8cee455d32d6a59e6b1459` passed [GitHub Actions 37846821368](https://github.com/brookesy26/hue-and-hair/actions/runs/37846821368): lint, strict types, 28 unit/component tests, static build and full Chromium/Firefox/WebKit journeys. The synthetic canvas camera fixture runs in Chromium; file journeys cover all three engines.

Git-backed preview `ab2cd16f-48ec-4f10-b322-85afea56773c` passed live Chromium/WebKit photo journeys, 50 route checks, 72 asset hashes, HTTPS/404 and camera/CSP headers. Merge commit `a88fca09c766bbc58cd6da9b14d04a57e9e8874c` is queued for production deployment `2c86c331-b870-430d-8f0a-61a6b567a2a9`. Production confirmation follows below.

Production confirmation: deployment `2c86c331-b870-430d-8f0a-61a6b567a2a9` completed successfully and serves merge `a88fca09c766bbc58cd6da9b14d04a57e9e8874c`. Canonical production passed 5 Chromium/WebKit photo journeys (one explicitly skipped non-Chromium synthetic camera fixture), all 50 routes, all 72 asset hashes, HTTPS redirect, genuine404, sitemap/robots and security headers. Live camera permission is same-origin only; microphone remains disabled. Updated content editing, architecture, privacy, accessibility evidence and rollback guidance are retained. The preceding production `e5481a21` is the rollback target. Upgrade complete, with physical device cameras and manual screen-reader review explicitly unverified.

Allowance after release: five-hour usage96%, weekly39%; five-hour reset9October2026 01:26BST. User authorised using all remaining allowance for this implementation. No usage reset credit was consumed.

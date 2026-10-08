# Hue & Hair

Next.js static export, React, strict TypeScript, Tailwind. British English. Inclusive women's hairstyle guides and universal colour-analysis guidance.

Keep routes thin; content in src/content JSON, validation and data access in src/lib, domain logic in src/features. No accounts, server uploads, tracking, or persistence. Optional camera/photo comparisons process pictures only in page memory; stop camera tracks and release object URLs on cleanup. Never infer seasons from gender or ethnicity. Generated images must be labelled and alt text must describe the actual view.

Commands: npm run lint, npm run typecheck, npm test, npm run build, npm run test:e2e. Record actual results and limits in PROGRESS.md. Do not claim AAA compliance from automated checks. Do not commit dependencies, build output, secrets, or screenshots.

Parallel ownership: UI agent owns src/app and src/components; content agent owns src/content, src/lib, src/features/colour-analysis, tests/unit; lead owns configuration, assets, scripts, integration, browser tests, and delivery.

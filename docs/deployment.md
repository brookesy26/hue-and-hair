# Deploy and roll back

## Current destination

The project is GitHub-linked to [brookesy26/hue-and-hair](https://github.com/brookesy26/hue-and-hair), with production at [hue-and-hair-c4w.pages.dev](https://hue-and-hair-c4w.pages.dev/). Cloudflare Pages builds and serves a static export. The deployment lead confirmed this destination during setup; final deployment evidence belongs in `PROGRESS.md` and [verification](verification.md).

| Setting           | Value           |
| ----------------- | --------------- |
| Build command     | `npm run build` |
| Output directory  | `out`           |
| Node version      | `24.16.0`       |
| Production branch | `main`          |
| Build root        | Repository root |

Use the [Cloudflare static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/) for the static-export setup. This site needs neither Pages Functions nor a request-time Next.js runtime.

## Release workflow

Work on a feature branch and open a pull request. GitHub Actions checks lint, TypeScript, unit tests, production build and browser journeys. Cloudflare's connected project can produce a branch preview. Review the actual preview deployment before merging; configured CI is not proof that a particular run passed.

Confirm the build settings above in Workers & Pages for this project, and check that the Cloudflare build completed for the intended commit. No deployment secrets belong in source files or public JSON. Local npm commands build the site; they do not deploy it.

After production promotion, verify HTTPS and direct refreshes for home, the gallery, at least one hairstyle, colour overview, a palette, assessment and supporting pages. Check a missing route returns a genuine 404, assets load, sitemap and robots use the production domain, and header responses include the intended policies. Test filtering and a questionnaire journey on production, not just on localhost.

`public/_headers` is copied into the export for Cloudflare. It sets content-type sniffing protection, referrer and permissions policies, frame protection and a CSP. The current CSP permits inline scripts and styles for the exported Next.js pages; it is not a strict nonce-based CSP. The local preview server is a convenience tool and does not emulate every Cloudflare header or routing behaviour.

## Rollback

In Cloudflare Pages, open the project's Deployments view, select a known good successful **production** deployment and use its rollback action. Preview deployments are not rollback targets. Verify the restored production routes and assets afterwards. See [Cloudflare's rollback instructions](https://developers.cloudflare.com/pages/configuration/rollbacks/).

Then reconcile Git with the restored version: create a revert commit through a reviewable pull request, or fix the regression before the next production build. Avoid force-pushing or resetting shared history. Keep the deployment and commit identifiers in the release notes so the source and deployed result can be compared.

If this is the first deployment there may be no earlier production target. In that case, fix or revert the change in Git and rebuild. Do not assume an unverified preview is a safe rollback destination.

## Verified first release

Production deployment `e5481a21-0cc1-4e32-9159-b9435a2dcfeb` serves merge commit `c4c9c345352fb4ed29b2e3832b9d9270b5a8cec9`. The Git-built reviewed preview was `038b4cb2-ddfd-4720-bf41-aecda6854c38` on `1f1c8af`. PR 1 is merged and its24-test three-engine CI run passed. See verification.md and qa/live-verification.json for actual release observations.

The API-created project has automatic source deployment settings enabled, but an automatic response to a Git push has not been observed. Explicit Git-backed API builds were verified successfully. With an existing Wrangler OAuth sign-in, `node scripts/cloudflare-status.mjs --build --branch=main` queues the current main branch; use `--branch=feat/website` for the retained preview branch. Without `--build`, the script is read-only and reports deployment stages. It never prints the OAuth token. GitHub CLI helpers use the existing Git Credential Manager session and also keep credentials out of output.

The first production release has no earlier production version to roll back to. The retained successful production identifier can become the rollback target for later releases. Confirm source and output after rollback; a documentation-only follow-up commit need not alter the published site.

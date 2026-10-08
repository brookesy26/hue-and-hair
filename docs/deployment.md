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

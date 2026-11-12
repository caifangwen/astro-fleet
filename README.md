# Astro Fleet: 20 Industry Demo Sites

[![CI](https://github.com/caifangwen/astro-fleet/actions/workflows/ci.yml/badge.svg)](https://github.com/caifangwen/astro-fleet/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

This repository contains 20 English, one-page industry website concepts built with Astro. Each site is an independent workspace in `sites/fleet-*`, with its own brand copy, colors, favicon, and Cloudflare Pages project. The sites share one layout in `packages/shared-ui/src/layouts/IndustryDemo.astro`.

Browse the [20-site directory](docs/20-demo-sites.md) for project names, industries, brands, and Cloudflare URLs. Those URLs identify existing projects. Once the deployment secret is configured, changes pushed to `main` automatically publish the 20 demos through GitHub Actions.

> These are design demonstrations, not real businesses. They have no contact form or invented contact details. Every demo includes `noindex` and a `robots.txt` rule that blocks indexing.

## Quick start

Install [Bun](https://bun.sh/) and Node.js 22.12 or newer, then run:

```bash
git clone https://github.com/caifangwen/astro-fleet.git
cd astro-fleet
bun install
bun run dev --filter=fleet-agriculture
```

Open the local URL printed by Astro. To build all 20 demos:

```bash
bun run build --filter=fleet-* --concurrency=4
```

Each build is written to `sites/<project>/dist/`. To build one site, use `bun run build --filter=fleet-agriculture`.

## Edit a demo

| What to change | Where |
| --- | --- |
| Brand, services, audience, and colors | `scripts/industry-demo-content.json` |
| Shared page layout and visible UI text | `packages/shared-ui/src/layouts/IndustryDemo.astro` |
| Cloudflare hostname overrides | `pagesHostnames` in `scripts/generate-demo-sites.mjs` |
| One site's generated content | `sites/<project>/src/content.json` |

The 20 site workspaces are generated from `scripts/industry-demo-content.json`. After editing that source file, refresh the generated workspaces and rebuild:

```bash
node scripts/generate-demo-sites.mjs --update
bun run build --filter=fleet-* --concurrency=4
```

The `--update` command rewrites generated site files, including each site's `src/content.json` and `astro.config.mjs`. Edit the shared source data when a change should survive regeneration. Check the affected site's final HTML before publishing.

## Publish to Cloudflare Pages

The 20 demos use **direct uploads** to separate Cloudflare Pages projects.

### Automatic publishing from GitHub

The [Cloudflare publishing workflow](.github/workflows/cloudflare-pages.yml) builds and publishes all 20 demos when site code, shared packages, scripts, or build configuration changes on `main`.

One-time setup:

1. Create a Cloudflare API token with **Account → Cloudflare Pages → Edit**, restricted to the account that owns these projects.
2. Open this repository's **Settings → Secrets and variables → Actions → New repository secret**.
3. Save the token as `CLOUDFLARE_API_TOKEN`. The workflow already specifies the existing deployment account ID.
4. Open **Actions → Publish 20 sites to Cloudflare Pages → Run workflow** to publish the current English version.

Later qualifying pushes to `main` deploy automatically. You can also use **Run workflow** to retry a failed or interrupted deployment. Inspect the workflow logs to confirm all 20 projects finished. Never put the token in source code or README.

### Publish from your computer

Run the deployment script whenever you want to publish a local build.

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) so `wrangler` is on your `PATH`, and authenticate with `wrangler login` or a `CLOUDFLARE_API_TOKEN` authorized to manage Pages projects and deployments.
2. Set `CLOUDFLARE_ACCOUNT_ID` to the account that owns the Pages projects. Use an environment variable; do not commit credentials.
3. Build the demos, then run the script from the repository root:

```bash
bun install
bun run build --filter=fleet-* --concurrency=4

# macOS / Linux
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
node scripts/deploy-demo-sites.mjs
```

In PowerShell, set the account ID for the current shell before running the same script:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "your-account-id"
node scripts/deploy-demo-sites.mjs
```

The script checks Wrangler authentication and confirms that exactly 20 demo workspaces exist. It creates any missing Pages projects, then uploads each site's `dist` directory to its corresponding project's `main` production branch. Re-running it updates the same projects. If a run stops partway through, resume from a project in alphabetical order:

```bash
node scripts/deploy-demo-sites.mjs --from=fleet-health
```

To publish only one existing site after building it, use Wrangler directly:

```bash
wrangler pages deploy sites/fleet-agriculture/dist --project-name fleet-agriculture --branch main
```

Direct Upload projects do not gain automatic GitHub deployments later. Moving a site to Cloudflare's Git integration requires a new Pages project.

Cloudflare may assign a different `pages.dev` hostname when the preferred one is taken. The [site directory](docs/20-demo-sites.md) lists the assigned hostnames for the existing projects. Keep the hostname in each site's `astro.config.mjs` aligned with its actual Pages URL.

After deployment, open the URLs in the [site directory](docs/20-demo-sites.md) and verify the English copy, the demo notice, and the intended brand on each site. For a real business site, replace the concept content, add genuine contact details and a working enquiry flow, set its production domain, and review the content before removing indexing restrictions.

## Repository map

```text
packages/shared-ui/src/layouts/IndustryDemo.astro  Shared demo layout
scripts/industry-demo-content.json                Source content for 20 demos
scripts/generate-demo-sites.mjs                    Site generator
scripts/deploy-demo-sites.mjs                      Cloudflare Pages uploader
sites/fleet-*/                                     Independent Astro sites
docs/20-demo-sites.md                              Project and URL directory
```

The broader Astro Fleet starter, shared components, and guides remain in this repository. See [Getting Started](docs/getting-started.md), [Components](docs/components/README.md), and [Deployment](docs/deployment.md) for those features.

## Credits and license

Based on the [MIT-licensed Astro Fleet project by Indivar](https://github.com/Indivar/astro-fleet). See [LICENSE](LICENSE).


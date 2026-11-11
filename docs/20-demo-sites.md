# 20 English industry demo sites

These one-page English examples are generated from `scripts/generate-demo-sites.mjs` and share `packages/shared-ui/src/layouts/IndustryDemo.astro`. Each `sites/fleet-*` workspace has its own content, palette, layout variant, favicon, and independent static build. All sites are labelled as demonstrations. They have no enquiry form or fabricated contact details, and emit `noindex` plus `robots.txt` disallow rules.

| Project | Industry | Brand | Live site |
| --- | --- | --- | --- |
| fleet-agriculture | Agriculture | Greenfield Farm | [fleet-agriculture.pages.dev](https://fleet-agriculture.pages.dev/) |
| fleet-architecture | Architecture | Formline Studio | [fleet-architecture-dtv.pages.dev](https://fleet-architecture-dtv.pages.dev/) |
| fleet-beauty | Beauty Studio | Mira Beauty | [fleet-beauty.pages.dev](https://fleet-beauty.pages.dev/) |
| fleet-bookstore | Independent Bookstore | Between Pages | [fleet-bookstore.pages.dev](https://fleet-bookstore.pages.dev/) |
| fleet-coffee | Coffee Brand | Ridge & Roast | [fleet-coffee.pages.dev](https://fleet-coffee.pages.dev/) |
| fleet-dental | Dental Care | Clearpath Dental | [fleet-dental.pages.dev](https://fleet-dental.pages.dev/) |
| fleet-education | Education | Stepwise Academy | [fleet-education.pages.dev](https://fleet-education.pages.dev/) |
| fleet-events | Event Planning | Gatherwell Events | [fleet-events.pages.dev](https://fleet-events.pages.dev/) |
| fleet-finance | Financial Advisory | Northstar Finance | [fleet-finance.pages.dev](https://fleet-finance.pages.dev/) |
| fleet-fitness | Fitness Studio | Motion Lab | [fleet-fitness.pages.dev](https://fleet-fitness.pages.dev/) |
| fleet-health | Health Management | Wellnest Health | [fleet-health-7yv.pages.dev](https://fleet-health-7yv.pages.dev/) |
| fleet-interior | Interior Design | Nest & Form | [fleet-interior.pages.dev](https://fleet-interior.pages.dev/) |
| fleet-legal | Legal Services | Hearthstone Legal | [fleet-legal.pages.dev](https://fleet-legal.pages.dev/) |
| fleet-logistics | Logistics | Waymark Logistics | [fleet-logistics.pages.dev](https://fleet-logistics.pages.dev/) |
| fleet-outdoor | Outdoor Equipment | Trailkind | [fleet-outdoor.pages.dev](https://fleet-outdoor.pages.dev/) |
| fleet-pets | Pet Services | Paws & Co. | [fleet-pets.pages.dev](https://fleet-pets.pages.dev/) |
| fleet-photography | Photography | Afterlight Studio | [fleet-photography.pages.dev](https://fleet-photography.pages.dev/) |
| fleet-renewable | Clean Energy | Sunward Energy | [fleet-renewable.pages.dev](https://fleet-renewable.pages.dev/) |
| fleet-saas | Data Software | Flowline Analytics | [fleet-saas-bwv.pages.dev](https://fleet-saas-bwv.pages.dev/) |
| fleet-travel | Travel Planning | Farbound Travel | [fleet-travel.pages.dev](https://fleet-travel.pages.dev/) |

## Build

```bash
bun install
bun run build --filter=fleet-* --concurrency=4
```

## Publish to Cloudflare Pages

Sign in with Wrangler or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment. The token must be authorized to manage Pages projects and deployments. Then run:

```bash
node scripts/deploy-demo-sites.mjs
```

The script checks for exactly 20 sites and successful builds, lists existing Pages projects, creates missing projects, and deploys each site's `dist` directory to its own production project. Use `--from=fleet-name` to resume after an interruption. Cloudflare assigned alternate hostnames to three projects because their preferred hostnames were unavailable; the live links above and each site's `astro.config.mjs` use those assigned domains.

To turn a demo into a real business site, replace the brand and service content, add real contact details and a working enquiry endpoint, set the actual domain in `astro.config.mjs`, and remove the `noindex` and `robots.txt` restrictions only after reviewing the published content.

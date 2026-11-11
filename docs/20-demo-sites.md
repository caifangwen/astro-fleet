# 20 industry demo sites

These one-page Chinese-language examples are generated from `scripts/generate-demo-sites.mjs` and share `packages/shared-ui/src/layouts/IndustryDemo.astro`. Each `sites/fleet-*` workspace has its own content, palette, layout variant, favicon, and independent static build. They are explicitly labelled as demonstrations, have no enquiry form or fabricated contact details, and emit `noindex` plus `robots.txt` disallow rules.

| Project | Industry | Brand |
| --- | --- | --- |
| fleet-architecture | Architecture | 序构建筑 |
| fleet-dental | Dental | 齿间计划 |
| fleet-legal | Legal | 衡理事务 |
| fleet-coffee | Coffee | 山序咖啡 |
| fleet-fitness | Fitness | 动量实验室 |
| fleet-education | Education | 知阶学堂 |
| fleet-travel | Travel | 远行地图 |
| fleet-interior | Interior design | 栖物设计 |
| fleet-saas | Data software | 流线数据 |
| fleet-logistics | Logistics | 路标物流 |
| fleet-photography | Photography | 留光影像 |
| fleet-pets | Pet services | 爪印日常 |
| fleet-beauty | Beauty | 见己美学 |
| fleet-agriculture | Agriculture | 青田农场 |
| fleet-finance | Finance | 有数财务 |
| fleet-events | Event planning | 此刻策划 |
| fleet-outdoor | Outdoor equipment | 野径装备 |
| fleet-bookstore | Bookstore | 页间书店 |
| fleet-renewable | Clean energy | 向阳能源 |
| fleet-health | Health management | 安序健康 |

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

The script checks for exactly 20 sites and successful builds, lists existing Pages projects, creates missing projects, and deploys each site's `dist` directory to its own production project. Project names match the directory names. Cloudflare assigned alternate hostnames to three projects because their preferred hostnames were unavailable: `fleet-architecture-dtv.pages.dev`, `fleet-health-7yv.pages.dev`, and `fleet-saas-bwv.pages.dev`.

To turn a demo into a real business site, replace the brand and service content, add real contact details and a working enquiry endpoint, set the actual domain in `astro.config.mjs`, and remove the `noindex` and `robots.txt` restrictions only after reviewing the published content.

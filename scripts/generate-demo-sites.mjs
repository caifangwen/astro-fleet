/** Generate 20 clearly labelled industry demo sites from the shared Astro layout. */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesHostnames = {
  'fleet-architecture': 'fleet-architecture-dtv.pages.dev',
  'fleet-health': 'fleet-health-7yv.pages.dev',
  'fleet-saas': 'fleet-saas-bwv.pages.dev',
};
const projects = JSON.parse(readFileSync(new URL('./industry-demo-content.json', import.meta.url), 'utf8'));

const steps = [
  { title: 'Discover', detail: 'Start with goals, context, and constraints to understand what matters most.' },
  { title: 'Shape a plan', detail: 'Turn what we learn into a clear direction with useful choices and priorities.' },
  { title: 'Refine', detail: 'Use feedback to improve the experience as needs change over time.' },
];

for (const [index, row] of projects.entries()) {
  const [slug,name,industry,headline,intro,promise,audience,rawServices,ink,paper,accent,soft] = row;
  const id = `fleet-${slug}`;
  const dir = join(root, 'sites', id);
  if (existsSync(dir) && !process.argv.includes('--update')) throw new Error(`${dir} already exists; pass --update to refresh generated sites`);
  mkdirSync(join(dir, 'src', 'pages'), { recursive: true });
  mkdirSync(join(dir, 'public'), { recursive: true });
  const content = { name, industry, eyebrow: `${industry} / WEBSITE CONCEPT`, headline, intro, promise, audience,
    services: rawServices.map((service) => { const [title,detail] = service.split('|'); return { title,detail }; }),
    steps, about: `${name} is a website concept for the ${industry.toLowerCase()} sector. Clear storytelling, practical service descriptions, and an easy-to-read visual hierarchy show how a brand in this field could present its value online.`,
    palette: { ink,paper,accent,soft }, layout: index % 4, index: index + 1 };
  writeFileSync(join(dir,'src','content.json'), JSON.stringify(content,null,2)+'\n');
  writeFileSync(join(dir,'src','pages','index.astro'), `---\nimport IndustryDemo from '@astro-fleet/shared-ui/src/layouts/IndustryDemo.astro';\nimport content from '../content.json';\n---\n<IndustryDemo {content} />\n`);
  writeFileSync(join(dir,'astro.config.mjs'), `import { defineConfig } from 'astro/config';\nexport default defineConfig({ site: 'https://${pagesHostnames[id] ?? `${id}.pages.dev`}', output: 'static' });\n`);
  writeFileSync(join(dir,'package.json'), JSON.stringify({name:id,version:'0.1.0',private:true,type:'module',scripts:{build:'astro build',dev:'astro dev',preview:'astro preview',lint:'astro check'},dependencies:{astro:'^6.1.7','@astro-fleet/shared-ui':'workspace:*','@astro-fleet/config':'workspace:*'},devDependencies:{'@astrojs/check':'^0.9',typescript:'^5'}},null,2)+'\n');
  writeFileSync(join(dir,'public','robots.txt'), 'User-agent: *\nDisallow: /\n');
  writeFileSync(join(dir,'public','favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${ink}"/><circle cx="32" cy="32" r="18" fill="${accent}"/></svg>\n`);
  writeFileSync(join(dir,'public','_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n');
  console.log(`${String(index+1).padStart(2,'0')} ${id} ${name}`);
}

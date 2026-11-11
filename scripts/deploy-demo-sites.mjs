/** Publish the 20 generated static demo sites to independent Cloudflare Pages projects. */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projects = readdirSync(join(root, 'sites'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('fleet-'))
  .map((entry) => entry.name).sort();

if (projects.length !== 20) throw new Error(`Expected 20 demo sites, found ${projects.length}`);

function wrangler(args) {
  const result = spawnSync(process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler', args, {
    cwd: root, encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'],
  });
  if (result.status !== 0) throw new Error(`wrangler ${args.join(' ')} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

// Check authentication before creating anything.
wrangler(['whoami']);
const existing = JSON.parse(wrangler(['pages', 'project', 'list', '--json']));
const existingNames = new Set(existing.map((project) => project.name));
const results = [];

for (const project of projects) {
  const dist = join(root, 'sites', project, 'dist');
  if (!existsSync(join(dist, 'index.html'))) throw new Error(`${project} has no build; run bun run build --filter=fleet-* first`);
  if (!existingNames.has(project)) {
    console.log(`Creating ${project}...`);
    wrangler(['pages', 'project', 'create', project, '--production-branch', 'main']);
  }
  console.log(`Deploying ${project}...`);
  const output = wrangler(['pages', 'deploy', dist, '--project-name', project, '--branch', 'main']);
  const url = output.match(/https:\/\/[^\s]+\.pages\.dev\/?/g)?.at(-1) ?? `https://${project}.pages.dev`;
  results.push({ project, url });
  console.log(`${project}: ${url}`);
}

console.log(JSON.stringify(results, null, 2));

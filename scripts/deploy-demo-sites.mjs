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
if (!process.env.CLOUDFLARE_ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID to the intended Cloudflare account before publishing');
const startAt = process.argv.find((arg) => arg.startsWith('--from='))?.slice('--from='.length);
if (startAt && !projects.includes(startAt)) throw new Error(`Unknown starting project: ${startAt}`);

function wrangler(args) {
  const command = process.platform === 'win32' ? 'cmd.exe' : 'wrangler';
  const commandArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'wrangler.cmd', ...args] : args;
  const result = spawnSync(command, commandArgs, {
    cwd: root, encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'],
  });
  if (result.status !== 0) throw new Error(`wrangler ${args.join(' ')} failed:\n${result.error?.message || result.stderr || result.stdout}`);
  return result.stdout;
}

// Validate Pages access before creating anything; avoid requiring account-list permissions.
const existing = JSON.parse(wrangler(['pages', 'project', 'list', '--json']));
const existingNames = new Set(existing.map((project) => project.name ?? project['Project Name']));
const results = [];

for (const project of startAt ? projects.slice(projects.indexOf(startAt)) : projects) {
  const dist = join(root, 'sites', project, 'dist');
  if (!existsSync(join(dist, 'index.html'))) throw new Error(`${project} has no build; run bun run build --filter=fleet-* first`);
  if (!existingNames.has(project)) {
    console.log(`Creating ${project}...`);
    wrangler(['pages', 'project', 'create', project, '--production-branch', 'main', '--force']);
  }
  console.log(`Deploying ${project}...`);
  const output = wrangler(['pages', 'deploy', dist, '--project-name', project, '--branch', 'main']);
  const deploymentUrl = output.match(/https:\/\/[^\s]+\.pages\.dev\/?/g)?.at(-1);
  if (!deploymentUrl) throw new Error(`No deployment URL returned for ${project}`);
  const hostname = new URL(deploymentUrl).hostname;
  const url = `https://${hostname.replace(/^[a-f0-9]{8}\./, '')}`;
  results.push({ project, url });
  console.log(`${project}: ${url}`);
}

console.log(JSON.stringify(results, null, 2));

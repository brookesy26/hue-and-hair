import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const config = await readFile(
  join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'),
  'utf8',
);
const token = config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];
if (!token) throw Error('OAuth required');
const headers = { Authorization: `Bearer ${token}` };
const a = await (
  await fetch('https://api.cloudflare.com/client/v4/accounts', { headers })
).json();
const id = a.result[0].id;
const url = `https://api.cloudflare.com/client/v4/accounts/${id}/pages/projects/hue-and-hair/deployments`;
const data = await (await fetch(url, { headers })).json();
if (!data.success) throw Error(JSON.stringify(data.errors));
console.log(
  JSON.stringify(
    data.result.slice(0, 5).map((d) => ({
      id: d.id,
      url: d.url,
      environment: d.environment,
      stage: d.latest_stage,
      commit: d.deployment_trigger.metadata.commit_hash,
      branch: d.deployment_trigger.metadata.branch,
      aliases: d.aliases,
    })),
  ),
);

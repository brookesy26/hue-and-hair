import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
// Reuse Wrangler's existing OAuth session without exposing credentials.
const config = await readFile(
  join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'),
  'utf8',
);
const token = config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];
if (!token) throw new Error('Wrangler OAuth sign-in required.');
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};
const accountsResponse = await fetch(
  'https://api.cloudflare.com/client/v4/accounts',
  { headers },
);
const accounts = await accountsResponse.json();
if (!accounts.success) throw new Error('Cannot read Cloudflare accounts');
if (accounts.result.length !== 1)
  throw new Error('Multiple accounts: choose the project account.');
const account = accounts.result[0].id;
const api = `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects`;
const existing = await (await fetch(api, { headers })).json();
console.log(
  JSON.stringify(
    existing.result?.map((p) => ({
      name: p.name,
      source: p.source,
      build_config: p.build_config,
    })),
    null,
    2,
  ),
);
if (process.argv.includes('--create')) {
  const body = {
    name: 'hue-and-hair',
    production_branch: 'main',
    build_config: {
      build_command: 'npm run build',
      destination_dir: 'out',
      root_dir: '',
      build_caching: true,
    },
    deployment_configs: {
      production: {
        env_vars: { NODE_VERSION: { type: 'plain_text', value: '24.16.0' } },
      },
      preview: {
        env_vars: { NODE_VERSION: { type: 'plain_text', value: '24.16.0' } },
      },
    },
    source: {
      type: 'github',
      config: {
        owner: 'brookesy26',
        repo_name: 'hue-and-hair',
        production_branch: 'main',
        deployments_enabled: true,
        production_deployments_enabled: true,
        preview_deployment_setting: 'all',
        pr_comments_enabled: true,
      },
    },
  };
  const response = await fetch(api, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const result = await response.json();
  console.log(
    JSON.stringify({
      status: response.status,
      success: result.success,
      errors: result.errors,
      url: result.result?.subdomain,
      source: result.result?.source,
    }),
  );
}

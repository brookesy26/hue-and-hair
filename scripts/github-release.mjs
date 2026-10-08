import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
const r = spawnSync('git', ['credential', 'fill'], {
  input: 'protocol=https\nhost=github.com\n\n',
  encoding: 'utf8',
  env: { ...process.env, GCM_INTERACTIVE: 'never', GIT_TERMINAL_PROMPT: '0' },
});
if (r.status) throw Error('Git credentials unavailable');
const c = Object.fromEntries(
  r.stdout
    .trim()
    .split('\n')
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);
const headers = {
  Authorization: `Bearer ${c.password}`,
  Accept: 'application/vnd.github+json',
  'Content-Type': 'application/json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const api = 'https://api.github.com/repos/brookesy26/hue-and-hair';
async function request(path, method = 'GET', body) {
  const response = await fetch(api + path, {
    headers,
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok)
    throw Error(`${method} ${path}: ${response.status} ${data.message}`);
  return data;
}
if (process.argv.includes('--create')) {
  const prs = await request('/pulls?head=brookesy26:feat/website&state=open');
  const p =
    prs[0] ||
    (await request('/pulls', 'POST', {
      title: 'Build Hue & Hair hairstyle and inclusive colour guidance website',
      head: 'feat/website',
      base: 'main',
      body: await readFile('docs/pull-request.md', 'utf8'),
    }));
  console.log(
    JSON.stringify({ pr: p.html_url, number: p.number, head: p.head.sha }),
  );
}
if (process.argv.includes('--status')) {
  const runs = await request('/actions/runs?per_page=5');
  console.log(
    JSON.stringify(
      runs.workflow_runs.map((r) => ({
        id: r.id,
        sha: r.head_sha,
        branch: r.head_branch,
        status: r.status,
        conclusion: r.conclusion,
        url: r.html_url,
      })),
    ),
  );
  const checks = await request('/commits/feat/website/check-runs');
  console.log(
    JSON.stringify(
      checks.check_runs.map((c) => ({
        name: c.name,
        status: c.status,
        conclusion: c.conclusion,
        url: c.details_url,
      })),
    ),
  );
}
if (process.argv.includes('--jobs')) {
  const data = await request('/actions/runs/37838913050/jobs');
  console.log(
    JSON.stringify(
      data.jobs.map((j) => ({
        status: j.status,
        conclusion: j.conclusion,
        steps: j.steps.map((s) => ({
          name: s.name,
          status: s.status,
          conclusion: s.conclusion,
        })),
      })),
    ),
  );
}
if (process.argv.includes('--merge')) {
  const p = (
    await request('/pulls?head=brookesy26:feat/website&state=open')
  )[0];
  if (!p) throw Error('No PR');
  const checks = await request(`/commits/${p.head.sha}/check-runs`);
  if (
    !checks.check_runs.some(
      (c) => c.name === 'checks' && c.conclusion === 'success',
    )
  )
    throw Error('Verified CI required');
  console.log(
    JSON.stringify(
      await request(`/pulls/${p.number}/merge`, 'PUT', {
        merge_method: 'merge',
        sha: p.head.sha,
      }),
    ),
  );
}

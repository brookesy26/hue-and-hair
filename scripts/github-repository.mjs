import { spawnSync } from 'node:child_process';
// Use the existing Git Credential Manager session. Never print credentials.
const result = spawnSync('git', ['credential', 'fill'], {
  input: 'protocol=https\nhost=github.com\n\n',
  encoding: 'utf8',
  env: { ...process.env, GCM_INTERACTIVE: 'never', GIT_TERMINAL_PROMPT: '0' },
});
if (result.status !== 0) {
  console.error(
    'Existing GitHub Git credentials unavailable. Sign-in required.',
  );
  process.exit(1);
}
const credential = Object.fromEntries(
  result.stdout
    .trim()
    .split('\n')
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);
const headers = {
  Authorization: `Bearer ${credential.password}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const userResponse = await fetch('https://api.github.com/user', { headers });
if (!userResponse.ok) {
  console.error('GitHub authentication failed', userResponse.status);
  process.exit(1);
}
const user = await userResponse.json();
const existing = await fetch(
  `https://api.github.com/repos/${user.login}/hue-and-hair`,
  { headers },
);
if (existing.ok) {
  const repo = await existing.json();
  console.log(
    JSON.stringify({
      url: repo.html_url,
      clone: repo.clone_url,
      existing: true,
    }),
  );
} else if (existing.status === 404) {
  const response = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'hue-and-hair',
      description:
        'Inclusive hairstyle inspiration and personal colour guidance. Next.js static website.',
      private: false,
      auto_init: false,
    }),
  });
  const repo = await response.json();
  console.log(
    JSON.stringify({
      status: response.status,
      url: repo.html_url,
      clone: repo.clone_url,
      message: repo.message,
    }),
  );
  if (!response.ok) process.exit(1);
} else {
  console.error('Repository lookup failed', existing.status);
  process.exit(1);
}

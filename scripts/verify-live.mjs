import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const base = process.argv[2] || 'https://hue-and-hair-c4w.pages.dev';
const hairstyles = JSON.parse(
  await readFile('src/content/hairstyles.json', 'utf8'),
);
const palettes = JSON.parse(
  await readFile('src/content/palettes.json', 'utf8'),
);
const images = JSON.parse(
  await readFile('src/content/image-metadata.json', 'utf8'),
);
const paths = [
  '/',
  '/hairstyles/',
  '/colour-analysis/',
  '/self-assessment/',
  '/about/',
  '/privacy/',
  '/accessibility/',
  '/components/',
  ...hairstyles.map((h) => `/hairstyles/${h.slug}/`),
  ...palettes.map((p) => `/colour-analysis/${p.slug}/`),
];
const routes = await Promise.all(
  paths.map(async (path) => {
    const r = await fetch(base + path);
    const html = await r.text();
    if (
      r.status !== 200 ||
      !html.includes('<h1') ||
      !html.includes('hue-and-hair-c4w.pages.dev')
    )
      throw Error('Route ' + path);
    return { path, status: r.status };
  }),
);
const assets = await Promise.all(
  Object.keys(images).map(async (path) => {
    const r = await fetch(base + path);
    if (!r.ok || !r.headers.get('content-type')?.includes('image/webp'))
      throw Error('Asset ' + path);
    const remote = Buffer.from(await r.arrayBuffer());
    const local = await readFile('public' + path);
    if (!remote.equals(local)) throw Error('Asset mismatch ' + path);
    return {
      path,
      bytes: remote.length,
      sha256: createHash('sha256').update(remote).digest('hex'),
    };
  }),
);
const home = await fetch(base);
const headers = Object.fromEntries(
  [
    'content-security-policy',
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy',
    'permissions-policy',
  ].map((k) => [k, home.headers.get(k)]),
);
if (Object.values(headers).some((v) => !v))
  throw Error('Missing security header');
const missing = await fetch(base + '/not-a-real-route/');
if (missing.status !== 404) throw Error('404');
const robots = await (await fetch(base + '/robots.txt')).text();
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
if (
  !robots.includes('https://hue-and-hair-c4w.pages.dev') ||
  !sitemap.includes('/hairstyles/blunt-bob/')
)
  throw Error('SEO');
const http = await fetch(base.replace('https:', 'http:'), {
  redirect: 'manual',
});
if (
  http.status < 300 ||
  http.status > 399 ||
  !http.headers.get('location')?.startsWith('https:')
)
  throw Error('HTTPS redirect');
const evidence = {
  base,
  checkedAt: new Date().toISOString(),
  routes,
  assets,
  headers,
  missingStatus: missing.status,
  httpRedirect: http.status,
  robots: 'passed',
  sitemap: 'passed',
};
await writeFile(
  'qa/live-verification.json',
  JSON.stringify(evidence, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    base,
    routes: routes.length,
    assets: assets.length,
    headers,
    missing: missing.status,
    httpsRedirect: http.status,
  }),
);

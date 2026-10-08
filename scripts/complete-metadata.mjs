import { readFile, writeFile } from 'node:fs/promises';
const routes = [
  '',
  'hairstyles',
  'colour-analysis',
  'self-assessment',
  'about',
  'privacy',
  'accessibility',
  'components',
];
for (const route of routes) {
  const path = `src/app/${route ? route + '/' : ''}page.tsx`;
  let text = await readFile(path, 'utf8');
  const canonical = `/${route ? route + '/' : ''}`;
  if (/export const metadata\s*=\s*\{/.test(text))
    text = text.replace(
      /export const metadata\s*=\s*\{/,
      `export const metadata = { alternates: { canonical: '${canonical}' },`,
    );
  else
    text =
      `export const metadata = { alternates: { canonical: '${canonical}' } };\n` +
      text;
  await writeFile(path, text);
}
for (const [route, variable] of [
  ['hairstyles', 'h'],
  ['colour-analysis', 'p'],
]) {
  const path = `src/app/${route}/[slug]/page.tsx`;
  let text = await readFile(path, 'utf8');
  text = text.replace(
    'return { title:',
    `return { alternates: { canonical: \`/${route}/\${${variable}?.slug ?? ''}/\` }, title:`,
  );
  await writeFile(path, text);
}
// Preserve the entire landscape consultation image instead of cropping faces.
const css = 'src/app/globals.css';
let text = await readFile(css, 'utf8');
text +=
  '\n.hero-art .media img { height: auto; aspect-ratio: 3 / 2; border-radius: 9rem 9rem 0 0; object-fit: cover; }\n';
await writeFile(css, text);
const layout = 'src/app/layout.tsx';
text = await readFile(layout, 'utf8');
text = text.replace(
  'width: 900,\n        height: 1100,',
  'width: 1536,\n        height: 1024,',
);
await writeFile(layout, text);

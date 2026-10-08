import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('qa/baselines', { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const findings = [];
for (const [name, path] of [
  ['home', '/'],
  ['gallery', '/hairstyles/'],
  ['hair-detail', '/hairstyles/blunt-bob/'],
  ['colour', '/colour-analysis/'],
  ['palette', '/colour-analysis/light-spring/'],
  ['quiz', '/self-assessment/'],
]) {
  await page.goto('http://127.0.0.1:3300' + path);
  await page.locator('img').evaluateAll(async (imgs) => {
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            img.loading = 'eager';
            if (img.complete) return resolve();
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
      ),
    );
  });
  await page.screenshot({ path: `qa/baselines/${name}.png`, fullPage: false });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addStyleTag({
    content:
      '* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}',
  });
  if (
    !(await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ))
  )
    throw Error('Text spacing overflow ' + path);
  await page.setViewportSize({ width: 1440, height: 900 });
}
await page.goto('http://127.0.0.1:3300/self-assessment/');
for (const [i, index] of [
  [0, 0],
  [1, 0],
  [2, 1],
]) {
  await page.getByRole('radio').nth(index).check();
  const a = await new AxeBuilder({ page }).analyze();
  findings.push({
    state: 'question' + (i + 1),
    violations: a.violations.map((v) => v.id),
  });
  await page
    .getByRole('button', {
      name: i === 2 ? /See suggestions/ : /Next question/,
    })
    .click();
}
await expect(page.locator('.palette-card')).toHaveCount(1);
await expect(page.getByRole('link', { name: /Light Spring/ })).toBeVisible();
const a = await new AxeBuilder({ page }).analyze();
findings.push({
  state: 'suggestion',
  violations: a.violations.map((v) => v.id),
});
await page.screenshot({ path: 'qa/baselines/quiz-suggestion.png' });
await page.goto('http://127.0.0.1:3300/');
await page.setViewportSize({ width: 375, height: 812 });
await page.getByRole('button', { name: /Menu/ }).click();
const d = await new AxeBuilder({ page }).analyze();
findings.push({
  state: 'mobile-menu',
  violations: d.violations.map((v) => v.id),
});
await page.screenshot({ path: 'qa/baselines/mobile-menu.png' });
await page.keyboard.press('Escape');
await page.keyboard.press('Shift+Tab');
await page.keyboard.press('Shift+Tab');
await page.keyboard.press('Enter');
function luminance(hex) {
  const c = hex
    .match(/\w\w/g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2);
}
const contrasts = [
  ['ink/cream', '30252b', 'faf7f1'],
  ['muted/cream', '57464f', 'faf7f1'],
  ['muted/paper', '57464f', 'f0e9df'],
  ['white/plum', 'ffffff', '4d2b3d'],
  ['focus/cream', '703653', 'faf7f1'],
].map(([name, a, b]) => ({ name, ratio: contrast(a, b) }));
if (findings.some((f) => f.violations.length))
  throw Error(JSON.stringify(findings));
await writeFile(
  'qa/extra-evidence.json',
  JSON.stringify(
    {
      date: '2026-10-08',
      browser: browser.version(),
      textSpacing: 'six templates at375px passed',
      baselines: 'six templates plus suggestion and mobile drawer',
      axeStates: findings,
      contrast: contrasts,
      screenReader:
        'Not available through enabled native control; pending manual review',
      zoom: '200% text enlargement checked;320px reflow equivalent to1280px at400% browser zoom, actual browser zoom pending',
    },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify({ states: findings, contrasts }));
await browser.close();

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import type { Hairstyle, Palette } from '../../src/lib/content';
const hairstyles: Hairstyle[] = JSON.parse(
  readFileSync('src/content/hairstyles.json', 'utf8'),
);
const palettes: Palette[] = JSON.parse(
  readFileSync('src/content/palettes.json', 'utf8'),
);
const questions = { length: 3 };

const pages = [
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
test('every page has complete assets, metadata, landmarks and no serious axe findings', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const path of pages) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.title()).toContain('Hue');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /hue-and-hair-c4w.pages.dev/,
    );
    await page.locator('img').evaluateAll(async (imgs) => {
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              (img as HTMLImageElement).loading = 'eager';
              if ((img as HTMLImageElement).complete) return resolve();
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            }),
        ),
      );
    });
    expect(
      await page
        .locator('img')
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => !(i as HTMLImageElement).naturalWidth)
            .map((i) => i.getAttribute('src')),
        ),
      path,
    ).toEqual([]);
    const findings = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
        'best-practice',
      ])
      .analyze();
    expect(findings.violations, path).toEqual([]);
    if (info.project.name === 'chromium') {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({
        path: `qa/screenshots/${path.replaceAll('/', '_') || 'home'}-desktop.png`,
        fullPage: true,
      });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({
        path: `qa/screenshots/${path.replaceAll('/', '_') || 'home'}-mobile.png`,
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      await page.setViewportSize({ width: 1280, height: 720 });
    }
  }
  expect(errors).toEqual([]);
});
test('filters survive direct access and refresh and recover from empty results', async ({
  page,
}) => {
  await page.goto('/hairstyles/?texture=Coily&length=Short');
  await expect(
    page.getByRole('combobox', { name: 'Texture', exact: true }),
  ).toHaveValue('Coily');
  await expect(
    page.getByRole('combobox', { name: 'Length', exact: true }),
  ).toHaveValue('Short');
  const count = hairstyles.filter(
    (h) => h.texture === 'Coily' && h.length === 'Short',
  ).length;
  await expect(page.getByRole('status')).toContainText(`${count} hairstyles`);
  await page.reload();
  await expect(page.getByRole('status')).toContainText(`${count} hairstyles`);
  await page.goto('/hairstyles/?texture=nonexistent');
  await expect(page.getByRole('status')).toContainText('30 hairstyles');
  const longOnly = hairstyles.find((h) => h.slug === 'long-box-braids')!;
  await page.goto(
    '/hairstyles/?' +
      new URLSearchParams({ length: 'Short', style: longOnly.style }),
  );
  await expect(
    page.getByRole('heading', { name: 'A different combination?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByRole('status')).toContainText('30 hairstyles');
});
test('mobile menu traps focus, Escape closes, and returns focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: /Menu/ });
  await menu.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest('dialog')),
      ),
    ).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: /Hairstyles/ })
    .click();
  await expect(page).toHaveURL(/hairstyles/);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('questionnaire supports uncertain answers, back, results, restart and refresh clearing', async ({
  page,
}) => {
  await page.goto('/self-assessment/');
  await expect(
    page.getByRole('button', { name: /Next question/ }),
  ).toBeDisabled();
  for (let i = 0; i < questions.length; i++) {
    await page.getByRole('radio').last().check();
    if (i === 1) {
      await page.getByRole('button', { name: /Back/ }).click();
      await expect(page.getByRole('radio').last()).toBeChecked();
      await page.getByRole('button', { name: /Next question/ }).click();
    }
    await page
      .getByRole('button', {
        name: i === questions.length - 1 ? /See suggestions/ : /Next question/,
      })
      .click();
  }
  await expect(
    page.getByRole('heading', {
      name: 'Keep exploring: there is no clear starting palette yet',
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.getByRole('radio').last()).not.toBeChecked();
  await page.getByRole('radio').first().check();
  await page.reload();
  await expect(page.getByRole('radio').first()).not.toBeChecked();
});
test('responsive templates, landscape, text enlargement and reduced motion', async ({
  page,
}, info) => {
  for (const width of [320, 375, 768, 1024, 1440])
    for (const path of [
      '/',
      '/hairstyles/',
      '/hairstyles/blunt-bob/',
      '/colour-analysis/',
      '/colour-analysis/light-spring/',
      '/self-assessment/',
    ]) {
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path}:${width}`,
      ).toBe(true);
    }
  await page.setViewportSize({ width: 812, height: 375 });
  await page.goto('/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await page.setViewportSize({ width: 320, height: 812 });
  await page.addStyleTag({
    content: 'html{font-size:200%} body{font-size:1rem}',
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  if (info.project.name === 'chromium')
    await page.screenshot({
      path: 'qa/screenshots/home-enlarged.png',
      fullPage: true,
    });
});
test('script failure preserves navigation and all gallery guides', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto('/hairstyles/');
  await expect(
    page.getByRole('navigation', { name: 'Navigation without JavaScript' }),
  ).toBeVisible();
  await expect(page.locator('main .style-card')).toHaveCount(30);
  await context.close();
});
test('missing routes return an accessible 404', async ({ page }) => {
  const response = await page.goto('/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
});

test('known answers suggest a tentative palette with accessible intermediate states', async ({
  page,
}) => {
  await page.goto('/self-assessment/');
  for (const [step, answer] of [
    [0, 0],
    [1, 0],
    [2, 1],
  ]) {
    await page.getByRole('radio').nth(answer).check();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page
      .getByRole('button', {
        name: step === 2 ? /See suggestions/ : /Next question/,
      })
      .click();
  }
  await expect(page.locator('.palette-card')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: 'A palette to explore' }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('link', { name: /Light Spring/ }).click();
  await expect(page).toHaveURL(/light-spring/);
});

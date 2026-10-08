import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const fixture = {
  name: 'portrait.webp',
  mimeType: 'image/webp',
  buffer: readFileSync('public/images/editorial/hairstyles.webp'),
};
const photoInput = 'Choose a local JPG, PNG or WebP photo';

test('local drapes remain optional, preserve the photo and clear on restart or refresh', async ({
  page,
}, info) => {
  await page.goto('/self-assessment/');
  const origin = new URL(page.url()).origin;
  const outgoing: string[] = [];
  page.on('request', (request) => {
    if (
      !['GET', 'HEAD'].includes(request.method()) ||
      new URL(request.url()).origin !== origin
    )
      outgoing.push(request.url());
  });
  await page.getByRole('button', { name: 'Continue without a photo' }).click();
  await expect(page.locator('.assessment-panel')).toBeFocused();
  await page.getByLabel(photoInput).setInputFiles(fixture);
  const photos = page.locator('.photo-drape-panel img');
  await expect(photos).toHaveCount(2);
  const source = await photos.first().getAttribute('src');
  expect(source).toMatch(/^blob:/);
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await page.getByLabel('Colour comparison').selectOption({ index: 1 });
  await expect(page.locator('.photo-drape-panel').first()).toContainText(
    'Warm olive',
  );
  await page.getByLabel('Photo zoom').fill('1.5');
  expect(
    await photos.evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('style')),
    ),
  ).toEqual([
    expect.stringContaining('scale(1.5)'),
    expect.stringContaining('scale(1.5)'),
  ]);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 375) {
      await page
        .getByRole('button', { name: 'Cool blue-green', exact: true })
        .click();
      await expect(
        page.getByRole('button', { name: 'Cool blue-green', exact: true }),
      ).toHaveAttribute('aria-pressed', 'true');
    }
    if (info.project.name === 'chromium' && [375, 1440].includes(width))
      await page.screenshot({
        path: `qa/screenshots/photo-${width}.png`,
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 812, height: 375 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByLabel('Photo zoom').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByLabel('Photo zoom')).toBeFocused();
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.addStyleTag({ content: 'html { font-size: 100%; }' });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('radio', { name: /Warm colours/ }).check();
  await page.getByRole('button', { name: /Next question/ }).click();
  await expect(photos).toHaveCount(3);
  await expect(photos.first()).toHaveAttribute('src', source!);
  await page.getByRole('button', { name: /Back/ }).click();
  await expect(page.getByRole('radio', { name: /Warm colours/ })).toBeChecked();
  await page.getByRole('button', { name: /Next question/ }).click();
  await page.getByRole('radio', { name: /Unsure or several/ }).check();
  await page.getByRole('button', { name: /Next question/ }).click();
  await page.getByRole('radio', { name: /Unsure or both/ }).check();
  await page.getByRole('button', { name: /See suggestions/ }).click();
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.locator('.photo-tool img')).toHaveCount(0);
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await page.getByLabel(photoInput).setInputFiles(fixture);
  await page.reload();
  await expect(page.locator('.photo-tool img')).toHaveCount(0);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  expect(outgoing).toEqual([]);
});

test('invalid photos and denied camera permission leave the questionnaire usable', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => {
          throw new DOMException('Denied', 'NotAllowedError');
        },
      },
    }),
  );
  await page.goto('/self-assessment/');
  await page.getByRole('button', { name: 'Continue without a photo' }).click();
  await expect(page.locator('.assessment-panel')).toBeFocused();
  await page.getByLabel(photoInput).setInputFiles({
    name: 'photo.heic',
    mimeType: 'image/heic',
    buffer: Buffer.from('example'),
  });
  await expect(page.locator('.photo-error')).toContainText(/JPG|JPEG/);
  await page.getByLabel(photoInput).setInputFiles({
    name: 'broken.png',
    mimeType: 'image/png',
    buffer: Buffer.from('not an image'),
  });
  await expect(page.locator('.photo-error')).toBeVisible();
  await page.getByRole('button', { name: 'Use front camera' }).click();
  await expect(page.locator('.photo-error')).toContainText(
    /permission|declined|denied/i,
  );
  await page.getByRole('radio', { name: /Unsure or both/ }).check();
  await expect(
    page.getByRole('button', { name: /Next question/ }),
  ).toBeEnabled();
});

test('camera capture freezes one photo and stops the video tracks', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'chromium',
    'Synthetic canvas MediaStream camera fixture is verified in Chromium; photo journeys run in all engines.',
  );
  await page.addInitScript(() => {
    const state = window as unknown as {
      cameraStream: MediaStream;
      cameraConstraints: MediaStreamConstraints;
    };
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async (constraints: MediaStreamConstraints) => {
          state.cameraConstraints = constraints;
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const context = canvas.getContext('2d')!;
          const stream = canvas.captureStream(10);
          state.cameraStream = stream;
          const timer = setInterval(() => {
            context.fillStyle = '#d4b7a3';
            context.fillRect(0, 0, 640, 480);
            if (
              stream.getTracks().every((track) => track.readyState === 'ended')
            )
              clearInterval(timer);
          }, 80);
          return stream;
        },
      },
    });
  });
  await page.goto('/self-assessment/');
  await page.getByRole('button', { name: 'Use front camera' }).click();
  await expect(
    page.getByRole('button', { name: 'Capture photo' }),
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Capture photo' }).click();
  await expect(page.locator('.photo-drape-panel img')).toHaveCount(2);
  expect(
    await page.evaluate(() => {
      const state = window as unknown as {
        cameraStream: MediaStream;
        cameraConstraints: MediaStreamConstraints;
      };
      return {
        ended: state.cameraStream
          .getTracks()
          .every((track) => track.readyState === 'ended'),
        constraints: state.cameraConstraints,
      };
    }),
  ).toEqual({
    ended: true,
    constraints: { audio: false, video: { facingMode: { ideal: 'user' } } },
  });
  await page.getByRole('button', { name: 'Remove photo' }).click();
  await expect(page.locator('.photo-drape-panel img')).toHaveCount(0);
});

import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 375, height: 812 } });
const p = await c.newPage();
await p.goto('https://hue-and-hair-c4w.pages.dev/');
await p.keyboard.press('Tab');
await expect(p.getByRole('link', { name: 'Skip to content' })).toBeFocused();
await p.screenshot({ path: 'qa/keyboard-focus.png' });
await p.keyboard.press('Enter');
await expect(p.locator('main')).toBeFocused();
await p.goto('https://hue-and-hair-c4w.pages.dev/hairstyles/');
const select = p.getByRole('combobox', { name: 'Texture', exact: true });
await select.focus();
await p.keyboard.press('ArrowDown');
await p.keyboard.press('Enter');
await expect(select).toHaveValue('Straight');
await expect(p).toHaveURL(/texture=Straight/);
await p.goto('https://hue-and-hair-c4w.pages.dev/self-assessment/');
await p.getByRole('radio').first().focus();
await p.keyboard.press('Space');
await expect(p.getByRole('radio').first()).toBeChecked();
await p.keyboard.press('ArrowRight');
await expect(p.getByRole('radio').nth(1)).toBeChecked();
await p.keyboard.press('ArrowLeft');
await expect(p.getByRole('radio').first()).toBeChecked();
await p.getByRole('button', { name: /Next question/ }).focus();
await p.keyboard.press('Enter');
await expect(p.getByRole('radio').first()).not.toBeChecked();
await expect(p.locator('.assessment-panel')).toBeFocused();
await writeFile(
  'qa/keyboard-review.json',
  JSON.stringify(
    {
      date: new Date().toISOString(),
      base: 'https://hue-and-hair-c4w.pages.dev',
      browser: b.version(),
      passed: [
        'Tab reveals skip link',
        'Enter moves focus to main',
        'Select ArrowDown/Enter updates URL',
        'Radio Space and left/right arrow operation',
        'Enter advances question and focus moves to panel',
      ],
      limits:
        'Browser keyboard events and visual focus inspection; no spoken screen-reader evaluation',
    },
    null,
    2,
  ) + '\n',
);
console.log('Keyboard review passed');
await b.close();

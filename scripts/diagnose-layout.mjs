import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 320, height: 812 } });
await page.goto('http://127.0.0.1:3300/');
await page.addStyleTag({ content: 'html{font-size:200%}body{font-size:1rem}' });
console.log(
  await page.evaluate(() =>
    Array.from(document.querySelectorAll('main *, header *, footer *'))
      .map((e) => ({
        tag: e.tagName,
        class: e.className,
        text: e.textContent?.slice(0, 50),
        left: e.getBoundingClientRect().left,
        right: e.getBoundingClientRect().right,
      }))
      .filter((e) => e.right > innerWidth + 1 || e.left < 0)
      .slice(0, 20),
  ),
);
await page.screenshot({
  path: 'qa/screenshots/zoom-diagnostic.png',
  fullPage: true,
});
await browser.close();

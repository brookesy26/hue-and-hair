import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const b = await chromium.launch();
const c = await b.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 1,
});
const p = await c.newPage();
const session = await c.newCDPSession(p);
await session.send('Network.enable');
await session.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: 200000,
  uploadThroughput: 100000,
});
await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await p.addInitScript(() => {
  window.__lab = { lcp: 0, cls: 0 };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__lab.lcp = e.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      if (!e.hadRecentInput) window.__lab.cls += e.value;
  }).observe({ type: 'layout-shift', buffered: true });
});
await p.goto('http://127.0.0.1:3300/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const metrics = await p.evaluate(() => ({
  ...window.__lab,
  resources: performance.getEntriesByType('resource').map((e) => ({
    name: e.name.split('/').pop(),
    bytes: e.transferSize,
    duration: e.duration,
  })),
  navigation: performance.getEntriesByType('navigation')[0].toJSON(),
}));
const record = {
  date: new Date().toISOString(),
  conditions:
    'Local static server,Chromium,375x812,4x CPU,150ms latency,1.6Mbps down; single cold synthetic run, not field Core Web Vitals',
  metrics,
};
await writeFile(
  'qa/performance-lab.json',
  JSON.stringify(record, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    lcp: metrics.lcp,
    cls: metrics.cls,
    loadedBytes: metrics.resources.reduce((s, e) => s + e.bytes, 0),
  }),
);
await b.close();

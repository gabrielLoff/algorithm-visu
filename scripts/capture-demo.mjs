import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1100, height: 600 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Maze select is the second <select> on the page
  const selects = page.locator('select');
  const mazeSelect = selects.nth(1);
  const algoSelect = selects.nth(0);

  await mazeSelect.selectOption("Prim's");
  await page.click('button:has-text("Generate")');
  await page.waitForTimeout(1500);

  await algoSelect.selectOption('A*');
  await page.click('button:has-text("Run")');

  const frames = [];
  const startTime = Date.now();
  const duration = 4000;

  while (Date.now() - startTime < duration) {
    frames.push(await page.screenshot({ type: 'png' }));
    await page.waitForTimeout(80);
  }

  await browser.close();

  const dir = 'public/demo-frames';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  frames.forEach((buf, i) => writeFileSync(`${dir}/frame-${String(i).padStart(4, '0')}.png`, buf));
  writeFileSync('public/demo-preview.png', frames[frames.length - 1]);

  console.log(`Created ${frames.length} frames and demo-preview.png`);

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

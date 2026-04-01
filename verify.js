import { chromium } from '@playwright/test';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5174');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/verification.png' });
  console.log('Saved verification.png');
  await browser.close();
})();

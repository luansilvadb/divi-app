import { test, expect, chromium } from '@playwright/test';

test('Verify mobile premium bottom sheet', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X dimensions
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  console.log('Navigating to local dev server...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
  } catch(e) {
    console.log('Could not load local server.');
  }

  // Check if we are on the dashboard
  const content = await page.content();
  if (content.includes('Nova Transação')) {
     console.log('We are on the dashboard!');
  } else {
     console.log('We might be on login...');
     const emailInput = await page.$('input[type="email"]');
     if (emailInput) {
       await page.fill('input[type="email"]', 'test@example.com');
       await page.fill('input[type="password"]', 'password');
       await page.click('button[type="submit"]');
       await page.waitForTimeout(2000);
     }
  }

  // Actually wait for it to be visible by clicking it through a more generic selector or locator
  console.log('Clicking Nova Transação...');
  try {
    const btn = await page.getByRole('button', { name: 'Nova Transação' });
    await btn.click({ timeout: 5000 });

    // Wait for the BottomSheet to appear
    console.log('Waiting for BottomSheet...');
    await page.waitForSelector('.sheet-content', { state: 'visible', timeout: 5000 });

    // Wait a bit for the animation to finish
    await page.waitForTimeout(1000);

    // Take screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ path: '/home/jules/verification/verification.png' });
    console.log('Verification screenshot saved to /home/jules/verification/verification.png');
  } catch (err) {
    console.error('Failed to open transaction form:', err.message);
    await page.screenshot({ path: '/home/jules/verification/error.png' });
    console.log('Error screenshot saved to /home/jules/verification/error.png');
  }

  await browser.close()
});

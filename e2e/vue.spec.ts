import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  // Depending on whether the user is logged in or not, it might redirect to login.
  // We'll check for the app name or an element we know exists on load.
  await expect(page.locator('h1, .app-header')).toHaveCount(1, { timeout: 10000 })
})

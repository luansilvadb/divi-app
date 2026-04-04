import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to login page
        try:
            await page.goto("http://localhost:5173", timeout=10000)
            await page.wait_for_timeout(3000)

            # Screenshot of login page
            await page.screenshot(path="verification/login_primevue.png")
            print("Screenshot taken: verification/login_primevue.png")

            # Check for PrimeVue components or classes if possible
            # But just seeing it renders is a good start

        except Exception as e:
            print(f"Error: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())

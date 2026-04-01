from playwright.sync_api import sync_playwright
import time

def verify_drawer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a mobile device so that the bottom bar is rendered (it's hidden on md viewports)
        context = browser.new_context(
            viewport={'width': 375, 'height': 667},
            is_mobile=True
        )
        page = context.new_page()
        page.goto('http://localhost:5173')

        # Wait a bit for auth/redirects
        time.sleep(3)

        # Take a screenshot
        page.screenshot(path='/app/verification/drawer.png')

        browser.close()

if __name__ == '__main__':
    verify_drawer()

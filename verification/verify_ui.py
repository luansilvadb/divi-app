from playwright.sync_api import sync_playwright, expect
import time

def test_ui(page):
    # Navigate to app
    page.goto("http://localhost:5173")
    time.sleep(2) # wait for render

    # Initial screenshot of login page
    page.screenshot(path="verification/login_screen.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_ui(page)
        finally:
            browser.close()

from playwright.sync_api import sync_playwright
import time

def test_select(page):
    # Setup auth mock and go directly to transactions
    page.route("**/auth/v1/user", lambda route: route.fulfill(status=200, json={"id": "1", "email": "test@test.com", "user_metadata": {"full_name": "Test"}}))
    page.route("**/auth/v1/session", lambda route: route.fulfill(status=200, json={"access_token": "token"}))
    page.goto("http://localhost:5173/transactions")
    time.sleep(2)

    # Try to open transaction modal
    try:
        # Use visible text or roles
        page.get_by_role("button", name="Nova Transação").click()
    except:
        pass

    time.sleep(1)

    # Click the category select
    try:
        page.locator("#category").click()
    except:
        pass

    time.sleep(1)

    # Take screenshot
    page.screenshot(path="verification/select_overlay.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # set viewport size to desktop to see the modal
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()
        try:
            test_select(page)
        finally:
            browser.close()

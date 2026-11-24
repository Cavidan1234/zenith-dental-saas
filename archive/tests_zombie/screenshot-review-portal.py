import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r"C:\Users\LocalAdmin\.gemini\antigravity\brain\c0d14e19-494a-484c-97c4-cc90ff00906e"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()

        print("1. Navigating to /review?ref=ZD-829104 (5-Star View)...")
        page.goto("http://localhost:3000/review?ref=ZD-829104", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Capture default 5-Star View
        five_star_path = os.path.join(ARTIFACT_DIR, "review_portal_five_star_google_funnel.png")
        page.screenshot(path=five_star_path, full_page=True)
        print(f"Captured: {five_star_path}")

        # Click Star 2 to test the private resolution branch
        print("2. Clicking Star 2 (Private Resolution Ticket View)...")
        star_buttons = page.locator("button[aria-label^='Rate']")
        if star_buttons.count() >= 2:
            star_buttons.nth(1).click()
            page.wait_for_timeout(600)

            two_star_path = os.path.join(ARTIFACT_DIR, "review_portal_private_resolution_branch.png")
            page.screenshot(path=two_star_path, full_page=True)
            print(f"Captured: {two_star_path}")

        browser.close()
        print("Review Portal screenshots captured successfully!")

if __name__ == '__main__':
    run()

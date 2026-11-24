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

        print("Navigating to /manage?ref=ZD-829104...")
        page.goto("http://localhost:3000/manage?ref=ZD-829104", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Click Add to Wallet
        wallet_btn = page.locator("button:has-text('Add to Wallet')")
        assert wallet_btn.is_visible(), "Add to Wallet button not found!"
        wallet_btn.click()
        page.wait_for_timeout(800)

        pass_path = os.path.join(ARTIFACT_DIR, "manage_portal_apple_wallet_pass_modal.png")
        page.screenshot(path=pass_path)
        print(f"Captured: {pass_path}")

        # Switch to Google Wallet
        gpay_btn = page.locator("button:has-text('Google Wallet Pass')")
        if gpay_btn.is_visible():
            gpay_btn.click()
            page.wait_for_timeout(600)
            gpass_path = os.path.join(ARTIFACT_DIR, "manage_portal_google_wallet_pass_modal.png")
            page.screenshot(path=gpass_path)
            print(f"Captured: {gpass_path}")

        browser.close()
        print("Wallet Pass screenshots captured successfully!")

if __name__ == '__main__':
    run()

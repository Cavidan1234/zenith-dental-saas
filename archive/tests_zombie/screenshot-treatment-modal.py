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

        print("1. Navigating to /dashboard...")
        page.goto("http://localhost:3000/dashboard", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Open All Bookings tab
        page.locator("button:has-text('All Bookings')").click()
        page.wait_for_timeout(600)

        # Click Dossier for Emma Richardson
        dossier_btn = page.locator("tr:has-text('Emma Richardson') button:has-text('Dossier')").first
        dossier_btn.click()
        page.wait_for_timeout(800)

        # Click "Official Agreement" in Treatment Plan builder
        plan_btn = page.locator("button:has-text('Official Agreement')")
        assert plan_btn.is_visible(), "Official Agreement button not found!"
        plan_btn.click()
        page.wait_for_timeout(800)

        modal_path = os.path.join(ARTIFACT_DIR, "dashboard_official_treatment_plan_agreement_modal.png")
        page.screenshot(path=modal_path)
        print(f"Captured: {modal_path}")

        browser.close()
        print("Treatment Plan Agreement modal screenshot captured successfully!")

if __name__ == '__main__':
    run()

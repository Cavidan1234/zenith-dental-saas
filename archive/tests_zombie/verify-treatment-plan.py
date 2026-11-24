import sys
import time
from playwright.sync_api import sync_playwright

def verify_treatment_plan():
    print("[1/4] Launching browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("[2/4] Navigating to http://localhost:3000/dashboard...")
        page.goto("http://localhost:3000/dashboard", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1000)

        print("[3/4] Opening Patient Dossier Drawer...")
        # Switch to All Bookings table to click Dossier
        page.locator("button:has-text('All Bookings')").click()
        page.wait_for_timeout(600)

        dossier_btn = page.locator("button:has-text('Dossier')").first
        dossier_btn.click()
        page.wait_for_timeout(1200)

        # Verify Treatment Plan Estimator is visible
        plan_header = page.locator("text=Treatment Plan & Cost Estimator")
        assert plan_header.is_visible(), "Treatment Plan & Cost Estimator header not found!"
        print("  -> Treatment Plan & Cost Estimator is visible in Dossier.")

        # Click Bupa / AXA (10%) discount
        page.locator("button:has-text('Bupa / AXA (10%)')").click()
        page.wait_for_timeout(500)

        # Click Copy Quote
        copy_btn = page.locator("button:has-text('Copy Quote')")
        copy_btn.click()
        page.wait_for_timeout(600)

        page.screenshot(path=r"C:\Users\LocalAdmin\.gemini\antigravity\brain\c0d14e19-494a-484c-97c4-cc90ff00906e\dashboard_dossier_treatment_plan.png")
        print("  -> Captured dashboard_dossier_treatment_plan.png")

        print("[4/4] Verification finished successfully!")
        browser.close()

if __name__ == "__main__":
    verify_treatment_plan()

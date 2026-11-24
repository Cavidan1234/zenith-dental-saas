import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r"C:\Users\LocalAdmin\.gemini\antigravity\brain\c0d14e19-494a-484c-97c4-cc90ff00906e"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()

        print("1. Navigating to /manage?ref=ZD-829104...")
        page.goto("http://localhost:3000/manage?ref=ZD-829104", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Screenshot the manage portal with the triage strip
        manage_path = os.path.join(ARTIFACT_DIR, "manage_portal_with_medical_clearance.png")
        page.screenshot(path=manage_path, full_page=True)
        print(f"Captured: {manage_path}")

        # Click "Update Triage" to open the Medical Intake modal
        update_btn = page.locator("button:has-text('Update Triage')")
        if update_btn.is_visible():
            update_btn.click()
            page.wait_for_timeout(800)
            intake_modal_path = os.path.join(ARTIFACT_DIR, "manage_portal_medical_intake_modal.png")
            page.screenshot(path=intake_modal_path)
            print(f"Captured: {intake_modal_path}")

        # Navigate to Dashboard and open patient dossier to capture Dossier Medical Triage Alert
        print("2. Navigating to /dashboard...")
        page.goto("http://localhost:3000/dashboard", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Switch to All Bookings tab
        appts_tab = page.locator("button:has-text('All Bookings')")
        if appts_tab.is_visible():
            appts_tab.click()
            page.wait_for_timeout(600)

        # Click Dossier for Emma Richardson
        dossier_btn = page.locator("tr:has-text('Emma Richardson') button:has-text('Dossier')").first
        if dossier_btn.is_visible():
            dossier_btn.click()
            page.wait_for_timeout(800)
            dossier_path = os.path.join(ARTIFACT_DIR, "dashboard_dossier_medical_alert.png")
            page.screenshot(path=dossier_path)
            print(f"Captured: {dossier_path}")

        browser.close()
        print("All triage screenshots successfully captured!")

if __name__ == '__main__':
    run()

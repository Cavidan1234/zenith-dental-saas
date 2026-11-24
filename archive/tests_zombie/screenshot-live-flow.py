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

        print("Navigating to /dashboard...")
        page.goto("http://localhost:3000/dashboard", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Click "Surgery Flow & Lounge" Tab
        tab_btn = page.locator("button:has-text('Surgery Flow & Lounge')")
        assert tab_btn.is_visible(), "Surgery Flow tab button not found!"
        tab_btn.click()
        page.wait_for_timeout(800)

        # Capture initial Live Flow Kanban
        flow_path = os.path.join(ARTIFACT_DIR, "dashboard_surgery_corridor_live_flow.png")
        page.screenshot(path=flow_path)
        print(f"Captured: {flow_path}")

        # Check in the first patient (Emma Richardson or Oliver Vance)
        checkin_btn = page.locator("button:has-text('Check-In')").first
        if checkin_btn.is_visible():
            checkin_btn.click()
            page.wait_for_timeout(800)

            # Capture with patient in Waiting Lounge
            lounge_path = os.path.join(ARTIFACT_DIR, "dashboard_patient_in_waiting_lounge.png")
            page.screenshot(path=lounge_path)
            print(f"Captured: {lounge_path}")

        browser.close()
        print("Live Flow screenshots captured successfully!")

if __name__ == '__main__':
    run()

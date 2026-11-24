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

        print("Navigating to /dashboard (Schedule Tab)...")
        page.goto("http://localhost:3000/dashboard", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Ensure we are on Schedule tab
        sched_btn = page.locator("button:has-text('Schedule (Time-Grid)')")
        if sched_btn.is_visible():
            sched_btn.click()
            page.wait_for_timeout(600)

        cal_path = os.path.join(ARTIFACT_DIR, "dashboard_operatory_radar_and_buffers.png")
        page.screenshot(path=cal_path)
        print(f"Captured: {cal_path}")

        browser.close()

if __name__ == '__main__':
    run()

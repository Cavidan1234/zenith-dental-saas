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

        # Capture full page with checklist
        checklist_path = os.path.join(ARTIFACT_DIR, "manage_portal_clinical_prep_checklist.png")
        page.screenshot(path=checklist_path, full_page=True)
        print(f"Captured: {checklist_path}")

        browser.close()

if __name__ == '__main__':
    run()

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

        print("1. Navigating to /dashboard...")
        page.goto("http://localhost:3000/dashboard", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Go to All Bookings tab
        page.locator("button:has-text('All Bookings')").click()
        page.wait_for_timeout(600)

        # Click Dossier for Emma Richardson
        dossier_btn = page.locator("tr:has-text('Emma Richardson') button:has-text('Dossier')").first
        dossier_btn.click()
        page.wait_for_timeout(800)

        # Click "AI SOAP Scribe"
        scribe_btn = page.locator("button:has-text('AI SOAP Scribe')")
        assert scribe_btn.is_visible(), "AI SOAP Scribe button not found!"
        scribe_btn.click()
        page.wait_for_timeout(600)

        # Click 1-Click Chart Synthesis
        synth_btn = page.locator("button:has-text('1-Click Chart Synthesis')")
        if synth_btn.is_visible():
            synth_btn.click()
            page.wait_for_timeout(1000)

        modal_path = os.path.join(ARTIFACT_DIR, "dashboard_ai_soap_scribe_modal.png")
        page.screenshot(path=modal_path)
        print(f"Captured: {modal_path}")

        # Click "Insert into Patient Dossier"
        insert_btn = page.locator("button:has-text('Insert into Patient Dossier')")
        if insert_btn.is_visible():
            insert_btn.click()
            page.wait_for_timeout(600)

        # Capture Dossier with newly inserted note
        dossier_path = os.path.join(ARTIFACT_DIR, "dashboard_dossier_with_inserted_soap_note.png")
        page.screenshot(path=dossier_path)
        print(f"Captured: {dossier_path}")

        browser.close()
        print("AI SOAP Scribe screenshots captured successfully!")

if __name__ == '__main__':
    run()

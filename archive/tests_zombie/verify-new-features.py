import sys
import time
from playwright.sync_api import sync_playwright

def verify_new_dashboard_features():
    print("[1/5] Launching Playwright browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("[2/5] Navigating to http://localhost:3000/dashboard...")
        page.goto("http://localhost:3000/dashboard", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1000)

        # 1. Test All Bookings WhatsApp Modal
        print("[3/5] Testing WhatsApp Outbound Reminder in Bookings...")
        page.locator("button:has-text('All Bookings')").click()
        time.sleep(1)

        # Click the first WhatsApp button
        whatsapp_btn = page.locator("button[title='Send WhatsApp Outbound Reminder']").first
        whatsapp_btn.click()
        time.sleep(2.2) # Allow delivery status to reach 'read' (✓✓ blue)

        page.screenshot(path=r"C:\Users\LocalAdmin\.gemini\antigravity\brain\c0d14e19-494a-484c-97c4-cc90ff00906e\dashboard_whatsapp_reminder_modal.png")
        print("  -> Captured dashboard_whatsapp_reminder_modal.png")

        # Close WhatsApp Modal
        page.keyboard.press("Escape")
        time.sleep(0.5)
        # If still visible, click close
        close_btn = page.locator("button:has(svg.lucide-x)")
        if close_btn.count() > 0 and close_btn.first.is_visible():
            close_btn.first.click()
            time.sleep(0.5)

        # 2. Test Practice Analytics Tab & CSV Export
        print("[4/5] Testing Analytics Tab with Time Period Switching & CSV Export...")
        page.locator("button:has-text('Practice Analytics')").click()
        time.sleep(1)

        # Switch to Last 30 Days
        page.locator("button:has-text('Last 30 Days')").click()
        time.sleep(0.8)

        # Switch to Quarter-to-Date
        page.locator("button:has-text('Quarter-to-Date')").click()
        time.sleep(0.8)

        page.screenshot(path=r"C:\Users\LocalAdmin\.gemini\antigravity\brain\c0d14e19-494a-484c-97c4-cc90ff00906e\dashboard_analytics_quarter_csv.png")
        print("  -> Captured dashboard_analytics_quarter_csv.png")

        # Test CSV Export button
        with page.expect_download() as download_info:
            page.locator("button:has-text('Export Financial Audit (CSV)')").click()
        download = download_info.value
        csv_path = r"c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\scratch_audit.csv"
        download.save_as(csv_path)
        print(f"  -> Successfully generated & downloaded CSV audit to: {csv_path}")

        with open(csv_path, 'r', encoding='utf-8') as f:
            csv_lines = f.readlines()
        print(f"  -> CSV contains {len(csv_lines)} rows. Header: {csv_lines[0].strip()[:80]}...")

        print("[5/5] All new features verified successfully!")
        browser.close()

if __name__ == "__main__":
    verify_new_dashboard_features()

import sys
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 850})

        # Go to manage portal
        page.goto('http://localhost:3000/manage?ref=ZD-829104', wait_until='networkidle')
        page.wait_for_selector('text=OFFICIAL SURGERY PASS')
        print('[OK] Manage portal loaded!')

        # Verify Insurance section exists
        ins_btn = page.locator('button:text-is("Verify Insurance Policy")')
        ins_btn.wait_for(state='visible', timeout=5000)
        print('[OK] Insurance card found! Clicking Verify Insurance Policy...')
        ins_btn.click()

        # Modal should open
        modal = page.locator('[role="dialog"]')
        modal.wait_for(state='visible', timeout=5000)
        print('[OK] Insurance Modal open!')

        # Choose AXA
        axa_btn = modal.locator('button', has_text='AXA').first
        axa_btn.click()
        print('[OK] Clicked AXA!')
        page.wait_for_timeout(300)

        # Click verify button
        verify_action = modal.locator('button', has_text='Verify Policy').first
        verify_action.click()
        print('[OK] Verification in progress...')

        # Wait for instant approval badge
        modal.locator('text=INSTANT APPROVAL').wait_for(state='visible', timeout=8000)
        print('[OK] Insurance Pre-Auth Issued!')

        page.screenshot(path=r'C:\Users\LocalAdmin\.gemini\antigravity\brain\c0d14e19-494a-484c-97c4-cc90ff00906e\manage_portal_insurance_preauth_modal.png')
        print('[OK] Modal screenshot saved!')

        # Click apply/close
        close_btn = modal.locator('button', has_text='Pre-Authorization Applied').first
        close_btn.click()
        page.wait_for_timeout(500)

        # Check updated card on pass
        page.locator('text=Private Insurance Pre-Authorised: AXA Health Direct').wait_for(state='visible', timeout=5000)
        print('[OK] Pass updated with verified insurance!')

        page.screenshot(path=r'C:\Users\LocalAdmin\.gemini\antigravity\brain\c0d14e19-494a-484c-97c4-cc90ff00906e\manage_portal_verified_insurance_card.png')
        print('[OK] Pass screenshot saved!')

        browser.close()

if __name__ == '__main__':
    run()

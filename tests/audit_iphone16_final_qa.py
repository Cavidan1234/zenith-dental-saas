import sys
import os
import json
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://zenith-dental-studio-sage.vercel.app/b/zenith-dental"
OUTPUT_DIR = "tests/qa_artifacts"

def run_qa():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 16: 393 x 852, scale 3, touch enabled, mobile user agent
        context = browser.new_context(
            viewport={"width": 393, "height": 852},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        print(f"--> [QA] Loading {BASE_URL} on iPhone 16 (393 x 852)...")
        page.goto(BASE_URL, wait_until="networkidle")
        page.evaluate("() => window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)

        # -------------------------------------------------------------
        # 1. INITIAL HERO FULLSCREEN & NEXT SECTION PEEK CHECK
        # -------------------------------------------------------------
        print("\n=== 1. Hero Height & Next Section Offset Check (at scrollY = 0) ===")
        meta_theme_initial = page.evaluate("() => document.querySelector('meta[name=\"theme-color\"]')?.getAttribute('content')")
        meta_viewport = page.evaluate("() => document.querySelector('meta[name=\"viewport\"]')?.getAttribute('content')")
        scroll_y = page.evaluate("() => window.scrollY")
        hero_rect = page.evaluate("() => document.querySelector('main > section:first-child')?.getBoundingClientRect()")
        doctors_rect = page.evaluate("() => document.getElementById('doctors')?.getBoundingClientRect()")

        print(f"Initial Meta theme-color (Hero): {meta_theme_initial}")
        print(f"Initial scrollY: {scroll_y}")
        print(f"Hero rect height: {hero_rect.get('height') if hero_rect else None}px")
        print(f"Doctors section top offset: {doctors_rect.get('top') if doctors_rect else None}px")

        # Doctors section must be >= 852px down at scrollY == 0
        hero_no_peek = doctors_rect and doctors_rect['top'] >= 852
        print(f"Hero completely covers viewport without next section peeking: {hero_no_peek}")
        results['hero_no_peek'] = hero_no_peek

        # Check calligraphy SVG for drop-shadow box artifact
        svg_filter = page.evaluate("() => { const svg = document.querySelector('main > section:first-child svg[viewBox]'); return svg ? window.getComputedStyle(svg).filter : null; }")
        print(f"Zenith Calligraphy SVG filter: '{svg_filter}' (Expected: 'none' or zero white box)")
        results['calligraphy_box_clean'] = (svg_filter is None or svg_filter == 'none')

        hero_shot = os.path.join(OUTPUT_DIR, "iphone16_hero.png")
        page.screenshot(path=hero_shot)
        print(f"Captured: {hero_shot}")

        # -------------------------------------------------------------
        # 2. VIEWPORT & PURE WHITE STATUS BAR / DYNAMIC ISLAND
        # -------------------------------------------------------------
        print("\n=== 2. Safe Area & Pure White Top Theme Color ===")
        page.evaluate("() => window.scrollTo(0, 200)")
        page.wait_for_timeout(300)
        meta_theme_scrolled = page.evaluate("() => document.querySelector('meta[name=\"theme-color\"]')?.getAttribute('content')")
        content_bg = page.evaluate("() => { const el = document.getElementById('doctors')?.closest('div.bg-white'); return el ? window.getComputedStyle(el).backgroundColor : null; }")
        print(f"Initial Meta theme-color (Hero / Dynamic Island): {meta_theme_initial} (Expected: #ffffff)")
        print(f"Scrolled Meta theme-color (Content): {meta_theme_scrolled} (Expected: #ffffff)")
        print(f"Content wrapper bg: {content_bg} (Expected: rgb(255, 255, 255))")

        results['dynamic_island_meta'] = {
            'top_pure_white': meta_theme_initial == '#ffffff',
            'scrolled_pure_white': meta_theme_scrolled == '#ffffff',
            'content_bg_pure_white': content_bg == 'rgb(255, 255, 255)'
        }

        # -------------------------------------------------------------
        # 3. DOCTOR CARDS: BADGE REMOVAL & TAP-TO-REVEAL
        # -------------------------------------------------------------
        print("\n=== 3. Doctor Cards: Badges & Mobile Tap-to-Reveal ===")
        page.locator("#doctors").scroll_into_view_if_needed()
        page.wait_for_timeout(600)

        # Check badges count (BDS, MSc London and Harley Street Suite)
        badges_found = page.evaluate("() => { const text = document.getElementById('doctors')?.innerText || ''; return text.includes('BDS, MSc London') || text.includes('Harley Street Suite'); }")
        print(f"Doctor badges completely removed: {not badges_found}")
        results['doctor_badges_removed'] = not badges_found

        # Check collapsed state of doctor cards
        doc_collapsed_info = page.evaluate('''() => {
            const cards = document.querySelectorAll('#doctors .group.relative');
            return Array.from(cards).map(card => {
                const name = card.querySelector('h3')?.textContent?.trim();
                const role = card.querySelector('p.text-brand-300')?.textContent?.trim();
                const overview = card.querySelector('p.text-xs')?.textContent?.trim();
                const priceContainer = card.querySelector('div.overflow-hidden.border-t');
                const isPriceVisible = priceContainer ? (window.getComputedStyle(priceContainer).opacity !== '0' && priceContainer.clientHeight > 10) : false;
                return { name, role, overview, isPriceVisible };
            });
        }''')
        print(f"Collapsed state info: {json.dumps(doc_collapsed_info, indent=2)}")
        results['doctor_collapsed_initially'] = all(not doc['isPriceVisible'] for doc in doc_collapsed_info)

        doc_collapsed_shot = os.path.join(OUTPUT_DIR, "iphone16_doctors_collapsed.png")
        page.screenshot(path=doc_collapsed_shot)
        print(f"Captured: {doc_collapsed_shot}")

        # Tap the first doctor card to reveal price & booking button
        print("--> Tapping first doctor card (Dr. Leyla)...")
        first_doctor_card = page.locator("#doctors .group.relative").first
        first_doctor_card.click()
        page.wait_for_timeout(500)

        doc_expanded_info = page.evaluate('''() => {
            const card = document.querySelector('#doctors .group.relative');
            if (!card) return null;
            const priceContainer = card.querySelector('div.overflow-hidden.border-t');
            const price = card.querySelector('span.text-xl, span.text-2xl')?.textContent?.trim();
            const btn = card.querySelector('button');
            const isVisible = priceContainer ? (window.getComputedStyle(priceContainer).opacity !== '0' && priceContainer.clientHeight > 10) : false;
            return {
                isPriceVisible: isVisible,
                price: price,
                btnText: btn ? btn.textContent.trim() : null
            };
        }''')
        print(f"Expanded state info: {json.dumps(doc_expanded_info, indent=2)}")
        results['doctor_tap_reveal'] = (doc_expanded_info and doc_expanded_info['isPriceVisible'] and doc_expanded_info['price'] == '$150')

        doc_expanded_shot = os.path.join(OUTPUT_DIR, "iphone16_doctors_expanded.png")
        page.screenshot(path=doc_expanded_shot)
        print(f"Captured: {doc_expanded_shot}")

        # Click the 'Book with Dr. Leyla' button to verify modal opens
        print("--> Clicking 'Book with Dr. Leyla' button...")
        book_leyla_btn = first_doctor_card.locator("button:has-text('Book with Dr. Leyla')")
        book_leyla_btn.click()
        page.wait_for_timeout(600)

        modal_open = page.evaluate("() => document.body.innerText.includes('Select Your Specialist Doctor') || document.body.innerText.includes('Choose Treatment') || document.body.innerText.includes('Step 1 of 4') || !!document.querySelector('.step-view-enter')")
        print(f"Booking modal opened successfully: {modal_open}")
        results['booking_modal_opens'] = modal_open

        # Close modal
        close_btn = page.locator("button[aria-label='Close'], button:has-text('✕'), button:has-text('Close')").first
        if close_btn.is_visible():
            close_btn.click()
            page.wait_for_timeout(400)
        else:
            page.keyboard.press("Escape")
            page.wait_for_timeout(400)

        # -------------------------------------------------------------
        # 4. PRICING CARDS: ACTIVE ENLARGEMENT & CORNER INTEGRITY
        # -------------------------------------------------------------
        print("\n=== 4. Pricing Cards: Tap Enlargement & Corner Integrity ===")
        page.locator("#pricing").scroll_into_view_if_needed()
        page.wait_for_timeout(600)

        pricing_cards = page.locator("#pricing .group.relative")
        print(f"Found {pricing_cards.count()} pricing cards.")

        first_pricing_card = pricing_cards.first
        initial_scale = page.evaluate("() => { const card = document.querySelector('#pricing .group.relative'); return window.getComputedStyle(card).transform; }")

        # Tap pricing card
        print("--> Tapping first pricing card...")
        first_pricing_card.click()
        page.wait_for_timeout(400)

        tapped_scale = page.evaluate("() => { const card = document.querySelector('#pricing .group.relative'); return window.getComputedStyle(card).transform; }")
        is_selected = page.evaluate("() => { const card = document.querySelector('#pricing .group.relative'); return card.classList.contains('scale-[1.025]') || card.className.includes('scale-'); }")
        tap_highlight = page.evaluate("() => { const card = document.querySelector('#pricing .group.relative'); return window.getComputedStyle(card).webkitTapHighlightColor; }")

        print(f"Initial transform: {initial_scale}")
        print(f"Tapped transform: {tapped_scale}")
        print(f"Card has scale enlargement class/style: {is_selected}")
        print(f"Webkit tap highlight color: {tap_highlight}")

        results['pricing_enlargement'] = is_selected or tapped_scale != initial_scale
        results['pricing_no_tap_box'] = tap_highlight in ['rgba(0, 0, 0, 0)', 'transparent']

        pricing_shot = os.path.join(OUTPUT_DIR, "iphone16_pricing.png")
        page.screenshot(path=pricing_shot)
        print(f"Captured: {pricing_shot}")

        # -------------------------------------------------------------
        # 5. CONTACT SECTION: MOBILE RESPONSIVENESS & WHATSAPP ICON
        # -------------------------------------------------------------
        print("\n=== 5. Contact Section: Mobile Layout & WhatsApp Icon ===")
        page.locator("#contact").scroll_into_view_if_needed()
        page.wait_for_timeout(600)

        contact_metrics = page.evaluate('''() => {
            const docWidth = document.documentElement.scrollWidth;
            const viewWidth = window.innerWidth;
            const phoneCard = document.querySelector('#contact a[href^="tel:"]')?.closest('.group');
            const waCard = document.querySelector('#contact a[href*="wa.me"]')?.closest('.group');
            const waIcon = document.querySelector('#contact svg path[d*="17.472"]')?.closest('svg');
            
            return {
                docScrollWidth: docWidth,
                viewWidth: viewWidth,
                hasPageOverflow: docWidth > viewWidth,
                phoneCardWidth: phoneCard ? phoneCard.clientWidth : 0,
                phoneCardScrollWidth: phoneCard ? phoneCard.scrollWidth : 0,
                waCardWidth: waCard ? waCard.clientWidth : 0,
                waCardScrollWidth: waCard ? waCard.scrollWidth : 0,
                waIconVisible: waIcon ? (waIcon.clientWidth >= 20 && waIcon.clientHeight >= 20) : false,
                waIconDimensions: waIcon ? `${waIcon.clientWidth}x${waIcon.clientHeight}` : null
            };
        }''')
        print(f"Contact metrics: {json.dumps(contact_metrics, indent=2)}")

        results['contact_zero_overflow'] = not contact_metrics['hasPageOverflow'] and (contact_metrics['waCardScrollWidth'] <= contact_metrics['waCardWidth'])
        results['whatsapp_icon_visible'] = contact_metrics['waIconVisible']

        contact_shot = os.path.join(OUTPUT_DIR, "iphone16_contact.png")
        page.screenshot(path=contact_shot)
        print(f"Captured: {contact_shot}")

        # -------------------------------------------------------------
        # 6. FOOTER SECTION: COLOR & SAFE AREA
        # -------------------------------------------------------------
        print("\n=== 6. Footer Section: Sky Blue Background & Safe Area ===")
        footer_el = page.locator("footer")
        footer_el.scroll_into_view_if_needed()
        page.wait_for_timeout(600)

        footer_metrics = page.evaluate('''() => {
            const footer = document.querySelector('footer');
            const footerBody = footer ? footer.querySelector('div.bg-\\\\[\\\\#38bdf8\\\\]') : null;
            return {
                footerBg: footer ? window.getComputedStyle(footer).backgroundColor : null,
                footerBodyBg: footerBody ? window.getComputedStyle(footerBody).backgroundColor : null,
                footerPaddingBottom: footerBody ? window.getComputedStyle(footerBody.querySelector('div.max-w-7xl')).paddingBottom : null
            };
        }''')
        print(f"Footer metrics: {json.dumps(footer_metrics, indent=2)}")

        results['footer_sky_blue'] = footer_metrics['footerBg'] == 'rgb(56, 189, 248)' or footer_metrics['footerBodyBg'] == 'rgb(56, 189, 248)'

        footer_shot = os.path.join(OUTPUT_DIR, "iphone16_footer.png")
        page.screenshot(path=footer_shot)
        print(f"Captured: {footer_shot}")

        # Global horizontal overflow check
        page.evaluate("() => window.scrollTo(0, 0)")
        total_scroll_width = page.evaluate("() => document.documentElement.scrollWidth")
        print(f"\nFinal Document scrollWidth: {total_scroll_width}px (Viewport: 393px)")
        results['global_zero_overflow'] = total_scroll_width <= 393

        browser.close()

    print("\n" + "="*50)
    print("           QA AUDIT SUMMARY REPORT")
    print("="*50)
    for k, v in results.items():
        status = "PASSED" if v else "FAILED"
        print(f"  [{status}] {k}: {v}")
    print("="*50)

    # Save summary json
    with open(os.path.join(OUTPUT_DIR, "qa_results.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run_qa()

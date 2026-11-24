import sys
import os
import json
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3000/b/zenith-dental"
OUTPUT_DIR = "tests/qa_artifacts"

def run_comprehensive_audit():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    report = {
        "device": "iPhone 16 Viewport (393 x 852)",
        "checks": {},
        "screenshots": []
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 16 exact viewport and pixel ratio
        context = browser.new_context(
            viewport={"width": 393, "height": 852},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        print(f"--> Navigating to {BASE_URL}")
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(1000)

        # -------------------------------------------------------------
        # CHECK 1: Hero Section & Fullscreen Viewport (No Next Section Peeking)
        # -------------------------------------------------------------
        print("\n=== CHECK 1: Hero Viewport & Safe Area ===")
        hero_info = page.evaluate('''() => {
            const hero = document.querySelector('section');
            const doctors = document.querySelector('#doctors');
            const heroRect = hero ? hero.getBoundingClientRect() : null;
            const doctorsRect = doctors ? doctors.getBoundingClientRect() : null;
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
            
            return {
                scrollY: window.scrollY,
                viewportHeight: window.innerHeight,
                heroHeight: heroRect ? Math.round(heroRect.height) : null,
                heroTop: heroRect ? Math.round(heroRect.top) : null,
                doctorsTop: doctorsRect ? Math.round(doctorsRect.top) : null,
                themeColor: metaTheme ? metaTheme.getAttribute('content') : null,
                htmlBackgroundColor: htmlBg,
                nextSectionPeeking: doctorsRect ? doctorsRect.top < window.innerHeight : true
            };
        }''')
        print(f"  Hero Height: {hero_info['heroHeight']}px (Viewport: {hero_info['viewportHeight']}px)")
        print(f"  Doctors Section Top: {hero_info['doctorsTop']}px (Next Section Peeking: {hero_info['nextSectionPeeking']})")
        print(f"  Theme Color: {hero_info['themeColor']}, HTML Bg: {hero_info['htmlBackgroundColor']}")
        report["checks"]["hero_viewport"] = hero_info

        hero_shot = os.path.join(OUTPUT_DIR, "iphone16_01_hero_fullscreen.png")
        page.screenshot(path=hero_shot)
        report["screenshots"].append(hero_shot)

        # -------------------------------------------------------------
        # CHECK 2: Hero Calligraphy "zenith" (No White Box)
        # -------------------------------------------------------------
        print("\n=== CHECK 2: Hero Calligraphy Signature ===")
        zenith_svg_info = page.evaluate('''() => {
            const svg = document.querySelector('svg[viewBox*="-1.4"]');
            if (!svg) return null;
            const style = window.getComputedStyle(svg);
            const parent = svg.parentElement;
            const parentStyle = parent ? window.getComputedStyle(parent) : null;
            return {
                filter: style.filter,
                outline: style.outline,
                tapHighlight: style.webkitTapHighlightColor,
                parentBackground: parentStyle ? parentStyle.backgroundColor : null,
                className: svg.getAttribute('class')
            };
        }''')
        print(f"  Zenith SVG filter: '{zenith_svg_info.get('filter') if zenith_svg_info else 'none'}'")
        print(f"  Tap highlight: '{zenith_svg_info.get('tapHighlight') if zenith_svg_info else 'none'}'")
        report["checks"]["hero_calligraphy"] = zenith_svg_info

        # -------------------------------------------------------------
        # CHECK 3: Doctor Cards - Badges Removed, Portrait Clear, Tap-to-Reveal
        # -------------------------------------------------------------
        print("\n=== CHECK 3: Doctor Cards Section ===")
        page.evaluate("() => document.querySelector('#doctors').scrollIntoView()")
        page.wait_for_timeout(600)

        # A: Check initial collapsed state (badges gone, price hidden)
        collapsed_info = page.evaluate('''() => {
            const cards = document.querySelectorAll('#doctors .group.relative');
            const allSpans = Array.from(document.querySelectorAll('#doctors span'));
            const badges = allSpans.filter(s => s.textContent.includes('12 Yrs Exp') || s.textContent.includes('Harley Street Suite'));
            const results = [];
            
            cards.forEach((card, idx) => {
                const name = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : null;
                const role = card.querySelector('p.text-brand-300') ? card.querySelector('p.text-brand-300').textContent.trim() : null;
                const btn = card.querySelector('button');
                const priceContainer = card.querySelector('.border-t');
                const priceStyle = priceContainer ? window.getComputedStyle(priceContainer) : null;
                
                results.push({
                    index: idx,
                    name: name,
                    role: role,
                    isButtonVisible: btn ? (btn.offsetWidth > 0 && btn.offsetHeight > 0) : false,
                    priceOpacity: priceStyle ? priceStyle.opacity : null,
                    priceMaxHeight: priceStyle ? priceStyle.maxHeight : null
                });
            });
            
            return {
                badgeCount: badges.length,
                cards: results
            };
        }''')
        print(f"  Badge count (should be 0): {collapsed_info['badgeCount']}")
        for c in collapsed_info['cards']:
            print(f"  Card {c['index'] + 1} ({c['name']}): collapsed buttonVisible={c['isButtonVisible']}, opacity={c['priceOpacity']}")
        report["checks"]["doctors_collapsed"] = collapsed_info

        doc_collapsed_shot = os.path.join(OUTPUT_DIR, "iphone16_02_doctors_collapsed.png")
        page.screenshot(path=doc_collapsed_shot)
        report["screenshots"].append(doc_collapsed_shot)

        # B: Tap Dr. Leyla Card to Expand
        print("\n--> Tapping Dr. Leyla card on mobile...")
        page.locator("#doctors .group.relative").first.click()
        page.wait_for_timeout(400)

        expanded_info = page.evaluate('''() => {
            const card = document.querySelectorAll('#doctors .group.relative')[0];
            const btn = card ? card.querySelector('button') : null;
            const priceContainer = card ? card.querySelector('.border-t') : null;
            const priceStyle = priceContainer ? window.getComputedStyle(priceContainer) : null;
            const feeEl = card ? card.querySelector('span.text-xl, span.text-2xl') : null;
            
            return {
                buttonVisible: btn ? (btn.offsetWidth > 0 && btn.offsetHeight > 0) : false,
                buttonText: btn ? btn.textContent.trim() : null,
                feeText: feeEl ? feeEl.textContent.trim() : null,
                priceOpacity: priceStyle ? priceStyle.opacity : null,
                priceMaxHeight: priceStyle ? priceStyle.maxHeight : null
            };
        }''')
        print(f"  Expanded state: fee='{expanded_info['feeText']}', button='{expanded_info['buttonText']}', visible={expanded_info['buttonVisible']}")
        report["checks"]["doctors_expanded"] = expanded_info

        doc_expanded_shot = os.path.join(OUTPUT_DIR, "iphone16_03_doctors_expanded.png")
        page.screenshot(path=doc_expanded_shot)
        report["screenshots"].append(doc_expanded_shot)

        # -------------------------------------------------------------
        # CHECK 4: Pricing Cards - Tactile Scale & Corner Clipping
        # -------------------------------------------------------------
        print("\n=== CHECK 4: Pricing Cards Section ===")
        page.evaluate("() => document.querySelector('#pricing').scrollIntoView()")
        page.wait_for_timeout(600)

        pricing_info = page.evaluate('''() => {
            const section = document.querySelector('#pricing');
            const cards = section ? section.querySelectorAll('.grid > div') : [];
            const card1 = cards[0];
            const card1Inner = card1 ? card1.querySelector('.group.relative') : null;
            const card1Style = card1Inner ? window.getComputedStyle(card1Inner) : null;
            
            return {
                cardCount: cards.length,
                overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                tapHighlight: card1Style ? card1Style.webkitTapHighlightColor : null
            };
        }''')
        print(f"  Pricing cards count: {pricing_info['cardCount']}, tapHighlight: {pricing_info['tapHighlight']}")
        report["checks"]["pricing_initial"] = pricing_info

        pricing_shot = os.path.join(OUTPUT_DIR, "iphone16_04_pricing_section.png")
        page.screenshot(path=pricing_shot)
        report["screenshots"].append(pricing_shot)

        # Click first pricing card to test enlargement
        print("\n--> Tapping first pricing card for enlargement animation...")
        page.locator("#pricing .group.relative").first.click()
        page.wait_for_timeout(350)

        tapped_card_info = page.evaluate('''() => {
            const card = document.querySelector('#pricing .group.relative');
            const style = card ? window.getComputedStyle(card) : null;
            return {
                transform: style ? style.transform : null,
                boxShadow: style ? style.boxShadow : null,
                classes: card ? card.getAttribute('class') : null
            };
        }''')
        print(f"  Tapped card transform: {tapped_card_info['transform']}")
        report["checks"]["pricing_tapped"] = tapped_card_info

        pricing_tapped_shot = os.path.join(OUTPUT_DIR, "iphone16_05_pricing_tapped.png")
        page.screenshot(path=pricing_tapped_shot)
        report["screenshots"].append(pricing_tapped_shot)

        # -------------------------------------------------------------
        # CHECK 5: Contact Section (Responsive Layout & WhatsApp Icon)
        # -------------------------------------------------------------
        print("\n=== CHECK 5: Contact Section ===")
        page.evaluate("() => document.querySelector('section:has(#contact), #contact, section:has(svg.text-emerald-600)').scrollIntoView()")
        page.wait_for_timeout(600)

        contact_info = page.evaluate('''() => {
            const phoneCard = document.querySelector('a[href^="tel:"]')?.closest('.group.relative');
            const waCard = document.querySelector('a[href*="wa.me"]')?.closest('.group.relative');
            const waSvg = document.querySelector('svg.text-emerald-600');
            
            const pRect = phoneCard ? phoneCard.getBoundingClientRect() : null;
            const wRect = waCard ? waCard.getBoundingClientRect() : null;
            const waSvgRect = waSvg ? waSvg.getBoundingClientRect() : null;
            
            return {
                phoneCardWidth: pRect ? Math.round(pRect.width) : null,
                phoneCardScrollWidth: phoneCard ? phoneCard.scrollWidth : null,
                phoneOverflow: phoneCard ? (phoneCard.scrollWidth > phoneCard.clientWidth) : null,
                waCardWidth: wRect ? Math.round(wRect.width) : null,
                waCardScrollWidth: waCard ? waCard.scrollWidth : null,
                waOverflow: waCard ? (waCard.scrollWidth > waCard.clientWidth) : null,
                waIconWidth: waSvgRect ? Math.round(waSvgRect.width) : null,
                waIconHeight: waSvgRect ? Math.round(waSvgRect.height) : null
            };
        }''')
        print(f"  Phone card overflow: {contact_info['phoneOverflow']} (width={contact_info['phoneCardWidth']}px, scroll={contact_info['phoneCardScrollWidth']}px)")
        print(f"  WhatsApp card overflow: {contact_info['waOverflow']} (width={contact_info['waCardWidth']}px, scroll={contact_info['waCardScrollWidth']}px)")
        print(f"  WhatsApp icon size: {contact_info['waIconWidth']}px x {contact_info['waIconHeight']}px")
        report["checks"]["contact_section"] = contact_info

        contact_shot = os.path.join(OUTPUT_DIR, "iphone16_06_contact_section.png")
        page.screenshot(path=contact_shot)
        report["screenshots"].append(contact_shot)

        # -------------------------------------------------------------
        # CHECK 6: Footer Section & Safe Area Bottom
        # -------------------------------------------------------------
        print("\n=== CHECK 6: Clinic Footer & Bottom Safe Area ===")
        page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(600)

        footer_info = page.evaluate('''() => {
            const footer = document.querySelector('footer');
            const fStyle = footer ? window.getComputedStyle(footer) : null;
            const bodyStyle = window.getComputedStyle(document.body);
            return {
                footerBg: fStyle ? fStyle.backgroundColor : null,
                bodyBg: bodyStyle.backgroundColor,
                footerHeight: footer ? Math.round(footer.offsetHeight) : null
            };
        }''')
        print(f"  Footer Bg: {footer_info['footerBg']}, Body Bg: {footer_info['bodyBg']}")
        report["checks"]["footer"] = footer_info

        footer_shot = os.path.join(OUTPUT_DIR, "iphone16_07_footer_bottom.png")
        page.screenshot(path=footer_shot)
        report["screenshots"].append(footer_shot)

        # Save JSON Report
        report_path = os.path.join(OUTPUT_DIR, "iphone16_audit_report.json")
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"\n--> Audit report saved to {report_path}")

        browser.close()

if __name__ == "__main__":
    run_comprehensive_audit()

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={"width": 393, "height": 852})
    page.goto("https://zenith-dental-studio-sage.vercel.app/b/zenith-dental", wait_until="networkidle")
    page.wait_for_timeout(1000)
    
    hero = page.locator("section").first.bounding_box()
    doc = page.locator("#doctors").bounding_box()
    badges = page.locator('#doctors span:has-text("12 Yrs Exp")').count()
    
    print(f"LIVE HERO: height={hero['height']}px")
    print(f"LIVE DOCTORS TOP: y={doc['y']}px")
    print(f"LIVE BADGES: count={badges}")
    b.close()

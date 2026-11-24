"""
=============================================================================
ZENITH DENTAL STUDIO — END-TO-END AUTOMATED FUNNEL TEST SUITE
Full-stack multi-page journey verification with Playwright (Desktop & Mobile)
=============================================================================
"""

import os
import sys
import time
import datetime
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000").rstrip("/")


def log(msg):
    print(msg, flush=True)


def get_weekday_within_7_days():
    """Return a guaranteed Mon-Fri YYYY-MM-DD date strictly within [today+2 .. today+6]."""
    today = datetime.date.today()
    for delta in (2, 3, 4, 5, 6, 1):
        candidate = today + datetime.timedelta(days=delta)
        if candidate.weekday() < 5:  # Monday (0) .. Friday (4)
            return candidate.strftime("%Y-%m-%d")
    return (today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")


def run_e2e_tests():
    start_time = time.time()
    page_errors = []
    log("=" * 68)
    log("🚀 STARTING ZENITH DENTAL STUDIO E2E FUNNEL VERIFICATION")
    log(f"   Target: {BASE_URL}")
    log("=" * 68)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 950})
        page = context.new_page()
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        # -------------------------------------------------------------------
        # TEST 1: Root Landing Page (/) & Sticky Header Scroll Reveal
        # -------------------------------------------------------------------
        log("\n[TEST 1/6] 🌐 Root Landing Page (/) Verification...")
        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        title = page.title()
        assert "Zenith Dental Studio" in title, f"Unexpected root title: {title}"
        assert page.locator("text=World-Class").first.is_visible(), "Hero headline missing on /"
        assert page.locator("button:has-text('Book Your Visit Online')").first.is_visible(), "Hero primary CTA missing"

        hero_height = page.evaluate("() => document.querySelector('main > section:first-child')?.getBoundingClientRect().height || 0")
        assert abs(hero_height - 950) <= 2, f"Expected full-viewport 100dvh hero (~950px), got {hero_height}px"

        # Scroll down to trigger sticky header reveal
        page.evaluate("window.scrollTo(0, 160)")
        page.wait_for_timeout(400)
        assert page.locator("header:has-text('Zenith Dental')").first.is_visible(), "Sticky header did not reveal on scroll"
        assert page.locator("header a:has-text('Specialists')").first.is_visible(), "Specialists nav link missing"
        assert page.locator("header a:has-text('Pricing & Treatments')").first.is_visible(), "Pricing nav link missing"
        log("  ✅ Root (/), full-viewport Hero & sticky scroll header verified.")

        # -------------------------------------------------------------------
        # TEST 2: Clinic Page (/b/zenith-dental) & 5-Step Booking Funnel
        # -------------------------------------------------------------------
        log("\n[TEST 2/6] 🏥 Clinic Portal (/b/zenith-dental) & 5-Step Booking Modal...")
        page.goto(f"{BASE_URL}/b/zenith-dental", wait_until="networkidle")
        assert "Zenith Dental Studio" in page.title(), f"Unexpected clinic title: {page.title()}"

        # Scroll #doctors and #pricing into view so BlurReveal sections become visible
        doctors_section = page.locator("#doctors")
        doctors_section.scroll_into_view_if_needed()
        doctors_section.locator("h3:has-text('Dr. Leyla Mammadova')").wait_for(state="visible", timeout=5000)
        assert doctors_section.locator("h3:has-text('Dr. Rashad Aliyev')").is_visible(), "Dr. Rashad card missing"
        assert "Specialists" in doctors_section.inner_text(), "Specialists heading missing in #doctors"

        pricing_section = page.locator("#pricing")
        pricing_section.scroll_into_view_if_needed()
        pricing_section.locator("h3:has-text('Comprehensive 3D Exam')").wait_for(state="visible", timeout=5000)
        assert pricing_section.locator("h3:has-text('Laser Teeth Whitening')").is_visible(), "Whitening card missing"
        assert "Treatments" in pricing_section.inner_text(), "Treatments heading missing in #pricing"

        footer_bg = page.evaluate("() => window.getComputedStyle(document.querySelector('footer')).backgroundColor")
        assert footer_bg == "rgb(56, 189, 248)", f"Expected sky blue footer rgb(56, 189, 248), got {footer_bg}"

        # Open Booking Modal from Hero CTA
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(200)
        page.locator("button:has-text('Book Your Visit Online')").first.click()

        modal = page.locator(".fixed.inset-0").first
        modal.wait_for(state="visible", timeout=5000)
        assert modal.locator("text=Step 1: Choose Treatment & Specialist").is_visible(), "Modal Step 1 header missing"

        # Step 1: Select specialist & treatment, then await initial Step 2 /api/v1/availability response
        modal.locator("text=Dr. Leyla Mammadova").first.click()
        modal.locator("text=Comprehensive Dental Exam & 3D Scan").first.click()
        continue_slots_btn = modal.locator("button:has-text('Continue to Available Slots')")
        assert continue_slots_btn.is_enabled(), "Continue to Available Slots button remained disabled"
        with page.expect_response(
            lambda r: "/api/v1/availability" in r.url and r.status == 200,
            timeout=10000,
        ) as initial_avail_info:
            continue_slots_btn.click()

        # Step 2: Select weekday within 7-day window & ensure live /api/v1/availability slots loaded
        modal.locator("text=Step 2: Select Date & Available Time Slot").wait_for(state="visible", timeout=5000)
        modal.locator("text=Checking Doctor Schedule...").wait_for(state="hidden", timeout=8000)
        future_date = get_weekday_within_7_days()
        date_input = modal.locator("input[type='date']")
        if date_input.input_value() != future_date:
            with page.expect_response(
                lambda r: "/api/v1/availability" in r.url and r.status == 200,
                timeout=10000,
            ) as avail_resp_info:
                date_input.fill(future_date)
            avail_data = avail_resp_info.value.json()
            modal.locator("text=Checking Doctor Schedule...").wait_for(state="hidden", timeout=8000)
        else:
            avail_data = initial_avail_info.value.json()

        assert len(avail_data.get("slots", [])) > 0, (
            f"Expected live slots from /api/v1/availability for {future_date}, got {avail_data}"
        )
        enabled_slots = modal.locator("button:not([disabled]):has-text(':')")
        slot_count = enabled_slots.count()
        assert slot_count > 0, f"No available time slots returned for {future_date}"

        slot_idx = max(0, slot_count - 1)
        chosen_slot = enabled_slots.nth(slot_idx).inner_text().strip()
        enabled_slots.nth(slot_idx).click()
        modal.locator("button:has-text('Continue to Patient Details')").click()

        # Step 3: Patient Details (sanitizePatientName strips digits, so keep name alphabetic + unique email)
        modal.locator("text=Step 3: Patient Information").wait_for(state="visible", timeout=5000)
        unique_suffix = str(int(time.time() * 1000))[-6:]
        alpha_tag = "".join(chr(ord("A") + int(ch)) for ch in unique_suffix)
        patient_name = f"Test Patient {alpha_tag}"
        patient_email = f"e2e.{unique_suffix}@zenithdental.co.uk"
        modal.locator("input[placeholder='e.g. John Smith']").fill(patient_name)
        modal.locator("input[type='email']").fill(patient_email)
        modal.locator("input[type='tel']").fill("+44 7911 123456")
        modal.locator("input[placeholder*='sensitivity']").fill("Automated E2E consultation verification.")
        gdpr_box = modal.locator("input[type='checkbox']").first
        if not gdpr_box.is_checked():
            gdpr_box.check()
        modal.locator("button:has-text('Continue to Payment & Deposit')").click()

        # Step 4: Express Payment & real DB creation via POST /api/v1/bookings
        modal.locator("text=Step 4: Secure Deposit Payment").wait_for(state="visible", timeout=5000)
        with page.expect_response(
            lambda r: "/api/v1/bookings" in r.url and r.request.method == "POST",
            timeout=10000,
        ) as booking_resp_info:
            modal.locator("button:has-text('Google Pay (TEST)')").click()

        booking_resp = booking_resp_info.value

        # Handle contention cleanly if another test booked that exact slot
        if booking_resp.status == 409:
            log(f"  ⚠️ Slot {chosen_slot} returned 409 Conflict; retrying with alternate slot...")
            modal.locator("text=This slot was just taken").wait_for(state="visible", timeout=3000)
            alt_slots = modal.locator("button:not([disabled]):has-text(':')")
            assert alt_slots.count() > 1, "No alternative open slot available after 409"
            alt_slots.first.click()
            modal.locator("button:has-text('Continue to Patient Details')").click()
            modal.locator("button:has-text('Continue to Payment & Deposit')").click()
            with page.expect_response(
                lambda r: "/api/v1/bookings" in r.url and r.request.method == "POST",
                timeout=10000,
            ) as retry_resp_info:
                modal.locator("button:has-text('Google Pay (TEST)')").click()
            booking_resp = retry_resp_info.value

        assert booking_resp.status == 201, f"Expected HTTP 201 from POST /api/v1/bookings, got {booking_resp.status}"
        resp_json = booking_resp.json()
        assert resp_json.get("success") is True, f"Booking response success != True: {resp_json}"
        booking_id = resp_json.get("bookingId", "")
        assert booking_id.startswith("ZD-"), f"Invalid bookingId returned: {booking_id}"
        assert resp_json.get("details", {}).get("depositAmount") == 25, (
            f"Expected server-enforced deposit $25 for srv-consult, got {resp_json.get('details')}"
        )
        server_status = resp_json.get("booking", {}).get("status")
        assert server_status in ("pending", "confirmed"), f"Unexpected initial booking status: {server_status}"

        # Step 5: Verify Confirmation Receipt
        modal.locator("text=Reservation Confirmed").first.wait_for(state="visible", timeout=8000)
        assert modal.locator("text=Appointment Booked Successfully!").is_visible(), "Confirmation headline missing"
        assert modal.locator(f"text={booking_id}").first.is_visible(), "Booking ID missing on receipt"
        assert modal.locator(f"text={patient_name}").first.is_visible(), "Patient name missing on receipt"
        modal.locator("button:has-text('Close & Done')").click()
        modal.wait_for(state="hidden", timeout=5000)
        log(f"  ✅ 5-Step Booking flow & DB creation verified (ID: {booking_id}, status: {server_status}).")

        # -------------------------------------------------------------------
        # TEST 3: Protected Route Redirects & Staff Login (/login -> /dashboard)
        # -------------------------------------------------------------------
        log("\n[TEST 3/6] 🔐 Auth Guard & Specialist Login (/login)...")
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
        assert "/login" in page.url, f"Unauthenticated /dashboard did not redirect to /login (url: {page.url})"

        page.goto(f"{BASE_URL}/explorer", wait_until="networkidle")
        assert "/login" in page.url, f"Unauthenticated /explorer did not redirect to /login (url: {page.url})"

        assert page.locator("text=Authorized Staff Sign-In").is_visible(), "Login page badge missing"
        assert page.locator("h2:has-text('Surgery Dashboard')").is_visible(), "Login heading missing"

        page.locator("#clinical-email").fill("admin@zenithdental.com")
        page.locator("#clinical-password").fill("Zenith2026!")
        page.locator("button:has-text('Enter Surgery Dashboard')").click()
        page.wait_for_url("**/dashboard**", timeout=10000)
        log("  ✅ Unauthenticated redirects & specialist login -> /dashboard verified.")

        # -------------------------------------------------------------------
        # TEST 4: Admin Surgery Dashboard (/dashboard) Schedule, Bookings & Dossier
        # -------------------------------------------------------------------
        log("\n[TEST 4/6] 🩺 Surgery Dashboard (/dashboard) Render & DB Sync...")
        page.locator("text=Schedule (Time-Grid)").wait_for(state="visible", timeout=8000)
        assert page.locator("text=Surgery Time-Grid Schedule").is_visible(), "Daily schedule grid missing"
        assert page.locator("text=Dr. Leyla Mammadova").first.is_visible(), "Doctor column missing"
        assert page.locator("text=Dr. Rashad Aliyev").first.is_visible(), "Second doctor column missing"

        # Verify persisted booking appears in All Bookings tab (match by unique server booking_id)
        page.locator("button:has-text('All Bookings')").click()
        assert page.locator("text=Registered Patient Bookings").is_visible(), "All Bookings table heading missing"
        created_row = page.locator(f"tr:has-text('{booking_id}')").first
        created_row.wait_for(state="visible", timeout=8000)
        assert created_row.locator(f"text={patient_name}").is_visible(), "Persisted patient name missing in dashboard table"
        assert created_row.locator(f"text={patient_email}").is_visible(), "Persisted patient email missing in dashboard table"

        # Open Clinical Patient Dossier drawer
        created_row.locator("button:has-text('Dossier')").click()
        page.locator("text=Clinical Patient Dossier").wait_for(state="visible", timeout=5000)
        assert page.locator("textarea[placeholder*='clinical notes']").is_visible(), "Internal Clinical Notes input missing"
        page.locator("button:has-text('Close Dossier')").click()
        page.locator("text=Clinical Patient Dossier").wait_for(state="hidden", timeout=5000)

        # Verify 6-Month Recall Queue tab
        page.locator("button:has-text('6-Month Recall Queue')").click()
        assert page.locator("text=Automated 6-Month Oral Health Recall").is_visible(), "Recall queue heading missing"
        assert page.locator("text=Arthur Pendelton").first.is_visible(), "Seeded recall patient missing"
        log("  ✅ Dashboard schedule grid, live DB booking sync, Dossier drawer & Recall tab verified.")

        # -------------------------------------------------------------------
        # TEST 5: Explorer (/explorer) Tabs & iPhone 16 (393x852) Zero Overflow
        # -------------------------------------------------------------------
        log("\n[TEST 5/6] 📱 Clinical Explorer (/explorer) Desktop & iPhone 16 Overflow Check...")
        page.goto(f"{BASE_URL}/explorer", wait_until="networkidle")
        assert page.locator("h1:has-text('Zenith Clinical Studio')").is_visible(), "Explorer heading missing"
        assert page.locator("text=1. Live Database Tables").is_visible(), "Database tab missing"
        page.locator("text=/\\d+ Rows/").first.wait_for(state="visible", timeout=8000)
        assert page.locator("text=Records Shown").is_visible(), "Explorer live DB records toolbar missing"

        # Desktop tab checks
        page.locator("button:has-text('2. Interactive API Playground')").click()
        assert page.locator("button:has-text('Execute Live Request')").is_visible(), "API Playground execute button missing"
        page.locator("button:has-text('3. ERD & Architecture Schema')").click()
        assert page.locator("text=Relational Architecture Diagram").is_visible(), "ERD diagram missing"

        # Switch to iPhone 16 mobile viewport (393 x 852)
        page.set_viewport_size({"width": 393, "height": 852})
        page.goto(f"{BASE_URL}/explorer", wait_until="networkidle")
        page.wait_for_timeout(300)

        tab_labels = [
            "1. Live Database Tables",
            "2. Interactive API Playground",
            "3. ERD & Architecture Schema",
        ]
        for label in tab_labels:
            tab_btn = page.locator(f"button:has-text('{label}')").first
            tab_btn.click()
            page.wait_for_timeout(200)
            metrics = page.evaluate(
                "() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })"
            )
            assert metrics["scrollWidth"] <= 393, (
                f"Mobile horizontal overflow on /explorer ({label}): scrollWidth={metrics['scrollWidth']}px > 393px"
            )
            box = tab_btn.bounding_box()
            assert box is not None and box["x"] >= 0 and (box["x"] + box["width"]) <= 393.5, (
                f"Tab button '{label}' clipped or overflowing mobile viewport: {box}"
            )

        # Also verify /b/zenith-dental mobile hero & zero overflow on 393x852
        page.goto(f"{BASE_URL}/b/zenith-dental", wait_until="networkidle")
        page.wait_for_timeout(300)
        clinic_mobile = page.evaluate(
            """() => ({
                scrollWidth: document.documentElement.scrollWidth,
                heroHeight: document.querySelector('main > section:first-child')?.getBoundingClientRect().height || 0
            })"""
        )
        assert clinic_mobile["scrollWidth"] <= 393, (
            f"Mobile horizontal overflow on /b/zenith-dental: {clinic_mobile['scrollWidth']}px"
        )
        assert abs(clinic_mobile["heroHeight"] - 852) <= 2, (
            f"Expected mobile Hero 852px (100dvh), got {clinic_mobile['heroHeight']}px"
        )
        log("  ✅ /explorer (all 3 tabs) & /b/zenith-dental verified with scrollWidth <= 393px on iPhone 16.")

        # -------------------------------------------------------------------
        # TEST 6: Clean Up Test Booking & Assert Zero Uncaught Page Errors
        # -------------------------------------------------------------------
        log("\n[TEST 6/6] 🧹 Cleaning Up Synthetic E2E Booking & Checking Page Errors...")
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
        del_status = page.evaluate(
            f"""async () => {{
                const res = await fetch('/api/v1/bookings?id={booking_id}&hard=true', {{ method: 'DELETE' }});
                return res.status;
            }}"""
        )
        assert del_status == 200, f"Failed to clean up synthetic booking {booking_id}: HTTP {del_status}"
        assert len(page_errors) == 0, f"Uncaught client page errors encountered: {page_errors}"
        log(f"  ✅ Synthetic booking {booking_id} removed cleanly; 0 uncaught page errors.")

        browser.close()

    elapsed = round(time.time() - start_time, 2)
    log("\n" + "=" * 68)
    log(f"🎉 ALL 6/6 ZENITH DENTAL E2E FUNNEL TESTS PASSED! ({elapsed}s)")
    log("=" * 68)
    return True


if __name__ == "__main__":
    success = run_e2e_tests()
    sys.exit(0 if success else 1)

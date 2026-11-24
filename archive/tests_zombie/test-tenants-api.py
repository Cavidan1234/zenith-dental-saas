import urllib.request
import json
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3000"

def test_tenants_api():
    print("===============================================================")
    print("🏢 TESTING MULTI-TENANT REST API PERSISTENCE (/api/v1/tenants)")
    print("===============================================================")

    # 1. GET /api/v1/tenants
    req = urllib.request.Request(f"{BASE_URL}/api/v1/tenants")
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        print(f"✅ [1/5] GET /api/v1/tenants returned {data['total']} registered dental practices.")
        slugs = [t['slug'] for t in data['tenants']]
        assert 'zenith-dental' in slugs
        print(f"       Registered tenants: {', '.join(slugs)}")

    # 2. GET /api/v1/tenants/zenith-dental
    req = urllib.request.Request(f"{BASE_URL}/api/v1/tenants/zenith-dental")
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        assert data['tenant']['name'] == 'Zenith Dental & Esthetics'
        assert len(data['staff']) >= 2
        assert len(data['services']) >= 3
        print(f"✅ [2/5] GET /api/v1/tenants/zenith-dental verified: {len(data['staff'])} specialists, {len(data['services'])} treatments.")

    # 3. POST /api/v1/tenants (Register new clinic with unique timestamped slug)
    unique_slug = f"kensington-{int(time.time()) % 100000}"
    new_clinic = {
        "name": "Kensington Esthetic Oral Surgery",
        "slug": unique_slug,
        "address": "45 Kensington High Street, London W8 5ED",
        "phone": "+44 20 7946 0555",
        "email": "concierge@kensingtondental.co.uk",
        "brandColor": "#1e293b",
        "theme": "zurich_medical",
        "depositAmount": 100,
        "bufferMinutes": 20,
        "surgeriesCount": 5,
        "leadSurgeon": "Dr. Edward Montgomery",
        "leadSpecialty": "Maxillofacial Reconstruction & CBCT Implants",
    }
    post_data = json.dumps(new_clinic).encode()
    req = urllib.request.Request(
        f"{BASE_URL}/api/v1/tenants",
        data=post_data,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 201
        res = json.loads(resp.read().decode())
        assert res['success'] is True
        assert res['tenant']['slug'] == unique_slug
        print(f"✅ [3/5] POST /api/v1/tenants created clinic: \"{res['tenant']['name']}\" ({unique_slug}) (Deposit: ${res['tenant']['depositAmount']})")

    # 4. GET /api/v1/tenants/[unique_slug]
    req = urllib.request.Request(f"{BASE_URL}/api/v1/tenants/{unique_slug}")
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        assert data['tenant']['slug'] == unique_slug
        assert data['tenant']['surgeriesCount'] == 5
        assert data['operationalCapacity']['bufferMinutes'] == 20
        print(f"✅ [4/5] GET /api/v1/tenants/{unique_slug} verified: 5 surgeries, 20m sterilization buffer.")

    # 5. POST duplicate slug -> Expect 409 Conflict
    req = urllib.request.Request(
        f"{BASE_URL}/api/v1/tenants",
        data=post_data,
        headers={"Content-Type": "application/json"}
    )
    try:
        urllib.request.urlopen(req)
        assert False, "Expected 409 Conflict for duplicate slug"
    except urllib.error.HTTPError as e:
        assert e.code == 409
        err_data = json.loads(e.read().decode())
        assert err_data['code'] == 'TENANT_SLUG_EXISTS'
        print("✅ [5/5] Idempotency & duplicate slug conflict (409) verified.")

    print("\n🎉 ALL MULTI-TENANT REST API PERSISTENCE TESTS PASSED FLAWLESSLY!\n")

if __name__ == "__main__":
    test_tenants_api()

# Clean & Light Code Archive Log (2026-11-13)

Items removed or relocated during the Clean & Light Code pass for `booking-saas`. Nothing was permanently discarded without a record here.

## 1. Archived Files
- `tests/qa_artifacts/` -> moved to `archive/qa_artifacts/` (temporary Playwright iPhone 16 audit screenshots and JSON report).

## 2. Removed Unused Dependencies (`package.json`)
Verified zero imports across `src/`:
- `metal-fx`: `^2.0.11`
- `date-fns`: `^4.4.0`
- `jsonwebtoken`: `^9.0.3`
- `@types/jsonwebtoken`: `^9.0.10`

## 3. Removed Dead State in `src/components/booking/BookingModal.tsx`
Removed unread state variables whose values were never read in JSX or logic:
```ts
const [, setPaymentProcessing] = useState(false);
const [, setPaymentSuccessRef] = useState('');
```

## 4. Extracted Static Data
Moved `ServiceItem`, `DoctorItem`, `CLINIC_SERVICES`, `CLINIC_DOCTORS`, `INITIAL_BASE_SLOTS`, `SERVICE_ID_ALIASES`, and `formatLocalYMD` from `BookingModal.tsx` into `src/components/booking/bookingData.ts` (re-exported from `BookingModal.tsx` for backward compatibility).

## 5. Optimized Dental Images (Originals Backed Up)
Original uncompressed JPEGs backed up to `archive/public_images_backup/` and replaced with progressive optimized JPEGs (`quality=82`, exact same pixel dimensions):
- `clinic-hero.jpg` (`1376x768`): `897.6 KB` -> `214.4 KB`
- `doctor-leyla.jpg` (`896x1200`): `696.4 KB` -> `118.1 KB`
- `doctor-rashad.jpg` (`896x1200`): `653.1 KB` -> `114.4 KB`

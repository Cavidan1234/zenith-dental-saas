path = r'c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\src\app\(public)\manage\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add import for DigitalSurgeryPassCard
import_target = "import { DigitalWalletPassModal } from '@/components/patient/DigitalWalletPassModal';"
import_replacement = """import { DigitalSurgeryPassCard } from '@/components/patient/DigitalSurgeryPassCard';
import { DigitalWalletPassModal } from '@/components/patient/DigitalWalletPassModal';"""

if import_target in text:
    text = text.replace(import_target, import_replacement, 1)

# 2. Replace the Pass Header & Main Grid with <DigitalSurgeryPassCard ... />
start_marker = '{/* Surgery Digital Pass (Boarding Pass Card) */}\n            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl">'
end_marker = '{/* Pre-Op Medical Triage & Clinical Clearance Section */}'

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find boundary markers!", start_idx, end_idx)
    exit(1)

new_card_jsx = """{/* Surgery Digital Pass (Boarding Pass Card) */}
            <DigitalSurgeryPassCard
              booking={activeBooking}
              onOpenWallet={() => {
                playHapticTick();
                setIsWalletOpen(true);
              }}
            />

            {/* Clinical Clearance, Insurance & Surgery Actions */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl divide-y divide-white/10">
              """

text = text[:start_idx] + new_card_jsx + text[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("manage/page.tsx refactored with DigitalSurgeryPassCard successfully!")

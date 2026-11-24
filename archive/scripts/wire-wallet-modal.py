filepath = 'src/app/(public)/manage/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Imports
target_import = """  Sliders,
} from 'lucide-react';
import { playSuccessPing, playHapticTick } from '@/lib/soundscapes';
import {
  PatientMedicalIntakeModal,
  MedicalIntakeData,
} from '@/components/patient/PatientMedicalIntakeModal';"""

replace_import = """  Sliders,
  Smartphone,
} from 'lucide-react';
import { playSuccessPing, playHapticTick } from '@/lib/soundscapes';
import {
  PatientMedicalIntakeModal,
  MedicalIntakeData,
} from '@/components/patient/PatientMedicalIntakeModal';
import { DigitalWalletPassModal } from '@/components/patient/DigitalWalletPassModal';"""

if target_import in c:
    c = c.replace(target_import, replace_import, 1)
    print("1. Replaced imports")
else:
    c = c.replace(target_import.replace('\n', '\r\n'), replace_import.replace('\n', '\r\n'), 1)
    print("1. Replaced imports (CRLF)")

# 2. State
target_state = "  const [isIntakeOpen, setIsIntakeOpen] = useState<boolean>(false);"
replace_state = """  const [isIntakeOpen, setIsIntakeOpen] = useState<boolean>(false);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);"""

if target_state in c:
    c = c.replace(target_state, replace_state, 1)
    print("2. Replaced state")
else:
    c = c.replace(target_state.replace('\n', '\r\n'), replace_state.replace('\n', '\r\n'), 1)
    print("2. Replaced state (CRLF)")

# 3. Add to Wallet Button under QR code
target_btn = """                  <div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                      Express Reception Pass
                    </span>
                    <span className="text-[11px] font-bold text-white">
                      Scan at 14 Harley St. Concierge
                    </span>
                  </div>"""

replace_btn = """                  <div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                      Express Reception Pass
                    </span>
                    <span className="text-[11px] font-bold text-white">
                      Scan at 14 Harley St. Concierge
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playHapticTick();
                      setIsWalletOpen(true);
                    }}
                    className="mt-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-brand-400" />
                    <span>Add to Wallet ( / GPay)</span>
                  </button>"""

if target_btn in c:
    c = c.replace(target_btn, replace_btn, 1)
    print("3. Inserted Add to Wallet button")
else:
    c = c.replace(target_btn.replace('\n', '\r\n'), replace_btn.replace('\n', '\r\n'), 1)
    print("3. Inserted Add to Wallet button (CRLF)")

# 4. Render DigitalWalletPassModal before closing activeBooking block
target_modal = """            {/* Medical Intake & Pre-Op Triage Modal */}
            <PatientMedicalIntakeModal
              isOpen={isIntakeOpen}
              onClose={() => setIsIntakeOpen(false)}
              bookingRef={activeBooking.id}
              patientName={activeBooking.patientName}
              onSaveIntake={handleSaveIntake}
              initialData={activeBooking.medicalIntake}
            />"""

replace_modal = """            {/* Medical Intake & Pre-Op Triage Modal */}
            <PatientMedicalIntakeModal
              isOpen={isIntakeOpen}
              onClose={() => setIsIntakeOpen(false)}
              bookingRef={activeBooking.id}
              patientName={activeBooking.patientName}
              onSaveIntake={handleSaveIntake}
              initialData={activeBooking.medicalIntake}
            />

            {/* Luxury Digital Wallet Pass Modal (Apple / Google Wallet) */}
            <DigitalWalletPassModal
              isOpen={isWalletOpen}
              onClose={() => setIsWalletOpen(false)}
              patientName={activeBooking.patientName}
              bookingRef={activeBooking.id}
              service={activeBooking.service}
              doctor={activeBooking.doctor}
              date={activeBooking.date}
              time={activeBooking.time}
            />"""

if target_modal in c:
    c = c.replace(target_modal, replace_modal, 1)
    print("4. Inserted DigitalWalletPassModal")
else:
    c = c.replace(target_modal.replace('\n', '\r\n'), replace_modal.replace('\n', '\r\n'), 1)
    print("4. Inserted DigitalWalletPassModal (CRLF)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Finished updating manage/page.tsx!")

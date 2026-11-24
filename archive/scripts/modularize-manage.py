filepath = 'src/app/(public)/manage/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Imports
target_import = "import { DigitalWalletPassModal } from '@/components/patient/DigitalWalletPassModal';"
replace_import = "import { DigitalWalletPassModal } from '@/components/patient/DigitalWalletPassModal';\nimport { PatientRescheduleModal } from '@/components/patient/PatientRescheduleModal';\nimport { PatientCancelModal } from '@/components/patient/PatientCancelModal';"

if target_import in c:
    c = c.replace(target_import, replace_import, 1)
    print("1. Added imports")
else:
    c = c.replace(target_import.replace('\n', '\r\n'), replace_import.replace('\n', '\r\n'), 1)
    print("1. Added imports (CRLF)")

# 2. Replace Reschedule block
target_reschedule = """            {/* Reschedule Modal / Slide-out */}
            {isRescheduling && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-brand-500/40 shadow-2xl space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className="w-5 h-5 text-brand-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">Select a New Appointment Slot</h3>
                      <p className="text-xs text-slate-400">
                        Zero reschedule fee. Same-day room sterilization buffer guaranteed.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRescheduling(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {RESCHEDULE_OPTIONS.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedReschedule(idx)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedReschedule === idx
                          ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30 scale-[1.02]'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.day}</div>
                      <div className="text-lg font-black font-mono mt-1">{opt.time}</div>
                      <span className="text-[10px] text-slate-400 mt-1 block">With {activeBooking.doctor}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRescheduling(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Keep Current Slot
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReschedule}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    Confirm Reschedule to {RESCHEDULE_OPTIONS[selectedReschedule].day}
                  </button>
                </div>
              </div>
            )}"""

replace_reschedule = """            {/* Reschedule Modal / Slide-out */}
            <PatientRescheduleModal
              isOpen={isRescheduling}
              onClose={() => setIsRescheduling(false)}
              options={RESCHEDULE_OPTIONS}
              selectedIndex={selectedReschedule}
              onSelectIndex={setSelectedReschedule}
              doctorName={activeBooking.doctor}
              onConfirm={handleConfirmReschedule}
            />"""

if target_reschedule in c:
    c = c.replace(target_reschedule, replace_reschedule, 1)
    print("2. Replaced reschedule block")
else:
    c = c.replace(target_reschedule.replace('\n', '\r\n'), replace_reschedule.replace('\n', '\r\n'), 1)
    print("2. Replaced reschedule block (CRLF)")

# 3. Replace Cancel block
target_cancel = """            {/* Cancel Confirmation Dialog */}
            {cancelModal && (
              <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-500/30 shadow-2xl space-y-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-white">Cancel Appointment &amp; Refund Deposit</h3>
                    <p className="text-xs text-rose-200">
                      Your cancellation meets the &gt;24-hour advance notice window. The ${activeBooking.depositAmount}.00 deposit will be returned in full.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancelModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Keep Appointment
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    Yes, Cancel Appointment &amp; Issue Refund
                  </button>
                </div>
              </div>
            )}"""

replace_cancel = """            {/* Cancel Confirmation Dialog */}
            <PatientCancelModal
              isOpen={cancelModal}
              onClose={() => setCancelModal(false)}
              depositAmount={activeBooking.depositAmount}
              onConfirmCancel={handleConfirmCancel}
            />"""

if target_cancel in c:
    c = c.replace(target_cancel, replace_cancel, 1)
    print("3. Replaced cancel block")
else:
    c = c.replace(target_cancel.replace('\n', '\r\n'), replace_cancel.replace('\n', '\r\n'), 1)
    print("3. Replaced cancel block (CRLF)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Finished modularizing manage/page.tsx!")

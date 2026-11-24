filepath = 'src/components/admin/PatientDossierDrawer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Imports
target_import = "import { ClinicalSoapScribeModal } from '@/components/admin/ClinicalSoapScribeModal';"
replace_import = "import { ClinicalSoapScribeModal } from '@/components/admin/ClinicalSoapScribeModal';\nimport { ClinicalTreatmentPlanModal } from '@/components/admin/ClinicalTreatmentPlanModal';"

if target_import in c:
    c = c.replace(target_import, replace_import, 1)
    print("1. Replaced imports")
else:
    c = c.replace(target_import.replace('\n', '\r\n'), replace_import.replace('\n', '\r\n'), 1)
    print("1. Replaced imports (CRLF)")

# 2. State
target_state = "  const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);"
replace_state = "  const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);\n  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);"

if target_state in c:
    c = c.replace(target_state, replace_state, 1)
    print("2. Replaced state")
else:
    c = c.replace(target_state.replace('\n', '\r\n'), replace_state.replace('\n', '\r\n'), 1)
    print("2. Replaced state (CRLF)")

# 3. Official Agreement Button
target_btn = """                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  {planCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3" />}
                  <span>{planCopied ? 'Plan Copied!' : 'Copy Quote'}</span>
                </button>"""

replace_btn = """                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <FileText className="w-3 h-3 text-brand-600" />
                    <span>Official Agreement</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPlan}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                  >
                    {planCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3" />}
                    <span>{planCopied ? 'Plan Copied!' : 'Copy'}</span>
                  </button>
                </div>"""

if target_btn in c:
    c = c.replace(target_btn, replace_btn, 1)
    print("3. Replaced plan header buttons")
else:
    c = c.replace(target_btn.replace('\n', '\r\n'), replace_btn.replace('\n', '\r\n'), 1)
    print("3. Replaced plan header buttons (CRLF)")

# 4. Render ClinicalTreatmentPlanModal
target_render = """      {/* AI Dental Clinical Scribe Modal */}
      <ClinicalSoapScribeModal
        isOpen={isSoapModalOpen}
        onClose={() => setIsSoapModalOpen(false)}
        patientName={booking.patientName}
        bookingRef={booking.id}
        service={booking.service}
        doctor={booking.doctor}
        odontogram={odontogram}
        medicalIntake={booking.medicalIntake}
        onApplyNote={handleApplySoapNote}
      />"""

replace_render = """      {/* AI Dental Clinical Scribe Modal */}
      <ClinicalSoapScribeModal
        isOpen={isSoapModalOpen}
        onClose={() => setIsSoapModalOpen(false)}
        patientName={booking.patientName}
        bookingRef={booking.id}
        service={booking.service}
        doctor={booking.doctor}
        odontogram={odontogram}
        medicalIntake={booking.medicalIntake}
        onApplyNote={handleApplySoapNote}
      />

      {/* Official Clinical Treatment Agreement & Financial Estimate Modal */}
      <ClinicalTreatmentPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        bookingRef={booking.id}
        patientName={booking.patientName}
        patientPhone={booking.phone}
        patientEmail={booking.email}
        doctor={booking.doctor}
        treatmentItems={treatmentItems}
        subtotal={subtotal}
        discountPct={insuranceDiscount}
        discountAmount={discountAmount}
        finalTotal={finalTotal}
        monthlyEstimate={monthlyEstimate}
        depositAmount={booking.depositAmount || 50}
      />"""

if target_render in c:
    c = c.replace(target_render, replace_render, 1)
    print("4. Rendered ClinicalTreatmentPlanModal")
else:
    c = c.replace(target_render.replace('\n', '\r\n'), replace_render.replace('\n', '\r\n'), 1)
    print("4. Rendered ClinicalTreatmentPlanModal (CRLF)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Finished updating PatientDossierDrawer.tsx!")

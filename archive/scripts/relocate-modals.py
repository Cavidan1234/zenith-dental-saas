path = r'c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\src\app\(public)\manage\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Locate modals block
modals_start = text.find('            {/* Reschedule Modal / Slide-out */}')
modals_end = text.find('          </div>\n        ) : (\n          <div className="p-12')

if modals_start == -1 or modals_end == -1:
    print("Could not find modals block:", modals_start, modals_end)
    exit(1)

modals_content = text[modals_start:modals_end].strip()

# Remove modals from inside main
text_without_modals = text[:modals_start] + text[modals_end:]

# Now place after footer
footer_tag = '      </footer>'
if footer_tag not in text_without_modals:
    print("Could not find footer tag!")
    exit(1)

new_tail = """      </footer>

      {activeBooking && (
        <>
          {/* Reschedule Modal / Slide-out */}
          <PatientRescheduleModal
            isOpen={isRescheduling}
            onClose={() => setIsRescheduling(false)}
            options={RESCHEDULE_OPTIONS}
            selectedIndex={selectedReschedule}
            onSelectIndex={setSelectedReschedule}
            doctorName={activeBooking.doctor}
            onConfirm={handleConfirmReschedule}
          />

          {/* Cancel Confirmation Dialog */}
          <PatientCancelModal
            isOpen={cancelModal}
            onClose={() => setCancelModal(false)}
            depositAmount={activeBooking.depositAmount}
            onConfirmCancel={handleConfirmCancel}
          />

          {/* Medical Intake & Pre-Op Triage Modal */}
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
          />

          {/* Private Dental Insurance Verification Modal */}
          <InsuranceVerificationModal
            isOpen={isInsuranceOpen}
            onClose={() => setIsInsuranceOpen(false)}
            patientName={activeBooking.patientName}
            bookingRef={activeBooking.id}
            serviceName={activeBooking.service}
            estimatedFee={activeBooking.service.includes('Whitening') ? 450 : 250}
            onApplyInsurance={handleApplyInsurance}
            existingPolicy={activeBooking.insurancePolicy}
          />
        </>
      )}"""

final_text = text_without_modals.replace(footer_tag, new_tail, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Modals relocated outside main successfully!")

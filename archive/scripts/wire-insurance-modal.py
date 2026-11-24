path = r'c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\src\app\(public)\manage\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = """            {/* Luxury Digital Wallet Pass Modal (Apple / Google Wallet) */}
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

replacement = """            {/* Luxury Digital Wallet Pass Modal (Apple / Google Wallet) */}
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
            />"""

if target in text:
    text = text.replace(target, replacement, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("InsuranceVerificationModal added successfully to JSX!")
else:
    print("Target not found!")

# 1. Update DashboardAppointmentsTab.tsx
filepath_appt = 'src/components/admin/DashboardAppointmentsTab.tsx'
with open(filepath_appt, 'r', encoding='utf-8') as f:
    c_appt = f.read()

target_appt = "onUpdateStatus: (id: string, status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_surgery') => void;"
replace_appt = "onUpdateStatus: (id: string, status: 'confirmed' | 'arrived' | 'pending' | 'completed' | 'cancelled' | 'in_surgery') => void;"

if target_appt in c_appt:
    c_appt = c_appt.replace(target_appt, replace_appt, 1)
    print("1. Updated DashboardAppointmentsTab status type")
else:
    c_appt = c_appt.replace(target_appt.replace('\n', '\r\n'), replace_appt.replace('\n', '\r\n'), 1)
    print("1. Updated DashboardAppointmentsTab status type (CRLF)")

with open(filepath_appt, 'w', encoding='utf-8') as f:
    f.write(c_appt)

# 2. Update dashboard/page.tsx
filepath_dash = 'src/app/(admin)/dashboard/page.tsx'
with open(filepath_dash, 'r', encoding='utf-8') as f:
    c_dash = f.read()

target_dash_status = "newStatus: 'confirmed' | 'in_surgery' | 'completed' | 'cancelled' | 'pending'"
replace_dash_status = "newStatus: 'confirmed' | 'arrived' | 'in_surgery' | 'completed' | 'cancelled' | 'pending'"

if target_dash_status in c_dash:
    c_dash = c_dash.replace(target_dash_status, replace_dash_status, 1)
    print("2. Updated handleUpdateStatus in dashboard/page.tsx")
else:
    print("2. handleUpdateStatus target not found!")

target_dash_render = """        {/* TAB 1.5: SURGERY CORRIDOR & WAITING LOUNGE FLOW */}
        {activeTab === 'live_flow' && (
          <DashboardLiveFlowTab
            bookings={bookings}
            onUpdateStatus={handleUpdateStatus}
            onSelectBooking={(b) => setSelectedBooking(b)}
            onOpenRxModal={(patientName) => {
              setDischargeModal({ isOpen: true, patientName });
            }}
            onOpenWhatsApp={(b) => setWhatsAppModal({ isOpen: true, booking: b })}
            isDarkMode={isDarkMode}
          />
        )}"""

replace_dash_render = """        {/* TAB 1.5: SURGERY CORRIDOR & WAITING LOUNGE FLOW */}
        {activeTab === 'live_flow' && (
          <DashboardLiveFlowTab
            bookings={bookings}
            onUpdateStatus={handleUpdateStatus}
            onSelectBooking={(b) => setSelectedBooking(b)}
            onOpenRxModal={(patientName) => {
              const matched = bookings.find((b) => b.patientName === patientName);
              if (matched) setRxModal(matched);
            }}
            onOpenWhatsApp={(b) => setWhatsAppModalBooking(b)}
            isDarkMode={isDarkMode}
          />
        )}"""

if target_dash_render in c_dash:
    c_dash = c_dash.replace(target_dash_render, replace_dash_render, 1)
    print("3. Updated DashboardLiveFlowTab props in dashboard/page.tsx")
else:
    c_dash = c_dash.replace(target_dash_render.replace('\n', '\r\n'), replace_dash_render.replace('\n', '\r\n'), 1)
    print("3. Updated DashboardLiveFlowTab props in dashboard/page.tsx (CRLF)")

with open(filepath_dash, 'w', encoding='utf-8') as f:
    f.write(c_dash)

print("Finished fixing types in dashboard!")

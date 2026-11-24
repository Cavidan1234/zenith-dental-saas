filepath = 'src/app/(admin)/dashboard/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Imports
target_import = "import { DashboardCalendarTab, ScheduleSlot } from '@/components/admin/DashboardCalendarTab';"
replace_import = "import { DashboardCalendarTab, ScheduleSlot } from '@/components/admin/DashboardCalendarTab';\nimport { DashboardLiveFlowTab } from '@/components/admin/DashboardLiveFlowTab';"

if target_import in c:
    c = c.replace(target_import, replace_import, 1)
    print("1. Replaced imports")
else:
    c = c.replace(target_import.replace('\n', '\r\n'), replace_import.replace('\n', '\r\n'), 1)
    print("1. Replaced imports (CRLF)")

# 2. State
target_state = "const [activeTab, setActiveTab] = useState<'calendar' | 'bookings' | 'recall' | 'analytics'>('calendar');"
replace_state = "const [activeTab, setActiveTab] = useState<'calendar' | 'live_flow' | 'bookings' | 'recall' | 'analytics'>('calendar');"

if target_state in c:
    c = c.replace(target_state, replace_state, 1)
    print("2. Replaced activeTab state")
else:
    print("2. activeTab state not found!")

# 3. Status Labels
target_labels = "confirmed: 'Təsdiqləndi (Confirmed)',"
replace_labels = "confirmed: 'Təsdiqləndi (Confirmed)',\n      arrived: 'Gözləmə Zalında (In Waiting Lounge)',"

if target_labels in c:
    c = c.replace(target_labels, replace_labels, 1)
    print("3. Replaced status labels")
else:
    c = c.replace(target_labels.replace('\n', '\r\n'), replace_labels.replace('\n', '\r\n'), 1)
    print("3. Replaced status labels (CRLF)")

# 4. Tab Navigation button
target_tab_btn = """            <button
              onClick={() => setActiveTab('calendar')}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Schedule (Time-Grid)</span>
            </button>"""

replace_tab_btn = """            <button
              onClick={() => setActiveTab('calendar')}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Schedule (Time-Grid)</span>
            </button>
            <button
              onClick={() => setActiveTab('live_flow')}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
                activeTab === 'live_flow'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Surgery Flow &amp; Lounge</span>
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'live_flow'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                Live
              </span>
            </button>"""

if target_tab_btn in c:
    c = c.replace(target_tab_btn, replace_tab_btn, 1)
    print("4. Inserted Tab Navigation button")
else:
    c = c.replace(target_tab_btn.replace('\n', '\r\n'), replace_tab_btn.replace('\n', '\r\n'), 1)
    print("4. Inserted Tab Navigation button (CRLF)")

# 5. Render Tab
target_tab_render = """        {/* TAB 1: INTERACTIVE SURGERY CALENDAR GRID WITH TIMELINE MOTION */}
        {activeTab === 'calendar' && (
          <DashboardCalendarTab
            scheduleSlots={scheduleSlots}
            bookings={bookings}
            selectedDoctorFilter={selectedDoctorFilter}
            onSelectDoctorFilter={setSelectedDoctorFilter}
            onOpenWalkIn={(slot) => setWalkInModal(slot)}
            onSelectBooking={(b) => setSelectedBooking(b)}
          />
        )}"""

replace_tab_render = """        {/* TAB 1: INTERACTIVE SURGERY CALENDAR GRID WITH TIMELINE MOTION */}
        {activeTab === 'calendar' && (
          <DashboardCalendarTab
            scheduleSlots={scheduleSlots}
            bookings={bookings}
            selectedDoctorFilter={selectedDoctorFilter}
            onSelectDoctorFilter={setSelectedDoctorFilter}
            onOpenWalkIn={(slot) => setWalkInModal(slot)}
            onSelectBooking={(b) => setSelectedBooking(b)}
          />
        )}

        {/* TAB 1.5: SURGERY CORRIDOR & WAITING LOUNGE FLOW */}
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

if target_tab_render in c:
    c = c.replace(target_tab_render, replace_tab_render, 1)
    print("5. Rendered DashboardLiveFlowTab")
else:
    c = c.replace(target_tab_render.replace('\n', '\r\n'), replace_tab_render.replace('\n', '\r\n'), 1)
    print("5. Rendered DashboardLiveFlowTab (CRLF)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Finished updating dashboard/page.tsx!")

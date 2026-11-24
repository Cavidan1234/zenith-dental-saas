path = r'c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\src\app\(admin)\dashboard\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add imports
import_target = "import { RecallPreviewModal } from '@/components/admin/RecallPreviewModal';"
import_replacement = """import { RecallPreviewModal } from '@/components/admin/RecallPreviewModal';
import { exportBookingsToCSV } from '@/lib/csvExport';
import {
  DEFAULT_SEED_BOOKINGS,
  DEFAULT_SEED_RECALLS,
  DEFAULT_SCHEDULE_SLOTS,
} from '@/data/seedBookings';"""

if import_target in text:
    text = text.replace(import_target, import_replacement, 1)

# 2. Replace bookings state seed data (lines 111 to 184)
seed_bookings_start = text.find('  // Default seed bookings\n  const [bookings, setBookings] = useState<BookingRecord[]>([')
reload_bookings_start = text.find('  // Load bookings from localStorage\n  const reloadBookings = () => {')

if seed_bookings_start != -1 and reload_bookings_start != -1:
    new_bookings_state = """  // Default seed bookings (imported from centralized seed database)
  const [bookings, setBookings] = useState<BookingRecord[]>(DEFAULT_SEED_BOOKINGS);

"""
    text = text[:seed_bookings_start] + new_bookings_state + text[reload_bookings_start:]

# 3. Replace recalls state seed data
seed_recalls_start = text.find('  // 6-Month Recall queue\n  const [recalls, setRecalls] = useState<RecallRecord[]>([')
trigger_recall_start = text.find('  const triggerRecallNotice = (patientName: string, id: string) => {')

if seed_recalls_start != -1 and trigger_recall_start != -1:
    new_recalls_state = """  // 6-Month Recall queue (imported from centralized seed database)
  const [recalls, setRecalls] = useState<RecallRecord[]>(DEFAULT_SEED_RECALLS);

"""
    text = text[:seed_recalls_start] + new_recalls_state + text[trigger_recall_start:]

# 4. Replace exportBookingsToCSV implementation (lines 330 to 400)
csv_start = text.find('  const exportBookingsToCSV = () => {\n    const headers = [')
handle_update_status_start = text.find('  const handleUpdateStatus = (id: string, newStatus: BookingRecord[\'status\']) => {')

if csv_start != -1 and handle_update_status_start != -1:
    new_csv_handler = """  const handleExportCSV = () => {
    exportBookingsToCSV(filteredBookings);
    setNotification('Exported ' + filteredBookings.length + ' appointments to CSV.');
    setTimeout(() => setNotification(null), 3000);
  };

"""
    text = text[:csv_start] + new_csv_handler + text[handle_update_status_start:]
    # Replace onClick={exportBookingsToCSV} with onClick={handleExportCSV}
    text = text.replace('onClick={exportBookingsToCSV}', 'onClick={handleExportCSV}')

# 5. Replace scheduleSlots (lines 516 to 526)
slots_start = text.find('  // Schedule grid template\n  const scheduleSlots: ScheduleSlot[] = [')
return_start = text.find('  return (\n    <div\n      className={`min-h-screen ${')

if slots_start != -1 and return_start != -1:
    new_slots_var = """  // Schedule grid template (centralized preset)
  const scheduleSlots = DEFAULT_SCHEDULE_SLOTS;

"""
    text = text[:slots_start] + new_slots_var + text[return_start:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

lines = len(text.splitlines())
print("dashboard/page.tsx updated! New line count:", lines)

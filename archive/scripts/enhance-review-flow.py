# 1. Update src/app/page.tsx
filepath_landing = 'src/app/page.tsx'
with open(filepath_landing, 'r', encoding='utf-8') as f:
    c_land = f.read()

target_pills = """            <Link
              href="/dashboard"
              className="px-3 py-1 rounded-full text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors border border-brand-200"
            >
              Odontogram &amp; Rx Dashboard (/dashboard)
            </Link>"""

replace_pills = """            <Link
              href="/dashboard"
              className="px-3 py-1 rounded-full text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors border border-brand-200"
            >
              Odontogram &amp; Rx Dashboard (/dashboard)
            </Link>
            <Link
              href="/review?ref=ZD-829104"
              className="px-3 py-1 rounded-full text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
            >
              5★ Reputation Funnel (/review)
            </Link>"""

if target_pills in c_land:
    c_land = c_land.replace(target_pills, replace_pills, 1)
    print("1. Inserted review pill on landing page")
else:
    c_land = c_land.replace(target_pills.replace('\n', '\r\n'), replace_pills.replace('\n', '\r\n'), 1)
    print("1. Inserted review pill on landing page (CRLF)")

with open(filepath_landing, 'w', encoding='utf-8') as f:
    f.write(c_land)

# 2. Update DashboardLiveFlowTab.tsx
filepath_live = 'src/components/admin/DashboardLiveFlowTab.tsx'
with open(filepath_live, 'r', encoding='utf-8') as f:
    c_live = f.read()

target_import = "  Sparkles,\n  Search,\n} from 'lucide-react';"
replace_import = "  Sparkles,\n  Search,\n  Star,\n} from 'lucide-react';"

if target_import in c_live:
    c_live = c_live.replace(target_import, replace_import, 1)
    print("2. Added Star icon import")
else:
    c_live = c_live.replace(target_import.replace('\n', '\r\n'), replace_import.replace('\n', '\r\n'), 1)
    print("2. Added Star icon import (CRLF)")

target_actions = """                  <button
                    type="button"
                    onClick={() => onOpenRxModal(b.patientName)}
                    className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                    title="GDC #289410 Prescription Letterhead"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>"""

replace_actions = """                  <button
                    type="button"
                    onClick={() => onOpenRxModal(b.patientName)}
                    className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                    title="GDC #289410 Prescription Letterhead"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`/review?ref=${b.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors"
                    title="5★ Google Reputation Funnel"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </a>"""

if target_actions in c_live:
    c_live = c_live.replace(target_actions, replace_actions, 1)
    print("3. Added Star button in Live Flow")
else:
    c_live = c_live.replace(target_actions.replace('\n', '\r\n'), replace_actions.replace('\n', '\r\n'), 1)
    print("3. Added Star button in Live Flow (CRLF)")

with open(filepath_live, 'w', encoding='utf-8') as f:
    f.write(c_live)

print("Finished updating review flow integrations!")

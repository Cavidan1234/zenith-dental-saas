filepath = 'src/app/(public)/manage/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Imports
target_import = "  Smartphone,\n} from 'lucide-react';"
replace_import = "  Smartphone,\n  Sparkles,\n} from 'lucide-react';"

if target_import in c:
    c = c.replace(target_import, replace_import, 1)
    print("1. Added Sparkles import")
else:
    c = c.replace(target_import.replace('\n', '\r\n'), replace_import.replace('\n', '\r\n'), 1)
    print("1. Added Sparkles import (CRLF)")

# 2. Insert Checklist after Directions
target_dir = """                  {/* Harley Street Studio Directions */}
                  <div className=\"flex items-center gap-2 text-xs text-slate-400 pt-1\">
                    <MapPin className=\"w-4 h-4 text-brand-400 shrink-0\" />
                    <span>
                      Zenith Dental &amp; Esthetics, 14 Harley Street, Marylebone, London W1G 9PR
                    </span>
                  </div>"""

replace_dir = """                  {/* Harley Street Studio Directions */}
                  <div className=\"flex items-center gap-2 text-xs text-slate-400 pt-1\">
                    <MapPin className=\"w-4 h-4 text-brand-400 shrink-0\" />
                    <span>
                      Zenith Dental &amp; Esthetics, 14 Harley Street, Marylebone, London W1G 9PR
                    </span>
                  </div>

                  {/* Tailored Pre-Op Clinical Preparation Checklist */}
                  <div className=\"p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5\">
                    <div className=\"flex items-center justify-between\">
                      <span className=\"text-[10px] font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5\">
                        <Sparkles className=\"w-3.5 h-3.5 text-brand-400\" />
                        <span>Clinical Pre-Op Preparation Guidelines</span>
                      </span>
                      <span className=\"text-[10px] font-mono text-slate-400\">Harley St. Protocols</span>
                    </div>

                    <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300\">
                      <div className=\"flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5\">
                        <span className=\"text-brand-400 font-bold shrink-0\">1.</span>
                        <span>
                          {activeBooking.service.includes('Whitening')
                            ? '48h White Diet: Avoid black coffee, tea, red wine & dark berries prior to visit.'
                            : activeBooking.service.includes('Implant')
                            ? 'Fasting Advisory: If sedation requested, avoid solid food 2h before consultation.'
                            : 'Smile Wishlist: Bring reference photos or desired tooth shades (VITA shade guide).'}
                        </span>
                      </div>

                      <div className=\"flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5\">
                        <span className=\"text-brand-400 font-bold shrink-0\">2.</span>
                        <span>
                          {activeBooking.service.includes('Whitening')
                            ? 'Sensitivity Pre-Care: Brush with potassium nitrate remineralizing paste.'
                            : activeBooking.service.includes('Implant')
                            ? '3D CBCT Preparation: Remove metal facial jewelry or clips before imaging.'
                            : 'Photographic Studio: Arrive refreshed for multi-angle studio shade mapping.'}
                        </span>
                      </div>

                      <div className=\"flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5\">
                        <span className=\"text-brand-400 font-bold shrink-0\">3.</span>
                        <span>
                          Arrival Buffer: Please arrive 10 minutes prior for digital concierge check-in at 14 Harley St.
                        </span>
                      </div>

                      <div className=\"flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5\">
                        <span className=\"text-brand-400 font-bold shrink-0\">4.</span>
                        <span>
                          Parking &amp; Transit: Q-Park Cavendish Square is 3 minutes walk from our surgery suite.
                        </span>
                      </div>
                    </div>
                  </div>"""

if target_dir in c:
    c = c.replace(target_dir, replace_dir, 1)
    print("2. Inserted Prep Checklist")
else:
    c = c.replace(target_dir.replace('\n', '\r\n'), replace_dir.replace('\n', '\r\n'), 1)
    print("2. Inserted Prep Checklist (CRLF)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Finished updating manage/page.tsx!")

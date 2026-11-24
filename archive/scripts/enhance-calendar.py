import sys

filepath = 'src/components/admin/DashboardCalendarTab.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add Operatory status radar under header
target_header = """        {/* Interactive Doctor Filter Pills */}
        <div className="flex items-center gap-2">"""

replace_header = """      {/* Real-time Operatory Chair Status & Infection Control Radar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <div>
              <span className="font-bold text-slate-900 block">Operatory 1: Dr. Leyla Mammadova</span>
              <span className="text-[11px] text-brand-700">In Surgery · Laser Teeth Whitening (Emma R.)</span>
            </div>
          </div>
          <span className="font-mono text-[10px] font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
            Occupied
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <span className="font-bold text-slate-900 block">Operatory 2: Dr. Rashad Aliyev</span>
              <span className="text-[11px] text-emerald-700">Autoclave &amp; UV-C Purified · Ready for Patient</span>
            </div>
          </div>
          <span className="font-mono text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Sterile &amp; Ready
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Operatory View:</span>
        <div className="flex items-center gap-2">"""

if target_header in c:
    c = c.replace(target_header, replace_header, 1)
    print("1. Inserted Operatory status radar")
else:
    target_header_crlf = target_header.replace('\n', '\r\n')
    replace_header_crlf = replace_header.replace('\n', '\r\n')
    if target_header_crlf in c:
        c = c.replace(target_header_crlf, replace_header_crlf, 1)
        print("1. Inserted Operatory status radar (CRLF)")
    else:
        print("1. Header target not found!")

# 2. Upgrade Leyla Buffer strip rendering
target_leyla_strip = """                    <span className="truncate">{leylaText}</span>
                    {isLeylaOpen ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors">
                        <Plus className="w-2.5 h-2.5" /> Open
                      </span>
                    ) : !slot.isBreak && !leylaText.includes('Buffer') ? (
                      <span className="text-[10px] text-brand-600 font-semibold opacity-70 group-hover:opacity-100">
                        Dossier &rarr;
                      </span>
                    ) : null}"""

replace_leyla_strip = """                    {leylaText.includes('Buffer') ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                          <span className="font-bold text-amber-950 truncate">UV-C Operatory Sterilization</span>
                        </div>
                        <span className="font-mono text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
                          15m Buffer
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="truncate">{leylaText}</span>
                        {isLeylaOpen ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors">
                            <Plus className="w-2.5 h-2.5" /> Open
                          </span>
                        ) : !slot.isBreak ? (
                          <span className="text-[10px] text-brand-600 font-semibold opacity-70 group-hover:opacity-100">
                            Dossier &rarr;
                          </span>
                        ) : null}
                      </>
                    )}"""

if target_leyla_strip in c:
    c = c.replace(target_leyla_strip, replace_leyla_strip, 1)
    print("2. Upgraded Leyla buffer strip")
else:
    target_leyla_strip_crlf = target_leyla_strip.replace('\n', '\r\n')
    replace_leyla_strip_crlf = replace_leyla_strip.replace('\n', '\r\n')
    if target_leyla_strip_crlf in c:
        c = c.replace(target_leyla_strip_crlf, replace_leyla_strip_crlf, 1)
        print("2. Upgraded Leyla buffer strip (CRLF)")
    else:
        print("2. Leyla strip target not found!")

# 3. Upgrade Rashad Buffer strip rendering
target_rashad_strip = """                    <span className="truncate">{rashadText}</span>
                    {isRashadOpen ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors">
                        <Plus className="w-2.5 h-2.5" /> Open
                      </span>
                    ) : !slot.isBreak && !rashadText.includes('Buffer') ? (
                      <span className="text-[10px] text-blue-600 font-semibold opacity-70 group-hover:opacity-100">
                        Dossier &rarr;
                      </span>
                    ) : null}"""

replace_rashad_strip = """                    {rashadText.includes('Buffer') ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                          <span className="font-bold text-amber-950 truncate">UV-C Operatory Sterilization</span>
                        </div>
                        <span className="font-mono text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
                          15m Buffer
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="truncate">{rashadText}</span>
                        {isRashadOpen ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors">
                            <Plus className="w-2.5 h-2.5" /> Open
                          </span>
                        ) : !slot.isBreak ? (
                          <span className="text-[10px] text-blue-600 font-semibold opacity-70 group-hover:opacity-100">
                            Dossier &rarr;
                          </span>
                        ) : null}
                      </>
                    )}"""

if target_rashad_strip in c:
    c = c.replace(target_rashad_strip, replace_rashad_strip, 1)
    print("3. Upgraded Rashad buffer strip")
else:
    target_rashad_strip_crlf = target_rashad_strip.replace('\n', '\r\n')
    replace_rashad_strip_crlf = replace_rashad_strip.replace('\n', '\r\n')
    if target_rashad_strip_crlf in c:
        c = c.replace(target_rashad_strip_crlf, replace_rashad_strip_crlf, 1)
        print("3. Upgraded Rashad buffer strip (CRLF)")
    else:
        print("3. Rashad strip target not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Finished updating DashboardCalendarTab.tsx!")

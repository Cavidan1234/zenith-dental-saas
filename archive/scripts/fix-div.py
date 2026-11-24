filepath = 'src/components/admin/DashboardCalendarTab.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

target = """          <p className="text-xs text-slate-500 mt-1">
            Click on any occupied slot to open Clinical Dossier, or click &ldquo;+ Open&rdquo; to register walk-in.
          </p>
        </div>

      {/* Real-time Operatory Chair Status & Infection Control Radar */}"""

replace = """          <p className="text-xs text-slate-500 mt-1">
            Click on any occupied slot to open Clinical Dossier, or click &ldquo;+ Open&rdquo; to register walk-in.
          </p>
        </div>
      </div>

      {/* Real-time Operatory Chair Status & Infection Control Radar */}"""

if target in c:
    c = c.replace(target, replace, 1)
    print("Fixed div (LF)")
else:
    target_crlf = target.replace('\n', '\r\n')
    replace_crlf = replace.replace('\n', '\r\n')
    if target_crlf in c:
        c = c.replace(target_crlf, replace_crlf, 1)
        print("Fixed div (CRLF)")
    else:
        print("Target not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

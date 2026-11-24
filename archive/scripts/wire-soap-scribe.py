import sys

filepath = 'src/components/admin/PatientDossierDrawer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Imports
target_import = "} from 'lucide-react';\nimport { DentalPacsViewer } from '@/components/clinical/DentalPacsViewer';"
replace_import = "  Sparkles,\n} from 'lucide-react';\nimport { DentalPacsViewer } from '@/components/clinical/DentalPacsViewer';\nimport { ClinicalSoapScribeModal } from '@/components/admin/ClinicalSoapScribeModal';"

if target_import in c:
    c = c.replace(target_import, replace_import, 1)
    print("1. Replaced imports")
else:
    # try CRLF
    target_import_crlf = "} from 'lucide-react';\r\nimport { DentalPacsViewer } from '@/components/clinical/DentalPacsViewer';"
    replace_import_crlf = "  Sparkles,\r\n} from 'lucide-react';\r\nimport { DentalPacsViewer } from '@/components/clinical/DentalPacsViewer';\r\nimport { ClinicalSoapScribeModal } from '@/components/admin/ClinicalSoapScribeModal';"
    if target_import_crlf in c:
        c = c.replace(target_import_crlf, replace_import_crlf, 1)
        print("1. Replaced imports (CRLF)")
    else:
        print("1. Import target not found!")

# 2. State
target_state = "const [planCopied, setPlanCopied] = useState(false);"
replace_state = """const [planCopied, setPlanCopied] = useState(false);
  const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);

  const handleApplySoapNote = (noteText: string) => {
    setInternalNoteDraft(noteText);
    onSaveInternalNote(booking.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };"""

if target_state in c:
    c = c.replace(target_state, replace_state, 1)
    print("2. Replaced state")
else:
    print("2. State target not found!")

# 3. Notes Header with AI SOAP Scribe Button
target_notes = """            {/* Doctor Internal Medical Notes (Editable) */}
            <div className=\"space-y-2\">
              <label className=\"block text-xs font-bold text-slate-700 uppercase tracking-wider\">
                Internal Clinical Notes (Doctor / Admin Only)
              </label>"""

replace_notes = """            {/* Doctor Internal Medical Notes (Editable) */}
            <div className=\"space-y-2\">
              <div className=\"flex items-center justify-between\">
                <label className=\"block text-xs font-bold text-slate-700 uppercase tracking-wider\">
                  Internal Clinical Notes (Doctor / Admin Only)
                </label>
                <button
                  type=\"button\"
                  onClick={() => setIsSoapModalOpen(true)}
                  className=\"px-2.5 py-1 rounded-lg text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95\"
                >
                  <Sparkles className=\"w-3 h-3 text-brand-600\" />
                  <span>AI SOAP Scribe</span>
                </button>
              </div>"""

if target_notes in c:
    c = c.replace(target_notes, replace_notes, 1)
    print("3. Replaced notes header")
else:
    target_notes_crlf = target_notes.replace('\n', '\r\n')
    replace_notes_crlf = replace_notes.replace('\n', '\r\n')
    if target_notes_crlf in c:
        c = c.replace(target_notes_crlf, replace_notes_crlf, 1)
        print("3. Replaced notes header (CRLF)")
    else:
        print("3. Notes header target not found!")

# 4. Render ClinicalSoapScribeModal before end
target_end = """    </div>
  );
}"""

replace_end = """      {/* AI Dental Clinical Scribe Modal */}
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
    </div>
  );
}"""

if target_end in c:
    c = c.replace(target_end, replace_end, 1)
    print("4. Replaced drawer end")
else:
    target_end_crlf = target_end.replace('\n', '\r\n')
    replace_end_crlf = replace_end.replace('\n', '\r\n')
    if target_end_crlf in c:
        c = c.replace(target_end_crlf, replace_end_crlf, 1)
        print("4. Replaced drawer end (CRLF)")
    else:
        print("4. End target not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Finished wiring AI SOAP Scribe in PatientDossierDrawer.tsx!")

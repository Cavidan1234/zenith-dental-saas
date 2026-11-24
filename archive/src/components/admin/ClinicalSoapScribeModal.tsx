'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Copy,
  FileText,
  AlertCircle,
  Wand2,
  Printer,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { playSuccessPing, playLuxuryChime, playHapticTick } from '@/lib/soundscapes';

export interface SoapNoteData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  doctorGdc: string;
  icdCode: string;
  cdtCode: string;
  timestamp: string;
}

interface ClinicalSoapScribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  bookingRef: string;
  service: string;
  doctor: string;
  odontogram: Record<number, 'sound' | 'restored' | 'surgical' | 'watch'>;
  medicalIntake?: {
    anxietyLevel?: string;
    allergies?: string[];
    medicalConditions?: string[];
    sedationRequested?: boolean;
  };
  onApplyNote: (formattedNote: string) => void;
}

const CLINICAL_PRESETS = [
  {
    id: 'exam_prophy',
    title: 'Comprehensive Exam & 3D CBCT',
    category: 'Diagnostic',
    icd: 'Z01.20 - Dental examination without abnormal findings',
    cdt: 'D0150 / D0330 / D1110',
    subjective: 'Patient presents for routine comprehensive oral exam and aesthetic smile consultation. Denies acute dental pain; reports mild cold sensitivity on upper molars.',
    objective: 'Full periodontal probing within normal limits (2-3mm, no bleeding on probing). Hard tissue exam reveals sound enamel with localized micro-wear on incisal edges. 3D CBCT shows intact cortical plates and healthy sinus floor.',
    assessment: 'Mild generalized dentine hypersensitivity; sound alveolar bone morphology. Appropriate candidate for conservative aesthetic enhancements.',
    plan: '1. Oral hygiene prophylaxis & ultrasonic scaling.\n2. In-office remineralizing fluoride varnish applied.\n3. Impressions taken for custom night guard.\n4. Follow-up 6-month preventive hygiene recall scheduled.',
  },
  {
    id: 'laser_whitening',
    title: 'Laser Teeth Whitening (In-Office)',
    category: 'Aesthetic',
    icd: 'K03.7 - Extrinsic discoloration of teeth',
    cdt: 'D9972 - External bleaching per arch',
    subjective: 'Patient seeks aesthetic brightening for upcoming professional and social events. Expresses aesthetic concern regarding uneven shade across maxillary anteriors.',
    objective: 'Initial shade recorded under 5500K daylight illumination: A3. Gingival margins healthy with zero pocketing >2mm. Liquid dam barrier (gingival protector) cured seamlessly along teeth #4 through #13.',
    assessment: 'Mild extrinsic chromogenic staining with sound enamel matrix. Cleared for high-concentration in-office laser photodispersion.',
    plan: '1. 38% Hydrogen peroxide medical gel applied in 3 x 15-minute cycles with 450nm laser activation.\n2. Thorough rinse and evacuation; desensitizing potassium nitrate ACP applied for 5 minutes.\n3. Final postoperative shade achieved: BL1 (Hollywood Bleach White). 6-shade lift verified.\n4. Prescribed 48h white diet; provided home remineralization paste.',
  },
  {
    id: 'porcelain_veneer',
    title: 'Porcelain Veneer Smile Design',
    category: 'Restorative',
    icd: 'K03.81 - Cracked tooth / Enamel fracture',
    cdt: 'D2962 - Labial veneer (porcelain laminate)',
    subjective: 'Patient desires correction of minor diastema and incisal edge asymmetry on anterior sextant. Requests natural translucent micro-texture.',
    objective: 'Minimally invasive 0.3mm to 0.5mm enamel reduction completed on maxillary incisors (#7, #8, #9, #10). Supragingival chamfer margins prepared under 3.5x magnification. Digital intraoral 3D scan generated.',
    assessment: 'Aesthetic diastema and incisal disharmony; vital pulps confirmed with cold test.',
    plan: '1. 3D digital impressions uploaded to lab for monolithic e.max feldspathic porcelain laminates.\n2. Bis-acryl provisional veneers fabricated and bonded with spot-etch technique.\n3. Shade prescription BL2 with incisal halo effect transmitted.\n4. Final cementation visit booked for 10 business days.',
  },
  {
    id: 'implant_surgery',
    title: 'Dental Implant Consultation & CBCT',
    category: 'Surgical',
    icd: 'K08.10 - Complete / Partial loss of teeth',
    cdt: 'D6010 - Surgical placement of implant body',
    subjective: 'Patient presents for evaluation of missing tooth site. Desires permanent fixed prosthetic tooth replacement without adjacent tooth prep.',
    objective: 'Edentulous ridge palpation indicates wide keratinized gingival band (>4mm). 3D CBCT demonstrates 8.2mm alveolar bone width and >14mm vertical height to inferior alveolar nerve canal.',
    assessment: 'Single-tooth edentulism suitable for immediate or delayed titanium implant fixture placement (Straumann BLX / Nobel Biocare).',
    plan: '1. Reviewed surgical stages, aseptic protocol, and bone grafting options.\n2. Pre-op antibiotic regimen prescribed (Amoxicillin 500mg or Clindamycin if allergic).\n3. Surgery date reserved with 30-minute room buffer protocol.\n4. Consent signed for 3D guided computer-assisted placement.',
  },
];

export function ClinicalSoapScribeModal({
  isOpen,
  onClose,
  patientName,
  bookingRef,
  service,
  doctor,
  odontogram,
  medicalIntake,
  onApplyNote,
}: ClinicalSoapScribeModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('exam_prophy');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [soapData, setSoapData] = useState<SoapNoteData>(() => {
    const p = CLINICAL_PRESETS[0];
    return {
      subjective: p.subjective,
      objective: p.objective,
      assessment: p.assessment,
      plan: p.plan,
      doctorGdc: 'GDC #289410',
      icdCode: p.icd,
      cdtCode: p.cdt,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
  });

  if (!isOpen) return null;

  // Handle Preset Switching
  const handleSelectPreset = (presetId: string) => {
    playHapticTick();
    setSelectedPreset(presetId);
    const p = CLINICAL_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setSoapData((prev) => ({
        ...prev,
        subjective: p.subjective,
        objective: p.objective,
        assessment: p.assessment,
        plan: p.plan,
        icdCode: p.icd,
        cdtCode: p.cdt,
      }));
    }
  };

  // AI Synthesis Engine: builds custom note based on Odontogram and Medical Intake
  const handleSynthesizeFromChart = () => {
    playHapticTick();
    setIsSynthesizing(true);

    setTimeout(() => {
      // Analyze active teeth from Odontogram
      const restoredTeeth = Object.entries(odontogram)
        .filter(([_, st]) => st === 'restored')
        .map(([t]) => `#${t}`);
      const surgicalTeeth = Object.entries(odontogram)
        .filter(([_, st]) => st === 'surgical')
        .map(([t]) => `#${t}`);
      const watchTeeth = Object.entries(odontogram)
        .filter(([_, st]) => st === 'watch')
        .map(([t]) => `#${t}`);

      const toothFindings: string[] = [];
      if (restoredTeeth.length > 0) {
        toothFindings.push(`Restored/Veneered units: ${restoredTeeth.join(', ')}`);
      }
      if (surgicalTeeth.length > 0) {
        toothFindings.push(`Surgical/Implant sites: ${surgicalTeeth.join(', ')}`);
      }
      if (watchTeeth.length > 0) {
        toothFindings.push(`Monitored watch sites: ${watchTeeth.join(', ')}`);
      }

      // Check allergies
      const allergiesList = medicalIntake?.allergies?.filter((a) => a !== 'None') || [];
      const allergyNote =
        allergiesList.length > 0
          ? `CRITICAL ALLERGY ALERT: Patient is allergic to [${allergiesList.join(', ')}]. Avoided in all intraoral products & Rx.`
          : 'Patient reports no known drug allergies (NKDA).';

      const anxietyNote =
        medicalIntake?.anxietyLevel && medicalIntake.anxietyLevel !== 'none'
          ? `Patient noted ${medicalIntake.anxietyLevel} dental anxiety score. Gentle operatory pacing, verbal reassurance, and topical benzocaine pre-numbing instituted.`
          : 'Patient demonstrated high operatory comfort with zero signs of acute dental phobia.';

      const synthesizedSubjective = `Patient ${patientName} (${bookingRef}) attended consultation for "${service}" under ${doctor}. Chief complaint: Routine scheduled check and treatment progression. ${anxietyNote}`;

      const synthesizedObjective = `Operatory examination completed under 3.5x surgical loupes and LED coaxial illumination. ${
        toothFindings.length > 0
          ? `32-Tooth Odontogram records: ${toothFindings.join('; ')}.`
          : 'Dentition sound with physiological occlusion (Angle Class I).'
      } Soft tissue examination negative for pathology or lymphadenopathy. DICOM 3.0 digital imaging reviewed. ${allergyNote}`;

      const synthesizedAssessment = `Clinical findings correlate with planned treatment: ${service}. ${
        watchTeeth.length > 0
          ? `Active surveillance indicated for tooth ${watchTeeth.join(', ')}.`
          : 'Prognosis favorable for aesthetic and functional longevity.'
      }`;

      const synthesizedPlan = `1. Performed scheduled procedure according to Zenith Dental clinical protocols.\n2. Verified static and dynamic occlusal harmony with 12μm articulating film.\n3. Detailed post-operative instructions provided in writing and via Digital Surgery Pass.\n4. Routine clinical review scheduled in accordance with hygiene recall cadence.`;

      setSoapData((prev) => ({
        ...prev,
        subjective: synthesizedSubjective,
        objective: synthesizedObjective,
        assessment: synthesizedAssessment,
        plan: synthesizedPlan,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }));

      setIsSynthesizing(false);
      playLuxuryChime();
    }, 600);
  };

  // Compile full formatted SOAP string
  const compileFormattedNote = () => {
    return `=== ZENITH DENTAL CLINICAL SOAP NOTE ===
Patient: ${patientName} | Ref: ${bookingRef}
Specialist: ${doctor} (${soapData.doctorGdc})
Date & Time: ${soapData.timestamp}
Diagnostic Coding: [ICD-10: ${soapData.icdCode}] [CDT: ${soapData.cdtCode}]

[S] SUBJECTIVE:
${soapData.subjective}

[O] OBJECTIVE:
${soapData.objective}

[A] ASSESSMENT:
${soapData.assessment}

[P] PLAN & PROCEDURES PERFORMED:
${soapData.plan}

Status: Signed & Verified by Clinician (${doctor})`;
  };

  const handleCopy = () => {
    playHapticTick();
    navigator.clipboard.writeText(compileFormattedNote());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApply = () => {
    playSuccessPing();
    onApplyNote(compileFormattedNote());
    onClose();
  };

  const handlePrint = () => {
    playHapticTick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  AI Dental Clinical Scribe
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/40">
                  SOAP Note Synthesizer
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                CQC &amp; HIPAA-compliant medical documentation for {patientName} ({bookingRef})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Quick AI Synthesis Trigger Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-indigo-50/50 to-sky-50 border border-brand-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-brand-950 block">
                  Autopilot Clinical Synthesis
                </span>
                <span className="text-[11px] text-brand-700">
                  Synthesize SOAP record from Odontogram teeth, Panorex imaging &amp; Pre-Op triage.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSynthesizeFromChart}
              disabled={isSynthesizing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing...' : '1-Click Chart Synthesis'}</span>
            </button>
          </div>

          {/* Clinical Specialty Preset Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Standard Clinical Procedure Presets
              </label>
              <span className="text-[10px] text-slate-400 font-mono">ICD-10 / CDT Linked</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {CLINICAL_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPreset === p.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-brand-400'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-wider block opacity-70">
                    {p.category}
                  </span>
                  <span className="text-xs font-bold block truncate mt-0.5">{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SOAP Four-Quadrant Interactive Form */}
          <div className="space-y-4">
            {/* Subjective */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-brand-100 text-brand-700 text-[11px] font-mono flex items-center justify-center font-black">
                    S
                  </span>
                  Subjective (Patient Chief Complaint &amp; History)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Patient Symptoms</span>
              </div>
              <textarea
                rows={2}
                value={soapData.subjective}
                onChange={(e) => setSoapData({ ...soapData, subjective: e.target.value })}
                className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Objective */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[11px] font-mono flex items-center justify-center font-black">
                    O
                  </span>
                  Objective (Clinical Findings, Odontogram &amp; Imaging)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Loupes &amp; Panorex</span>
              </div>
              <textarea
                rows={3}
                value={soapData.objective}
                onChange={(e) => setSoapData({ ...soapData, objective: e.target.value })}
                className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Assessment */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-mono flex items-center justify-center font-black">
                    A
                  </span>
                  Assessment (Diagnosis &amp; Prognosis)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ICD-10 Diagnostic</span>
              </div>
              <textarea
                rows={2}
                value={soapData.assessment}
                onChange={(e) => setSoapData({ ...soapData, assessment: e.target.value })}
                className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Plan */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-mono flex items-center justify-center font-black">
                    P
                  </span>
                  Plan &amp; Procedures Performed
                </span>
                <span className="text-[10px] text-slate-400 font-mono">CDT Coding &amp; Rx</span>
              </div>
              <textarea
                rows={3}
                value={soapData.plan}
                onChange={(e) => setSoapData({ ...soapData, plan: e.target.value })}
                className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Epikriz</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Insert into Patient Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

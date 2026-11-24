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

export interface ClinicalPreset {
  id: string;
  title: string;
  category: string;
  icd: string;
  cdt: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const CLINICAL_PRESETS: ClinicalPreset[] = [
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

export function synthesizeSoapFromChart({
  patientName,
  bookingRef,
  service,
  doctor,
  odontogram,
  medicalIntake,
}: {
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
}) {
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

  const allergiesList = medicalIntake?.allergies?.filter((a) => a !== 'None') || [];
  const allergyNote =
    allergiesList.length > 0
      ? `CRITICAL ALLERGY ALERT: Patient is allergic to [${allergiesList.join(', ')}]. Avoided in all intraoral products & Rx.`
      : 'Patient reports no known drug allergies (NKDA).';

  const anxietyNote =
    medicalIntake?.anxietyLevel && medicalIntake.anxietyLevel !== 'none'
      ? `Patient noted ${medicalIntake.anxietyLevel} dental anxiety score. Gentle operatory pacing, verbal reassurance, and topical benzocaine pre-numbing instituted.`
      : 'Patient demonstrated high operatory comfort with zero signs of acute dental phobia.';

  const subjective = `Patient ${patientName} (${bookingRef}) attended consultation for "${service}" under ${doctor}. Chief complaint: Routine scheduled check and treatment progression. ${anxietyNote}`;

  const objective = `Operatory examination completed under 3.5x surgical loupes and LED coaxial illumination. ${
    toothFindings.length > 0
      ? `32-Tooth Odontogram records: ${toothFindings.join('; ')}.`
      : 'Dentition sound with physiological occlusion (Angle Class I).'
  } Soft tissue examination negative for pathology or lymphadenopathy. DICOM 3.0 digital imaging reviewed. ${allergyNote}`;

  const assessment = `Clinical findings correlate with planned treatment: ${service}. ${
    watchTeeth.length > 0
      ? `Active surveillance indicated for tooth ${watchTeeth.join(', ')}.`
      : 'Prognosis favorable for aesthetic and functional longevity.'
  }`;

  const plan = `1. Performed scheduled procedure according to Zenith Dental clinical protocols.\n2. Verified static and dynamic occlusal harmony with 12μm articulating film.\n3. Detailed post-operative instructions provided in writing and via Digital Surgery Pass.\n4. Routine clinical review scheduled in accordance with hygiene recall cadence.`;

  return { subjective, objective, assessment, plan };
}


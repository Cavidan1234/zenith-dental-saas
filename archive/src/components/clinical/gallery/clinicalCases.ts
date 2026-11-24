export interface ClinicalCase {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  procedure: string;
  doctor: string;
  doctorId: string;
  serviceId: string;
  duration: string;
  shadeBefore: string;
  shadeAfter: string;
  beforeHeadline: string;
  beforeDescription: string;
  afterHeadline: string;
  afterDescription: string;
  depositCents: number;
}

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'veneers',
    category: 'Aesthetic Dentistry',
    title: 'Full Arch Ceramic Smile Rejuvenation',
    subtitle: '8 Minimal-Prep Handcrafted Porcelain Veneers',
    procedure: 'Feldspathic porcelain layered with natural incisal translucency',
    doctor: 'Dr. Leyla Mammadova (Lead Aesthetic Specialist)',
    doctorId: 'doc-leyla',
    serviceId: 'srv-veneers',
    duration: '2 Appointments · 10 Days Total',
    shadeBefore: 'A3.5 Chromatic',
    shadeAfter: 'BL2 Bleach Shade',
    beforeHeadline: 'Initial Condition: Severe Discoloration & Incisal Chipping',
    beforeDescription:
      'Patient presented with intrinsic fluorosis staining, uneven gum margins, and significant incisal enamel wear compromising facial symmetry.',
    afterHeadline: 'After Treatment: Natural Incisal Edge & Radiant Harmony',
    afterDescription:
      'Ultra-thin 0.3mm ceramic veneers designed via 3D Digital Smile Design. Corrected tooth proportions, restored golden ratio, and enhanced light transmission.',
    depositCents: 3000,
  },
  {
    id: 'implant',
    category: 'Oral Surgery & Implants',
    title: '3D Computer-Guided Implant Restoration',
    subtitle: 'Nobel Biocare Titanium Post with Screw-Retained Zirconia Crown',
    procedure: 'CBCT Guided Flapless Placement with Immediate Temporary Load',
    doctor: 'Dr. Rashad Aliyev (Oral & Maxillofacial Surgeon)',
    doctorId: 'doc-rashad',
    serviceId: 'srv-implant',
    duration: 'Guided Surgery (45m) + Integration',
    shadeBefore: 'Edentulous Gap (#21)',
    shadeAfter: 'A1 Monolithic Zirconia',
    beforeHeadline: 'Initial Condition: Traumatic Tooth Loss (#21 Anterior)',
    beforeDescription:
      'Anterior incisor lost to sports trauma with localized alveolar bone ridge resorption. Patient was unable to chew or smile with confidence.',
    afterHeadline: 'After Treatment: Titanium Osseointegration & Gum Papilla Match',
    afterDescription:
      'High-precision guided surgical guide ensured optimal 3D angulation. Soft tissue scalloping preserved natural emergence profile indistinguishable from natural teeth.',
    depositCents: 5000,
  },
  {
    id: 'whitening',
    category: 'Cosmetic Whitening',
    title: 'In-Office Diode Laser Teeth Whitening',
    subtitle: 'Advanced 460nm Blue Diode Photo-Activation',
    procedure: 'Laser photochemical oxidation with potassium nitrate desensitizer',
    doctor: 'Dr. Leyla Mammadova (Lead Aesthetic Specialist)',
    doctorId: 'doc-leyla',
    serviceId: 'srv-whitening',
    duration: '1 Single Session · 60 Minutes',
    shadeBefore: 'A3.5 Tetracycline Tone',
    shadeAfter: 'B1 High-Luminance White',
    beforeHeadline: 'Initial Condition: Heavy Coffee & Tea Enamel Staining',
    beforeDescription:
      'Deep extrinsic and intrinsic chromogen accumulation in the porous enamel prisms, creating a yellowed, aged smile appearance.',
    afterHeadline: 'After Treatment: 8 Shades Lighter with Zero Dentin Sensitivity',
    afterDescription:
      'Laser-accelerated hydrogen peroxide gel lifted 8 shades in three 15-minute cycles. Finished with remineralizing nano-hydroxyapatite varnish.',
    depositCents: 5000,
  },
];

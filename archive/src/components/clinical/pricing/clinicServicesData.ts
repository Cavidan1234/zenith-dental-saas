'use client';

import {
  AnimatedScanIcon,
  AnimatedSparklesIcon,
  AnimatedGemIcon,
  AnimatedShieldCheckIcon,
  MicroScanReticleIcon,
  MicroSonicWaveIcon,
  MicroAuditChartIcon,
  MicroToothBiteIcon,
  MicroLaserRayIcon,
  MicroEnamelShieldIcon,
  MicroGumBarrierIcon,
  MicroHomeKitIcon,
  MicroSmileCurveIcon,
  MicroCeramicLayersIcon,
  MicroDentalMirrorIcon,
  MicroShadeGuideIcon,
  MicroVolumetricCubeIcon,
  MicroSurgicalGuideIcon,
  MicroImplantPostIcon,
  MicroSafetyRadarIcon,
} from '@/components/icons/dental-animated';

export interface ClinicServiceItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  highlights: { text: string; icon: React.ComponentType<{ className?: string }> }[];
  guarantee: string;
  duration: string;
  price: string;
  deposit: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CLINIC_PUBLIC_SERVICES: ClinicServiceItem[] = [
  {
    id: 'srv-checkup',
    title: 'Comprehensive 3D Exam & Prophylaxis',
    category: 'Diagnostic & Preventive',
    desc: 'Digital intraoral 3D scan, periodontal bone health check, oral cancer screening, and gentle ultrasonic cleaning.',
    highlights: [
      { text: 'Full-Arch 3D Intraoral Digital Scan', icon: MicroScanReticleIcon },
      { text: 'Swiss EMS Guided Biofilm Therapy', icon: MicroSonicWaveIcon },
      { text: '12-Point Periodontal & Enamel Audit', icon: MicroAuditChartIcon },
      { text: 'Digital Bite & Occlusion Analysis', icon: MicroToothBiteIcon },
    ],
    guarantee: '100% Pain-Free Ultrasonic Protocol',
    duration: '45 mins',
    price: '$80',
    deposit: '$25 deposit',
    icon: AnimatedScanIcon,
  },
  {
    id: 'srv-whitening',
    title: 'Laser Teeth Whitening (In-Office)',
    category: 'Cosmetic Dentistry',
    desc: 'Medical-grade diode laser activation providing up to 8 shades of whitening with zero dentin hypersensitivity.',
    highlights: [
      { text: 'Philips Zoom & Diode Laser Activation', icon: MicroLaserRayIcon },
      { text: 'Nano-Hydroxyapatite Enamel Armor', icon: MicroEnamelShieldIcon },
      { text: 'Gingival Barrier Protection Shield', icon: MicroGumBarrierIcon },
      { text: 'Custom Take-Home Maintenance Kit', icon: MicroHomeKitIcon },
    ],
    guarantee: 'Zero Sensitivity Desensitizing Gel',
    duration: '60 mins',
    price: '$250',
    deposit: '$50 deposit',
    icon: AnimatedSparklesIcon,
  },
  {
    id: 'srv-veneers',
    title: 'Porcelain Veneer Smile Design',
    category: 'Aesthetic Artistry',
    desc: 'Digital Smile Design (DSD) consultation, facial proportion mapping, and handcrafted ceramic veneers from Germany.',
    highlights: [
      { text: '3D Facial & Lip-Line Smile Preview', icon: MicroSmileCurveIcon },
      { text: 'Hand-Layered Ivoclar E.max Ceramics', icon: MicroCeramicLayersIcon },
      { text: 'Trial Mock-Up Before Any Tooth Prep', icon: MicroDentalMirrorIcon },
      { text: 'Natural Translucency Shade Matching', icon: MicroShadeGuideIcon },
    ],
    guarantee: '10-Year German Ceramic Warranty',
    duration: '45 mins',
    price: '$120',
    deposit: '$30 deposit',
    icon: AnimatedGemIcon,
  },
  {
    id: 'srv-implant',
    title: 'Dental Implant Consultation & 3D CBCT',
    category: 'Implantology & Surgery',
    desc: 'Precision 3D bone volume scan, computer-guided implant planning, and lifetime-guaranteed titanium/zirconia options.',
    highlights: [
      { text: 'Low-Dose 3D CBCT Bone Tomography', icon: MicroVolumetricCubeIcon },
      { text: 'Digital Keyhole Surgical Guide Plan', icon: MicroSurgicalGuideIcon },
      { text: 'Straumann Swiss Titanium & Zirconia', icon: MicroImplantPostIcon },
      { text: '3D Nerve & Sinus Safety Mapping', icon: MicroSafetyRadarIcon },
    ],
    guarantee: 'Lifetime Structural Implant Guarantee',
    duration: '60 mins',
    price: '$150',
    deposit: '$50 deposit',
    icon: AnimatedShieldCheckIcon,
  },
];

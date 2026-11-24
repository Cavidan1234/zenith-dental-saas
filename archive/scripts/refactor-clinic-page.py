path = r'c:\Users\LocalAdmin\Desktop\web_auto\booking-saas\src\app\(public)\b\[slug]\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports
old_imports = """import {
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { ClinicFooter } from '@/components/shared/ClinicFooter';
import { Language, getDictionary } from '@/lib/i18n';
import { BookingModal, CLINIC_SERVICES } from '@/components/booking/BookingModal';
import { AboutGuaranteeSection } from '@/components/shared/AboutGuaranteeSection';
import { ContactSection } from '@/components/shared/ContactSection';
import { FaqSection } from '@/components/shared/FaqSection';
import { SmileTransformationGallery } from '@/components/clinical/SmileTransformationGallery';
import { BlurReveal, KineticBlurText } from '@/components/ui/blur-reveal';"""

new_imports = """import { Header } from '@/components/shared/Header';
import { ClinicFooter } from '@/components/shared/ClinicFooter';
import { Language, getDictionary } from '@/lib/i18n';
import { BookingModal, CLINIC_SERVICES } from '@/components/booking/BookingModal';
import { AboutGuaranteeSection } from '@/components/shared/AboutGuaranteeSection';
import { ContactSection } from '@/components/shared/ContactSection';
import { FaqSection } from '@/components/shared/FaqSection';
import { SmileTransformationGallery } from '@/components/clinical/SmileTransformationGallery';
import { ClinicalDoctorsSection } from '@/components/clinical/ClinicalDoctorsSection';
import { ClinicalPricingSection } from '@/components/clinical/ClinicalPricingSection';"""

if old_imports in text:
    text = text.replace(old_imports, new_imports, 1)

# 2. Remove obsolete state in ClinicPublicPage component
old_state = """  const [lang, setLang] = useState<Language>('en');
  const [heroKey, setHeroKey] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [cardAnimKeys, setCardAnimKeys] = useState<Record<string, number>>({});
  const [entranceAnimKey, setEntranceAnimKey] = useState(0);

  // Trigger SVG draw animations upon pricing section entry into viewport
  useEffect(() => {
    const elem = document.getElementById('pricing');
    if (!elem) return;
    if (typeof IntersectionObserver === 'undefined') {
      setEntranceAnimKey(1);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntranceAnimKey((prev) => (prev === 0 ? 1 : prev));
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(elem);
    return () => observer.disconnect();
  }, []);"""

new_state = """  const [lang, setLang] = useState<Language>('en');
  const [heroKey, setHeroKey] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();"""

if old_state in text:
    text = text.replace(old_state, new_state, 1)

# 3. Replace the entire Doctors + Pricing JSX block
doc_start = text.find('{/* CLINICAL SPECIALISTS (DOCTORS) SECTION')
after_pricing_marker = '{/* BEFORE & AFTER VERIFIED CLINICAL SMILE TRANSFORMATION GALLERY */}'
pricing_end = text.find(after_pricing_marker)

if doc_start == -1 or pricing_end == -1:
    print("Could not find sections boundary:", doc_start, pricing_end)
    exit(1)

new_sections_jsx = """{/* CLINICAL SPECIALISTS (DOCTORS) SECTION */}
        <ClinicalDoctorsSection
          dict={dict}
          lang={lang}
          customTenant={customTenant}
          onOpenBooking={openBookingFor}
        />

        {/* PRICING & TREATMENTS SECTION */}
        <ClinicalPricingSection
          dict={dict}
          lang={lang}
          services={services}
          onOpenBooking={(srvId) => openBookingFor(srvId)}
        />

        """

text = text[:doc_start] + new_sections_jsx + text[pricing_end:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

lines = len(text.splitlines())
print("b/[slug]/page.tsx refactored successfully! New line count:", lines)

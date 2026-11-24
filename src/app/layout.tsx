import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const SITE_URL = "https://zenith-dental-studio-sage.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zenith Dental Studio | Marylebone, London",
    template: "%s | Zenith Dental Studio",
  },
  description:
    "Bespoke Aesthetic Dentistry, Orthodontics & Guided Dental Implants at 42 Harley Street, Marylebone, London, W1G 9PR.",
  keywords: [
    "Zenith Dental Studio",
    "Harley Street Dentist",
    "Marylebone Dental Clinic",
    "Porcelain Veneers London",
    "Guided Dental Implants",
    "Laser Teeth Whitening",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zenith Dental Studio | Marylebone, London",
    description:
      "Bespoke Aesthetic Dentistry, Orthodontics & Guided Dental Implants at 42 Harley Street, Marylebone, London.",
    url: SITE_URL,
    siteName: "Zenith Dental Studio",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/dental/clinic-hero.jpg",
        width: 1376,
        height: 768,
        alt: "Zenith Dental Studio — 42 Harley Street, Marylebone, London",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith Dental Studio | Marylebone, London",
    description:
      "Bespoke Aesthetic Dentistry, Orthodontics & Guided Dental Implants at 42 Harley Street, Marylebone, London.",
    images: ["/images/dental/clinic-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zenith Dental",
  },
};

const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Zenith Dental Studio",
  url: SITE_URL,
  image: `${SITE_URL}/images/dental/clinic-hero.jpg`,
  description:
    "Bespoke Aesthetic Dentistry, Orthodontics & Guided Dental Implants at 42 Harley Street, Marylebone, London.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "42 Harley Street",
    addressLocality: "Marylebone, London",
    postalCode: "W1G 9PR",
    addressCountry: "GB",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "15:00",
    },
  ],
  priceRange: "£££",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

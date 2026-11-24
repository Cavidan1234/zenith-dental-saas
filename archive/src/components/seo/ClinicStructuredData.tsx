import React from 'react';

interface ClinicStructuredDataProps {
  clinicName?: string;
  slug?: string;
  address?: string;
  city?: string;
  phone?: string;
}

export function ClinicStructuredData({
  clinicName = "Zenith Dental Surgery — Harley Street",
  slug = "zenith-dental",
  address = "74 Harley Street, Marylebone",
  city = "London",
  phone = "+44 20 7946 0921",
}: ClinicStructuredDataProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": clinicName,
    "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80",
    "@id": `https://dentalbook.os/b/${slug}`,
    "url": `https://dentalbook.os/b/${slug}`,
    "telephone": phone,
    "priceRange": "£££",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": city,
      "postalCode": "W1G 7HX",
      "addressCountry": "GB",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.5194,
      "longitude": -0.1478,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:30",
        "closes": "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "09:00",
        "closes": "16:00",
      },
    ],
    "medicalSpecialty": [
      "Dentistry",
      "Orthodontics",
      "CosmeticDentistry",
      "DentalImplantology",
    ],
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "Porcelain Veneer Smile Sculpting",
        "procedureType": "Cosmetic",
      },
      {
        "@type": "MedicalProcedure",
        "name": "Titanium Dental Implant Placement",
        "procedureType": "Surgical",
      },
      {
        "@type": "MedicalProcedure",
        "name": "Invisalign Clear Aligner Therapy",
        "procedureType": "Orthodontic",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

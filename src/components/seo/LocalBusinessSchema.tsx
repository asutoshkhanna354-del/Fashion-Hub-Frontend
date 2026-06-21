import React from 'react';

export default function LocalBusinessSchema({ settings }: { settings: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solankivastrabhandar.com';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": settings?.store_name || "Solanki Vastra Bhandar",
    "image": settings?.store_logo_url ? [settings.store_logo_url] : [],
    "@id": baseUrl,
    "url": baseUrl,
    "telephone": settings?.store_phone || "+91 8445812526",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Babarpur Phaphund Road, Shastri Nagar",
      "addressLocality": "Babarpur Ajitmal",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "206121",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.6200, // Placeholder
      "longitude": 79.2800 // Placeholder
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "22:00"
    },
    "sameAs": [
      settings?.instagram_link,
      settings?.whatsapp_link
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solankivastrabhandar.com';
  
  try {
    const res = await fetch(`${API_URL}/api/settings/public`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const settings = data.settings || {};
      const storeName = "Solanki Vastra Bhandar";
      const logoUrl = settings.store_logo_url || "/favicon.ico";

      return {
        metadataBase: new URL(baseUrl),
        title: {
          default: `${storeName} | Premium Designer Sarees Online`,
          template: `%s | ${storeName}`,
        },
        description: `Discover exquisite designer sarees at ${storeName}. Shop premium silk, organza, chiffon & cotton sarees with free shipping.`,
        keywords: "designer sarees, silk sarees, premium sarees online, wedding sarees, party wear sarees, cotton sarees",
        alternates: {
          canonical: '/',
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
        icons: {
          icon: logoUrl,
          apple: logoUrl,
        },
        openGraph: {
          title: `${storeName} | Premium Designer Sarees Online`,
          description: `Discover exquisite designer sarees at ${storeName}. Premium collection with free shipping.`,
          url: baseUrl,
          siteName: storeName,
          locale: 'en_IN',
          type: "website",
          images: [
            {
              url: logoUrl,
              width: 800,
              height: 600,
              alt: storeName,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${storeName} | Premium Designer Sarees Online`,
          description: `Discover exquisite designer sarees at ${storeName}. Premium collection with free shipping.`,
          images: [logoUrl],
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch metadata", error);
  }

  return {
    metadataBase: new URL(baseUrl),
    title: "Solanki Vastra Bhandar | Premium Designer Sarees Online",
    description: "Discover exquisite designer sarees at Solanki Vastra Bhandar. Shop premium silk, organza, chiffon & cotton sarees with free shipping.",
    alternates: {
      canonical: '/',
    },
  };
}

import NextTopLoader from 'nextjs-toploader';
import MaintenanceOverlay from '@/components/layout/MaintenanceOverlay';
import WebsiteSchema from '@/components/seo/WebsiteSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isMaintenance = false;
  let logoUrl = "/favicon.ico";
  let settingsData = null;

  try {
    const API_URL = "https://fashion-hub-backend-13eb.onrender.com";
    const res = await fetch(`${API_URL}/api/settings/public`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      settingsData = data.settings;
      isMaintenance = settingsData?.maintenance_mode === "true";
      logoUrl = settingsData?.store_logo_url || "/favicon.ico";
    }
  } catch (e) {}

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <WebsiteSchema />
        <LocalBusinessSchema settings={settingsData} />
      </head>
      <body className="font-body antialiased">
        <NextTopLoader color="#C5A47E" showSpinner={false} />
        <MaintenanceOverlay isMaintenance={isMaintenance} logoUrl={logoUrl}>
          <Providers>{children}</Providers>
        </MaintenanceOverlay>
      </body>
    </html>
  );
}


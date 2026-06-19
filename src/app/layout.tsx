import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/api/settings/public`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const settings = data.settings || {};
      const storeName = "Solanki Vastra Bhandar";
      const logoUrl = settings.store_logo_url || "/favicon.ico";

      return {
        title: `${storeName} | Premium Designer Sarees Online`,
        description: `Discover exquisite designer sarees at ${storeName}. Shop premium silk, organza, chiffon & cotton sarees with free shipping.`,
        keywords: "designer sarees, silk sarees, premium sarees online, wedding sarees, party wear sarees, cotton sarees",
        icons: {
          icon: logoUrl,
          apple: logoUrl,
        },
        openGraph: {
          title: `${storeName} | Premium Designer Sarees Online`,
          description: `Discover exquisite designer sarees at ${storeName}. Premium collection with free shipping.`,
          type: "website",
          siteName: storeName,
          images: [
            {
              url: logoUrl,
              width: 800,
              height: 600,
              alt: storeName,
            },
          ],
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch metadata", error);
  }

  return {
    title: "Solanki Vastra Bhandar | Premium Designer Sarees Online",
    description: "Discover exquisite designer sarees at Solanki Vastra Bhandar. Shop premium silk, organza, chiffon & cotton sarees with free shipping.",
  };
}

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body antialiased">
        <NextTopLoader color="#C5A47E" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


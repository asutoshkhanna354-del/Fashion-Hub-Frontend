import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Aditi Fashion Hub | Premium Designer Sarees Online",
  description:
    "Discover exquisite designer sarees at Aditi Fashion Hub. Shop premium silk, organza, chiffon & cotton sarees with free shipping. Authentic handpicked collection for every occasion.",
  keywords:
    "designer sarees, silk sarees, premium sarees online, wedding sarees, party wear sarees, cotton sarees, organza sarees, indian fashion",
  openGraph: {
    title: "Aditi Fashion Hub | Premium Designer Sarees Online",
    description:
      "Discover exquisite designer sarees at Aditi Fashion Hub. Premium silk, organza, chiffon & cotton sarees with free shipping.",
    type: "website",
    locale: "en_IN",
    siteName: "Aditi Fashion Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditi Fashion Hub | Premium Designer Sarees Online",
    description:
      "Discover exquisite designer sarees at Aditi Fashion Hub. Premium collection with free shipping.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

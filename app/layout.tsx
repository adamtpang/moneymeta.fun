import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans-var",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moneymeta.fun"),
  title: "moneymeta.fun, the best money deck to play in life",
  description:
    "The Vicious Syndicate of moneymaking. Every way to make money ranked S to D by median income, growth, and how fast you can start. Public, verifiable data only.",
  keywords: [
    "market cap",
    "tier list",
    "wealth",
    "income",
    "meta report",
    "asset allocation",
    "bitcoin",
    "gold",
    "BLS",
  ],
  openGraph: {
    title: "moneymeta.fun, the best money deck to play in life",
    description:
      "Every way to make money, ranked S to D by the data. The Vicious Syndicate meta report for moneymaking.",
    url: "https://moneymeta.fun",
    siteName: "moneymeta.fun",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "moneymeta.fun, the best money deck to play in life",
    description: "Every way to make money, ranked S to D by the data.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070a0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`}>
      <body>
        <div className="atmosphere" aria-hidden />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

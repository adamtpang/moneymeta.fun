import type { Metadata, Viewport } from "next";
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
  title: "moneymeta.fun, the capitalism meta report",
  description:
    "A data-driven tier list of wealth vehicles and income paths, ranked by a meta score from public, verifiable data. What's strong right now, what's rising, where to walk.",
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
    title: "moneymeta.fun, the capitalism meta report",
    description:
      "Wealth vehicles and income paths ranked S to D by the data. Every number traces to a public source.",
    url: "https://moneymeta.fun",
    siteName: "moneymeta.fun",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "moneymeta.fun, the capitalism meta report",
    description: "Wealth and income, ranked S to D by the data.",
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
      </body>
    </html>
  );
}

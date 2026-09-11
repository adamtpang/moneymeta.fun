import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import Script from "next/script";

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
    "The Vicious Syndicate of moneymaking. Every way to make money ranked S to D by income, win rate, growth, and how fast you can start. Public, verifiable data only.",
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
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "moneymeta.fun",
  url: "https://moneymeta.fun",
  description:
    "The Vicious Syndicate of moneymaking. Every way to make money ranked S to D by income, win rate, growth, and how fast you can start. Public, verifiable data only.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`}>
      <body>
        <Script id="posthog-fleet" strategy="afterInteractive">{`(function(){if(window.__posthogFleet)return;window.__posthogFleet=1;var s=document.createElement('script');s.async=true;s.src='https://us-assets.i.posthog.com/static/array.js';s.onload=function(){if(!window.posthog||!window.posthog.init)return;window.posthog.init('phc_FCpCP9mIsb9IcxpX0Qqi6FmJ48sVvscAYIrZmtRHIq4',{api_host:'https://us.i.posthog.com',person_profiles:'identified_only',capture_pageview:'history_change',capture_pageleave:true,autocapture:false,disable_session_recording:true,disable_surveys:true,loaded:function(p){p.register({site:location.hostname})}});};document.head.appendChild(s);})();`}</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="atmosphere" aria-hidden />
        {children}
      </body>
    </html>
  );
}

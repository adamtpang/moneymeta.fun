import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://moneymeta.fun"),
  title: "moneymeta.fun — the capitalism meta report",
  description:
    "A data-driven tier list of wealth vehicles, ranked by a meta score from public market-cap data. What's strong right now, what's rising, what's falling.",
  keywords: [
    "market cap",
    "tier list",
    "wealth",
    "meta report",
    "asset allocation",
    "bitcoin",
    "gold",
    "equities",
  ],
  openGraph: {
    title: "moneymeta.fun — the capitalism meta report",
    description:
      "Wealth vehicles ranked S→D by market cap × momentum. Every number traces to a public source.",
    url: "https://moneymeta.fun",
    siteName: "moneymeta.fun",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "moneymeta.fun — the capitalism meta report",
    description:
      "Wealth vehicles ranked S→D by market cap × momentum.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

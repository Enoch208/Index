import type { Metadata } from "next";
import { Poppins, Geist, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { DashboardProviders } from "@/components/dashboard/providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://index.app";
const TITLE = "index — the agent layer for collectibles";
const TITLE_TEMPLATE = "%s — index";
const OG_DESC =
  "index turns Renaiss listings, pack odds, and on-chain proofs into tools any AI agent can use — value a vault, catch mispriced cards, verify pool fairness, and run rip-or-buy EV. Probability and pricing math, not financial advice.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: TITLE_TEMPLATE,
  },
  description: OG_DESC,
  applicationName: "index",
  authors: [{ name: "index" }],
  creator: "index",
  publisher: "index",
  category: "technology",
  keywords: [
    "index",
    "collectibles agent",
    "AI collectibles",
    "Renaiss",
    "graded cards",
    "PSA",
    "BGS",
    "card valuation",
    "MCP server",
    "Model Context Protocol",
    "pack odds",
    "gacha EV",
    "Merkle proof",
    "on-chain verification",
    "BNB Chain",
    "agentic commerce",
    "collector economy",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "index",
    url: SITE_URL,
    locale: "en_US",
    title: TITLE,
    description: OG_DESC,
    images: [{ url: "/og_social.png", width: 1731, height: 909, alt: "index — the agent layer for collectibles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: OG_DESC,
    images: ["/og_social.png"],
  },
};

// Structured data so search engines render index as a recognised software product.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "index",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: OG_DESC,
  image: `${SITE_URL}/og_social.png`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: {
    "@type": "Organization",
    name: "index",
    url: SITE_URL,
    logo: `${SITE_URL}/index-logo.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", poppins.variable, "font-sans", geist.variable, inter.variable)}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* Wallet + react-query context is global so the landing page can connect
            and the connection persists into /dashboard and /onboarding without a
            provider remount. */}
        <DashboardProviders>
          <SmoothScroll>{children}</SmoothScroll>
        </DashboardProviders>
      </body>
    </html>
  );
}

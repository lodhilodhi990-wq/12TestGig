import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://12-test-gig.vercel.app"),
  title: {
    default: "12 Test Gig | Google Play 20-Tester & App Testing Hub",
    template: "%s | 12 Test Gig"
  },
  description: "Get 20 certified testers for Google Play closed testing tracks in 14 days, test new Android apps to earn daily coins, and make passive income with our high-paying affiliate partner network.",
  keywords: [
    "Google Play closed testing",
    "20 testers 14 days Google Play",
    "Android app testing",
    "Earn money testing apps",
    "Google Play Console testing requirement",
    "Affiliate commission testing",
    "12 Test Gig",
    "App testing Pakistan",
    "Easypaisa JazzCash payout"
  ],
  authors: [{ name: "12 Test Gig Team", url: "https://12-test-gig.vercel.app" }],
  creator: "12 Test Gig",
  publisher: "12 Test Gig",
  applicationName: "12 Test Gig",
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://12-test-gig.vercel.app",
    siteName: "12 Test Gig",
    title: "12 Test Gig | #1 Google Play 20-Tester & App Testing Platform",
    description: "Launch your Android app with 20 verified testers or earn money by testing apps daily. Direct payouts via Easypaisa, JazzCash, Bank, Payoneer.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "12 Test Gig Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "12 Test Gig | Google Play 20-Tester Hub",
    description: "Get 20 testers for 14 days or earn coins testing apps.",
    images: ["/icon.svg"],
    creator: "@12TestGig",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://12-test-gig.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "12 Test Gig",
  "operatingSystem": "Android, Web",
  "applicationCategory": "DeveloperApplication, BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1250"
  },
  "description": "The ultimate Google Play 20-tester closed testing and tester recruitment platform with lifetime affiliate partner commissions."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

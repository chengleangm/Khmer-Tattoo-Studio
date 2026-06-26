import type { Metadata } from "next";
import { Bebas_Neue, Inter, Kantumruy_Pro, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { contactDetails } from "@/data/site";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kantumruy = Kantumruy_Pro({
  subsets: ["khmer"],
  weight: ["300", "400", "700"],
  variable: "--font-kantumruy",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.khmerbamboosakyant.com"),
  title: {
    default: "Khmer Bamboo Sakyant | Khmer Tattoo & Sak Yant Studio in Siem Reap",
    template: "%s | Khmer Bamboo Sakyant",
  },
  description:
    "Khmer Bamboo Sakyant is a Siem Reap tattoo studio for Khmer Sakyant, Sak Yant, Abstract Khmer tattoo design, sacred yantra work, and custom meaningful tattoos in Cambodia.",
  keywords: [
    "Khmer tattoo",
    "Sak Yant",
    "Sak Yant Cambodia",
    "Sak Yant Siem Reap",
    "Khmer Sakyant",
    "Khmer Bamboo Sakyant",
    "Cambodia tattoo studio",
    "Siem Reap tattoo",
    "yantra tattoo",
    "traditional Khmer tattoo",
    "Abstract Khmer tattoo",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/logo/logobamboo.png",
        type: "image/png",
      },
    ],
    shortcut: "/logo/logobamboo.png",
    apple: "/logo/logobamboo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Khmer Bamboo Sakyant",
    title: "Khmer Bamboo Sakyant | Khmer Tattoo & Sak Yant Studio in Siem Reap",
    description:
      "Khmer Sakyant, Sak Yant, Abstract Khmer tattoo design, sacred yantra work, and custom meaningful tattoos in Siem Reap, Cambodia.",
    url: "/",
    images: [
      {
        url: "/gallery/photo_2026-06-26_11-16-00.jpg",
        width: 960,
        height: 1280,
        alt: "Full back Sak Yant Khmer tattoo by Khmer Bamboo Sakyant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khmer Bamboo Sakyant | Khmer Tattoo & Sak Yant Studio in Siem Reap",
    description:
      "Khmer Sakyant, Sak Yant, Abstract Khmer tattoo design, sacred yantra work, and custom meaningful tattoos in Cambodia.",
    images: ["/gallery/photo_2026-06-26_11-16-00.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.khmerbamboosakyant.com";
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: "Khmer Bamboo Sakyant",
    alternateName: ["Khmer Tattoo Studio", "Khmer Sakyant", "Bamboo Sakyant"],
    url: siteUrl,
    image: `${siteUrl}/gallery/photo_2026-06-26_11-16-00.jpg`,
    logo: `${siteUrl}/logo/logobamboo.png`,
    description:
      "Khmer Bamboo Sakyant is a tattoo studio in Siem Reap, Cambodia, focused on Khmer Sakyant, Sak Yant, Abstract Khmer tattoo design, sacred yantra work, and custom meaningful tattoos.",
    telephone: `+855${contactDetails.phonePrimary.slice(1)}`,
    email: contactDetails.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Siem Reap",
      addressCountry: "KH",
    },
    areaServed: ["Siem Reap", "Cambodia"],
    priceRange: "$$",
    sameAs: [
      contactDetails.facebookHref,
      contactDetails.instagramHref,
      contactDetails.telegramHref,
      contactDetails.whatsappHref,
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "11:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "12:00",
        closes: "19:00",
      },
    ],
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Khmer Sakyant Design" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sak Yant Tattoo" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Abstract Khmer Tattoo" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Free Sakyant Consultation" }, price: "0", priceCurrency: "USD" },
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className={`${bebas.variable} ${oswald.variable} ${inter.variable} ${kantumruy.variable} font-sans antialiased`}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

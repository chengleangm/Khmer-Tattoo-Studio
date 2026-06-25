import type { Metadata } from "next";
import { Bebas_Neue, Inter, Kantumruy_Pro, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
  title: "Khmer Bamboo Sakyant",
  description:
    "Khmer Sakyant, Abstract Khmer, and selected Japanese-inspired tattoo work in Siem Reap, Cambodia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
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

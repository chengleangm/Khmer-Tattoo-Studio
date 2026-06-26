import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Sak Yant Cambodia tattoo work, Khmer Sakyant designs, and abstract Khmer blackwork from Khmer Bamboo Sakyant in Siem Reap.",
  alternates: { canonical: "https://www.khmerbamboosakyant.com/gallery" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artists",
  description:
    "Meet the artists at Khmer Bamboo Sakyant — Siem Reap's traditional Khmer tattoo studio specialising in bamboo Sakyant and sacred Sak Yant Cambodia work.",
  alternates: { canonical: "/artists" },
};

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

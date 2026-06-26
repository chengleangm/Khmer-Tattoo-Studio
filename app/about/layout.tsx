import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind Khmer Bamboo Sakyant — a Khmer Sakyant tattoo studio in Siem Reap dedicated to sacred Buddhist tattoo Cambodia traditions and authentic Khmer tattoo Siem Reap craftsmanship.",
  alternates: { canonical: "https://www.khmerbamboosakyant.com/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

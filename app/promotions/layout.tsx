import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tattoo Promotions | Khmer Bamboo Sakyant",
  description: "See current tattoo promotions, packages, and limited offers from Khmer Bamboo Sakyant in Siem Reap.",
};

export default function PromotionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

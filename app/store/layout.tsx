import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Store — Khmer Bamboo Sakyant",
  description:
    "Studio merchandise, aftercare kits, Sakyant art prints, and gift vouchers from Khmer Bamboo Sakyant in Siem Reap. Order via WhatsApp or Telegram.",
  alternates: { canonical: "https://www.khmerbamboosakyant.com/store" },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

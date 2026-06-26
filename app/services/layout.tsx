import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Sak Yant Cambodia designs, bamboo Sakyant Siem Reap consultations, traditional Khmer tattoo planning, abstract Khmer blackwork, and custom sacred placement — all in Siem Reap.",
  alternates: { canonical: "https://www.khmerbamboosakyant.com/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

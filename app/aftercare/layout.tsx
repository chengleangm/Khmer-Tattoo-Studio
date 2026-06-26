import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aftercare",
  description:
    "Aftercare instructions for your Khmer Sakyant tattoo, bamboo Sakyant Siem Reap session, or traditional Khmer tattoo from Khmer Bamboo Sakyant.",
  alternates: { canonical: "https://www.khmerbamboosakyant.com/aftercare" },
};

export default function AftercareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

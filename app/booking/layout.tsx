import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Sak Yant Tattoo — Siem Reap Cambodia",
  description:
    "Book your Sak Yant Cambodia tattoo appointment or bamboo Sakyant Siem Reap consultation at Khmer Bamboo Sakyant. Free consultations available.",
  alternates: { canonical: "https://www.khmerbamboosakyant.com/booking" },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

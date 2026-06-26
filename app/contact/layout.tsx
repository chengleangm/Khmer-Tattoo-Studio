import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Khmer Bamboo Sakyant — your Khmer tattoo Siem Reap studio. Reach us via WhatsApp, Telegram, or the contact form.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, Send } from "lucide-react";
import Button from "@/components/Button";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactDetails } from "@/data/site";
import { t } from "@/data/translations";

function wrapLatinWords(text: string) {
  const parts = text.split(/([a-zA-Z][\w-]*)/g);
  if (parts.length <= 1) return text;
  return parts.map((part, i) =>
    /^[a-zA-Z]/.test(part) ? <span key={i} lang="en">{part}</span> : part
  );
}

const socialLinks = [
  { Icon: WhatsAppIcon, href: contactDetails.whatsappHref, label: "WhatsApp" },
  { Icon: Send, href: contactDetails.telegramHref, label: "Telegram" },
  { Icon: Facebook, href: contactDetails.facebookHref, label: "Facebook" },
  { Icon: Instagram, href: contactDetails.instagramHref, label: "Instagram" },
  { Icon: Mail, href: `mailto:${contactDetails.email}`, label: "Email" },
];

export default function Footer() {
  const { lang } = useLanguage();
  const text = t[lang].footer;
  const nav = t[lang].nav;

  return (
    <footer className="grain bg-ink px-4 py-8 text-white sm:px-5 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 bg-teal p-4 sm:p-5 md:flex md:items-center md:justify-between md:px-6">
          <p className="footer-tagline max-w-[18rem] break-words font-display text-[1.85rem] leading-[0.9] sm:max-w-xl sm:text-5xl">
            {text.tagline}
          </p>
          <Button href="/booking" variant="light" className="mt-5 w-full px-4 py-3 text-xs sm:w-auto sm:text-sm md:mt-0">
            {t[lang].common.bookNow}
          </Button>
        </div>

        <div className="grid gap-7 border-t border-white/10 pt-7 sm:grid-cols-2 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:gap-8 md:pt-8">
          <div className="sm:col-span-2 md:col-span-1">
            <p lang="en" className="logo-brand max-w-[18rem] font-display text-[clamp(3rem,18vw,5.5rem)] leading-[0.78] text-white md:max-w-none lg:text-[clamp(4.5rem,13vw,12rem)]">
              KHMER SAKYANT
            </p>
            <p lang={lang === "en" ? "en" : undefined} className="mt-3 font-condensed text-xs uppercase tracking-editorial text-white/60 md:mt-4 md:text-sm">
              {text.brandName}
            </p>
          </div>

          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal md:text-sm">
              {text.explore}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-condensed text-xs uppercase tracking-editorial text-white/70 sm:grid-cols-1 md:mt-4 md:text-sm">
              <Link href="/gallery" className="hover:text-white">{nav.gallery}</Link>
              <Link href="/artists" className="hover:text-white">{nav.artists}</Link>
              <Link href="/reviews" className="hover:text-white">{nav.reviews}</Link>
              <Link href="/aftercare" className="hover:text-white">{nav.aftercare}</Link>
              <Link href="/booking" className="hover:text-white">{nav.booking}</Link>
            </div>
          </div>

          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal md:text-sm">
              {text.social}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 md:mt-4 md:gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 transition hover:border-teal hover:bg-teal sm:h-10 sm:w-10"
                >
                  <Icon className="h-4 w-4 sm:h-[17px] sm:w-[17px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-center md:mt-8 md:justify-end">
          <Image
            src="/logo/logobamboocircle.png"
            alt="Khmer Bamboo Sakyant logo"
            width={1080}
            height={1080}
            className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:h-20 sm:w-20"
          />
        </div>

        <p className="mt-5 border-t border-white/10 pt-5 text-center font-condensed text-[0.68rem] uppercase leading-5 tracking-[0.18em] text-white/45 md:text-left md:text-xs md:tracking-editorial">
          {wrapLatinWords(text.copyright)}
        </p>
      </div>
    </footer>
  );
}

"use client";

import ContactForm from "@/components/ContactForm";
import SectionTitle from "@/components/SectionTitle";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

export default function ContactPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const c = tx.contact;

  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={c.pageTitle} kicker={tx.kicker} light />
        </div>
      </section>

      <section className="editorial-section px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-28" data-bg-word="CONTACT">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          <aside className="bg-ink p-4 text-white sm:p-6 md:p-8">
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">{c.location}</p>
            <h2 className="mt-3 font-display text-[clamp(3rem,14vw,4.75rem)] leading-[0.85] lg:mt-4 lg:text-7xl">
              {c.visitStudio}
            </h2>
            <div className="mt-5 grid gap-3 text-xs leading-5 text-white/70 sm:mt-8 sm:gap-4 sm:text-sm">
              <p>{c.address}</p>
              <p className="flex items-center gap-2"><Phone className="shrink-0" size={15} /> +855 12 345 678</p>
              <p className="flex items-center gap-2 break-all"><Mail className="shrink-0" size={15} /> hello@khmertattoostudio.com</p>
            </div>
            <div className="mt-5 flex gap-2 sm:mt-8 sm:gap-3">
              {[Instagram, Facebook, Mail].map((Icon, index) => (
                <a key={index} href="#contact-form" aria-label="Social media link" className="flex h-10 w-10 items-center justify-center border border-white/20 transition hover:border-teal hover:bg-teal sm:h-11 sm:w-11">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </aside>

          <div id="contact-form" className="grid gap-4 sm:gap-5">
            <ContactForm />
            <div className="flex min-h-40 items-center justify-center border border-ink/10 bg-white sm:min-h-72">
              <p className="font-display text-[2.75rem] leading-none text-ink/15 sm:text-6xl">{c.mapPlaceholder}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

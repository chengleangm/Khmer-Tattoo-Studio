"use client";

import ContactForm from "@/components/ContactForm";
import SectionTitle from "@/components/SectionTitle";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Facebook, Mail, Phone, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactDetails } from "@/data/site";
import { t } from "@/data/translations";

const socialLinks = [
  { Icon: WhatsAppIcon, href: contactDetails.whatsappHref, label: "WhatsApp" },
  { Icon: Send, href: contactDetails.telegramHref, label: "Telegram" },
  { Icon: Facebook, href: contactDetails.facebookHref, label: "Facebook" },
  { Icon: Mail, href: `mailto:${contactDetails.email}`, label: "Email" },
];

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
              <p className="flex items-center gap-2">
                <Phone className="shrink-0" size={15} />
                <a href={`tel:${contactDetails.phonePrimary}`} className="hover:text-white">{contactDetails.phonePrimary}</a>
                <span>/</span>
                <a href={`tel:${contactDetails.phoneSecondary}`} className="hover:text-white">{contactDetails.phoneSecondary}</a>
              </p>
              <p className="flex items-center gap-2">
                <WhatsAppIcon size={15} />
                <a
                  href={contactDetails.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp {contactDetails.phonePrimaryDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2 break-all"><Mail className="shrink-0" size={15} /> {contactDetails.email}</p>
            </div>
            <div className="mt-5 flex gap-2 sm:mt-8 sm:gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center border border-white/20 transition hover:border-teal hover:bg-teal sm:h-11 sm:w-11"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </aside>

          <div id="contact-form" className="grid gap-4 sm:gap-5">
            <ContactForm />
            <div className="min-h-64 overflow-hidden border border-ink/10 bg-white sm:min-h-80">
              <iframe
                title="Khmer Bamboo Sakyant location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4604.827883633229!2d103.85196903702585!3d13.349878938472871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311017004fae8c41%3A0xe7fdb3c4b2a06112!2sKhmer%20Tattoo%20studio!5e1!3m2!1sen!2skh!4v1782291823091!5m2!1sen!2skh"
                className="h-64 w-full sm:h-80"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

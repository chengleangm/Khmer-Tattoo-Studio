"use client";

import BookingForm from "@/components/BookingForm";
import SectionTitle from "@/components/SectionTitle";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactDetails } from "@/data/site";
import { t } from "@/data/translations";
import { CalendarDays, Clock, Mail, Phone } from "lucide-react";

export default function BookingPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const b = tx.booking;

  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={b.pageTitle} kicker={tx.kicker} light />
        </div>
      </section>

      <section className="editorial-section overflow-x-hidden px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-28" data-bg-word="BOOK">
        <div className="mx-auto grid w-full max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div className="w-full max-w-full overflow-hidden bg-bone p-3 sm:p-5 md:p-8">
            <BookingForm />
          </div>
          <aside className="w-full max-w-full overflow-hidden bg-ink p-4 text-white sm:p-6 md:p-8">
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">{b.studioInfo}</p>
            <h2 className="booking-hours-title mt-3 max-w-sm font-display text-[clamp(3rem,14vw,4.75rem)] leading-[0.85] lg:text-7xl">
              {b.studioHours}
            </h2>
            <div className="mt-5 grid gap-3 text-xs leading-5 text-white/70 sm:mt-8 sm:gap-5 sm:text-sm sm:leading-6">
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 shrink-0 text-teal" size={17} />
                <span><strong className="font-condensed uppercase tracking-editorial text-white">{b.monFri}</strong> 11:00 AM - 8:00 PM</span>
              </p>
              <p className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 shrink-0 text-teal" size={17} />
                <span><strong className="font-condensed uppercase tracking-editorial text-white">{b.saturday}</strong> 12:00 PM - 7:00 PM</span>
              </p>
              <p className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 shrink-0 text-teal" size={17} />
                <span><strong className="font-condensed uppercase tracking-editorial text-white">{b.sunday}</strong> {b.consultOnly}</span>
              </p>
              <p className="flex items-start gap-3">
                <Phone className="mt-0.5 shrink-0 text-teal" size={17} />
                <span>
                  <strong className="font-condensed uppercase tracking-editorial text-white">{b.phone}</strong>{" "}
                  <a href={`tel:${contactDetails.phonePrimary}`} className="hover:text-white">{contactDetails.phonePrimary}</a>
                  {" / "}
                  <a href={`tel:${contactDetails.phoneSecondary}`} className="hover:text-white">{contactDetails.phoneSecondary}</a>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-teal">
                  <WhatsAppIcon size={17} />
                </span>
                <a
                  href={contactDetails.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp {contactDetails.phonePrimaryDisplay}
                </a>
              </p>
              <p className="flex items-start gap-3">
                <Mail className="mt-0.5 shrink-0 text-teal" size={17} />
                <span><strong className="font-condensed uppercase tracking-editorial text-white">{b.email}</strong> {contactDetails.email}</span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

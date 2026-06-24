"use client";

import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

export default function ServicesPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const s = tx.services;

  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={s.pageTitle} kicker={tx.kicker} light />
          <p className="mx-auto mt-6 hidden max-w-2xl text-center text-sm leading-6 text-white/60 sm:block">
            {s.pageDesc}
          </p>
        </div>
      </section>

      <section className="editorial-section px-5 py-14 lg:px-8 lg:py-28" data-bg-word="SERVICE">
        <div className="grid w-full grid-cols-2 gap-3 md:mx-auto md:max-w-7xl md:gap-5 lg:grid-cols-3">
          {s.list.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={s.processTitle} kicker={tx.kicker} />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
            {s.steps.map((step) => (
              <article key={step.number} className="min-w-0 border-t-[3px] border-ink bg-bone p-3 sm:border-t-4 sm:p-5">
                <p className="font-display text-4xl leading-none text-teal sm:text-7xl">{step.number}</p>
                <h3 className="mt-2 break-words font-display text-[1.35rem] leading-[0.95] [overflow-wrap:anywhere] sm:mt-4 sm:text-5xl sm:leading-none">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.68rem] leading-5 text-ink/65 sm:mt-4 sm:text-sm sm:leading-6">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";
import { Brush, Compass, Feather, Flame, Flower2, Layers, MessageCircle, PenTool, Shield, ShieldCheck, Sparkles } from "lucide-react";

const serviceIcons = [Shield, Sparkles, Flower2, Compass, Layers, Brush];
const stepIcons = [MessageCircle, PenTool, Feather, Flame, ShieldCheck];

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
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
            Our services cover Khmer tattoo Siem Reap appointments, Sak Yant Cambodia designs,
            Khmer Sakyant tattoo planning, Bamboo Sakyant Siem Reap consultations, abstract Khmer
            blackwork, cover-up strategy, and custom sacred placement.
          </p>
        </div>
      </section>

      <section className="editorial-section px-4 py-10 sm:px-5 sm:py-14 lg:px-8 lg:py-28" data-bg-word="SERVICE">
        <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:mx-auto md:max-w-7xl md:gap-5 lg:grid-cols-3">
          {s.list.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              Icon={serviceIcons[index] ?? Brush}
              index={index}
              featured={index === s.list.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={s.processTitle} kicker={tx.kicker} />
          <div className="mt-6 grid auto-rows-fr gap-2.5 sm:mt-12 sm:gap-4 min-[700px]:grid-cols-5 min-[700px]:gap-2 lg:gap-4">
            {s.steps.map((step, index) => {
              const Icon = stepIcons[index] ?? Brush;
              return (
                <article
                  key={step.number}
                  className="grid h-full min-w-0 grid-cols-[2.75rem_1fr] gap-3 overflow-hidden border-t-2 border-ink bg-bone p-3 sm:border-t-4 sm:p-5 min-[700px]:block min-[700px]:p-3 lg:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink min-[700px]:mb-4 min-[700px]:h-11 min-[700px]:w-11 min-[700px]:rounded-2xl lg:h-16 lg:w-16">
                    <Icon className="h-5 w-5 text-teal min-[700px]:h-5 min-[700px]:w-5 lg:h-7 lg:w-7" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-2xl leading-none text-teal min-[700px]:text-3xl lg:text-5xl">{step.number}</p>
                    <h3 className="mt-1 break-words font-display text-[1.2rem] leading-none [overflow-wrap:anywhere] min-[700px]:mt-3 min-[700px]:text-[1.25rem] lg:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.72rem] leading-5 text-ink/65 min-[700px]:mt-4 min-[700px]:text-[0.68rem] min-[700px]:leading-5 lg:text-sm lg:leading-6">{step.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

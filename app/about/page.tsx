"use client";

import Button from "@/components/Button";
import ImageCard from "@/components/ImageCard";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

export default function AboutPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const a = tx.about;

  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={a.pageTitle} kicker={tx.kicker} light />
        </div>
      </section>

      <section className="editorial-section px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-28" data-bg-word="KHMER">
        <div className="mx-auto grid max-w-7xl gap-6 sm:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <ImageCard src="/images/about-studio-work.jpg" alt="Khmer Sakyant tattoo artistry in Cambodia" className="h-[300px] sm:h-[460px] lg:h-[620px]" />
          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">{a.ourStory}</p>
            <h2 className="mt-3 max-w-[21rem] font-display text-[clamp(2.8rem,12vw,4.25rem)] leading-[0.82] sm:mt-4 sm:max-w-none sm:text-[clamp(4rem,9vw,8rem)]">
              <span className="km-title-text">{a.heading}</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink/70 sm:mt-6 sm:text-base sm:leading-7">{a.desc}</p>
            <div className="mt-5 border-l-[3px] border-teal pl-4 sm:mt-8 sm:border-l-4 sm:pl-5">
              <h3 className="font-display text-4xl leading-none sm:text-5xl">{a.mission}</h3>
              <p className="mt-2 text-xs leading-5 text-ink/65 sm:mt-3 sm:text-sm sm:leading-6">{a.missionDesc}</p>
            </div>
            <Button href="/booking" variant="dark" className="mt-5 px-4 py-3 text-xs sm:mt-8 sm:text-sm">
              {tx.common.bookConsultation}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={a.whyChooseUs} kicker={tx.kicker} />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 md:grid-cols-5">
            {a.reasons.map((reason) => (
              <div
                key={reason}
                className="flex min-h-20 items-center justify-center border border-ink bg-bone px-3 py-4 text-center font-display text-[1.55rem] leading-none transition hover:bg-teal hover:text-white sm:min-h-24 sm:px-4 sm:py-5 sm:text-4xl"
              >
                {reason}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

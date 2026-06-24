"use client";

import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

export default function AftercarePage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const a = tx.aftercare;

  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={a.pageTitle} kicker={tx.kicker} light />
          <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-white/60 sm:mt-6 sm:text-sm sm:leading-6">
            {a.pageDesc}
          </p>
        </div>
      </section>

      <section className="editorial-section px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-28" data-bg-word="CARE">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {a.steps.map((step, index) => (
              <article key={index} className="min-w-0 border border-ink/10 bg-bone p-3 sm:p-5">
                <p className="font-display text-4xl leading-none text-teal sm:text-7xl">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-[0.68rem] leading-5 text-ink/70 sm:mt-4 sm:text-sm sm:leading-6">{step}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-5 md:grid-cols-2">
            <div className="bg-ink p-4 text-white sm:p-6">
              <h2 className="font-display text-5xl leading-none sm:text-7xl">{a.do}</h2>
              <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3">
                {a.dos.map((item) => (
                  <p key={item} className="border border-white/15 px-3 py-2 font-condensed text-xs uppercase tracking-editorial sm:px-4 sm:py-3 sm:text-base">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-bone p-4 sm:p-6">
              <h2 className="font-display text-5xl leading-none sm:text-7xl">{a.dont}</h2>
              <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3">
                {a.donts.map((item) => (
                  <p key={item} className="border border-ink/15 px-3 py-2 font-condensed text-xs uppercase tracking-editorial sm:px-4 sm:py-3 sm:text-base">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border border-teal bg-white p-4 sm:mt-12 sm:p-6 md:flex md:items-center md:justify-between">
            <p className="max-w-2xl font-condensed text-sm uppercase leading-6 tracking-editorial text-ink/75 sm:text-2xl sm:leading-none">
              {a.warning}
            </p>
            <Button href="/contact" variant="teal" className="mt-4 px-4 py-3 text-xs sm:mt-5 sm:text-sm md:mt-0">
              {tx.common.contactStudio}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

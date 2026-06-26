"use client";

import Button from "@/components/Button";
import GalleryGrid from "@/components/GalleryGrid";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

export default function GalleryPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const g = tx.gallery;

  return (
    <main>
      <section className="grain bg-ink px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={g.pageTitle} kicker={tx.kicker} light />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-white/60">{g.pageDesc}</p>
        </div>
      </section>

      <section className="editorial-section px-5 py-20 lg:px-8 lg:py-28" data-bg-word="INK">
        <div className="mx-auto max-w-7xl">
          <GalleryGrid />
        </div>
      </section>

      <section className="grain bg-ink px-5 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-condensed text-xs uppercase tracking-[0.38em] text-teal sm:text-sm">
            {tx.kicker}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.8rem,10vw,7rem)] leading-[0.82]">
            {g.ctaTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
            {g.ctaDesc}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
            <Button href="/booking" variant="teal" className="px-6 py-3 text-sm sm:text-base">
              {g.ctaBook}
            </Button>
            <Button href="/contact" variant="outline" className="px-6 py-3 text-sm sm:text-base">
              {g.ctaContact}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

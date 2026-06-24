"use client";

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
    </main>
  );
}

"use client";

import ArtistCard from "@/components/ArtistCard";
import SectionTitle from "@/components/SectionTitle";
import { artists } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

export default function ArtistsPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const a = tx.artists;

  const translatedArtists = artists.map((artist, i) => ({
    ...artist,
    name: a.list[i]?.name ?? artist.name,
    specialty: a.list[i]?.specialty ?? artist.specialty,
    years: a.list[i]?.years ?? artist.years,
  }));

  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={a.pageTitle} kicker={tx.kicker} light />
          <p className="mx-auto mt-6 hidden max-w-2xl text-center text-sm leading-6 text-white/60 sm:block">
            {a.pageDesc}
          </p>
        </div>
      </section>

      <section className="editorial-section px-5 py-14 lg:px-8 lg:py-28" data-bg-word="ARTISTS">
        <div className="grid w-[min(350px,calc(100vw-2.5rem))] grid-cols-2 gap-3 overflow-hidden md:mx-auto md:w-full md:max-w-7xl md:gap-5 lg:grid-cols-4">
          {translatedArtists.map((artist) => (
            <ArtistCard key={artist.name} {...artist} viewWorksLabel={tx.common.viewWorks} />
          ))}
        </div>
      </section>
    </main>
  );
}

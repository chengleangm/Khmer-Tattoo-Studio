"use client";

import Image from "next/image";
import Button from "@/components/Button";
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
  const featuredArtist = translatedArtists[0];
  const specialtyHasKhmer = /[ក-៿]/.test(featuredArtist.specialty);

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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-10">
          <div className="relative aspect-square overflow-hidden bg-charcoal">
            <Image
              src={featuredArtist.image}
              alt={`${featuredArtist.name}, ${featuredArtist.specialty} artist`}
              fill
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
          <article className="border-t-[3px] border-ink pt-5 lg:border-t-4 lg:pt-8">
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">
              {a.pageTitle}
            </p>
            <h2 className="mt-3 font-display text-[clamp(4rem,18vw,9rem)] leading-[0.78]">
              {featuredArtist.name}
            </h2>
            <p
              lang={specialtyHasKhmer ? undefined : "en"}
              className="mt-4 font-condensed text-xl uppercase leading-tight tracking-editorial text-ink sm:text-3xl"
            >
              {featuredArtist.specialty}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/65 sm:max-w-md">
              {featuredArtist.years}
            </p>
            <p className="mt-5 text-sm leading-6 text-ink/65 sm:max-w-xl">
              {a.pageDesc}
            </p>
            <Button href="/gallery" variant="dark" className="mt-6">
              {tx.common.viewWorks}
            </Button>
          </article>
        </div>
      </section>
    </main>
  );
}

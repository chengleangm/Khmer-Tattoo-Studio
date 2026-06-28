"use client";

import Button from "@/components/Button";
import GalleryPreviewStrip from "@/components/GalleryPreviewStrip";
import ImageCard from "@/components/ImageCard";
import SectionTitle from "@/components/SectionTitle";
import TattooStyleShowcase from "@/components/TattooStyleShowcase";
import { galleryItems } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";
import Image from "next/image";
import heroArtwork1 from "../public/hero img/hero1.jpg";
import heroArtwork2 from "../public/hero img/hero2.jpg";
import sakyantArtwork1 from "../public/KHMER SAKYANT DESIGN section/photo_2026-06-28_18-24-16.jpg";
import sakyantArtwork2 from "../public/KHMER SAKYANT DESIGN section/photo_2026-06-28_18-24-21.jpg";
import sacredInkArtwork1 from "../public/SACRED KHMER INK section/photo_2026-06-28_18-42-34.jpg";
import sacredInkArtwork2 from "../public/SACRED KHMER INK section/photo_2026-06-28_18-46-33.jpg";
import sacredInkArtwork3 from "../public/SACRED KHMER INK section/photo_2026-06-28_18-46-39.jpg";

export default function Home() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const h = tx.home;

  return (
    <main>
      <section className="grain overflow-hidden bg-ink px-4 py-10 text-white sm:px-5 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 grid grid-cols-2 gap-2 border-b border-white/15 pb-4 font-condensed text-[0.58rem] uppercase leading-tight tracking-[0.18em] text-white/60 sm:mb-8 sm:pb-5 sm:tracking-editorial md:grid-cols-4 md:gap-4 md:text-xs">
            <p className="border border-white/10 px-2 py-2 md:border-0 md:p-0">{h.tag1}</p>
            <p className="border border-white/10 px-2 py-2 md:border-0 md:p-0">{h.tag2}</p>
            <p className="border border-white/10 px-2 py-2 md:border-0 md:p-0">{h.tag3}</p>
            <p className="border border-white/10 px-2 py-2 md:border-0 md:p-0 md:text-right">{h.tag4}</p>
          </div>

          <p className="text-center font-condensed text-xs uppercase tracking-[0.38em] text-white/70 sm:text-sm sm:tracking-[0.45em]">
            {tx.kicker}
          </p>
          <div className="relative mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-3 lg:min-h-[620px] lg:grid-cols-[1fr_1fr] lg:gap-6 lg:items-start">
            <ImageCard src={heroArtwork1} alt="Khmer Tattoo Studio hero artwork" className="h-[315px] sm:h-[430px] lg:h-[520px]" priority />
            <ImageCard src={heroArtwork2} alt="Khmer Tattoo Studio tattoo artwork" className="h-[315px] sm:h-[430px] lg:mt-10 lg:h-[520px]" priority />
            <div className="pointer-events-none absolute inset-x-0 top-[42%] z-10 translate-y-[-50%] lg:top-[43%]">
              <h1 className="flex justify-center">
                <Image
                  src="/logo/logobamboo.png"
                  alt={`${h.heroLine1} ${h.heroLine2}`}
                  width={406}
                  height={1080}
                  priority
                  className="h-[270px] w-auto [filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.8))_drop-shadow(0_0_14px_rgba(255,255,255,0.2))] sm:h-[380px] lg:h-[520px]"
                />
              </h1>
            </div>
            <div className="z-20 col-span-2 mt-1 justify-self-center lg:absolute lg:bottom-10 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2">
              <Button href="/booking" variant="light" className="px-4 py-3 text-xs sm:text-sm">
                {tx.common.bookAppointment}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone px-5 py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm leading-6 text-ink/70 sm:text-base sm:leading-7">
            Khmer Bamboo Sakyant is a Khmer tattoo Siem Reap studio for Sak Yant Cambodia work,
            Khmer Sakyant tattoo design, Bamboo Sakyant Siem Reap consultation, and custom sacred
            tattoo pieces shaped around meaning, placement, and body flow.
          </p>
        </div>
      </section>

      <section className="editorial-section px-5 py-14 lg:px-8 lg:py-28" data-bg-word="TATTOO">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-[0.75fr_1.25fr] lg:gap-8 lg:items-center">
          <div className="order-2 col-span-2 lg:order-1 lg:col-span-1">
            <div className="grid grid-cols-2 gap-3 lg:block">
              <ImageCard src={sakyantArtwork1} alt="Khmer Sakyant tattoo artwork" className="h-[240px] lg:h-[520px]" />
              <ImageCard src={sakyantArtwork2} alt="Khmer Sakyant tattoo detail" className="h-[240px] lg:hidden" />
            </div>
            <p className="mt-6 max-w-md text-sm leading-6 text-ink/65">{h.newDesc}</p>
            <Button href="/gallery" variant="dark" className="mt-5">{tx.common.viewMoreTattoo}</Button>
          </div>
          <div className="order-1 col-span-2 text-center lg:order-2 lg:col-span-1">
            <SectionTitle title={h.newTitle} kicker={tx.kicker} />
            <ImageCard src={sakyantArtwork2} alt="Khmer Sakyant tattoo detail" className="mx-auto mt-8 hidden h-[460px] max-w-xl lg:block" />
          </div>
        </div>
      </section>

      <TattooStyleShowcase />

      <section className="editorial-section px-5 py-14 lg:px-8 lg:py-28" data-bg-word="GALLERY">
        <div className="mx-auto max-w-7xl">
          <GalleryPreviewStrip items={galleryItems} />
          <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6 lg:items-end">
            <h2 className="font-display text-[clamp(3.5rem,14vw,12rem)] leading-[0.76]"><span className="km-title-text">{h.galleryTitle}</span></h2>
            <div>
              <p className="text-sm leading-6 text-ink/65">{h.galleryDesc}</p>
              <Button href="/gallery" variant="dark" className="mt-5">{tx.common.chooseArtist}</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section overflow-hidden bg-white px-4 py-10 sm:px-5 sm:py-12 lg:px-8 lg:py-20" data-bg-word="ART">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-5 lg:grid-cols-[0.95fr_0.58fr_0.9fr] lg:items-stretch lg:gap-6">
          <div className="order-3 grid grid-cols-2 gap-2 sm:gap-3 lg:order-first lg:grid-cols-1 lg:content-between">
            <ImageCard src={sacredInkArtwork1} alt="Sacred Khmer ink tattoo close up" className="h-[150px] sm:h-[240px] lg:h-[480px]" />
            <ImageCard src={sacredInkArtwork3} alt="Sacred Khmer ink tattoo detail" className="h-[150px] sm:h-[240px] lg:h-[180px]" />
          </div>

          <div className="order-1 flex flex-col justify-center gap-3 text-center sm:gap-4 lg:order-none lg:text-left">
            <h2 className="mx-auto max-w-[16rem] break-words font-display text-[clamp(2.45rem,12vw,4.25rem)] leading-[0.8] lg:mx-0 lg:max-w-none lg:text-[clamp(3.7rem,6vw,6.5rem)]">
              <span className="km-title-text">{h.eternalTitle}</span>
            </h2>
            <p className="mx-auto max-w-[18rem] font-condensed text-xs uppercase leading-5 tracking-editorial text-ink/70 sm:max-w-sm sm:text-base sm:leading-6 lg:mx-0">
              {h.yearsExp}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 lg:justify-start">
              <Button href="/booking" variant="dark" className="w-full px-2 py-2.5 text-[0.62rem] sm:w-auto sm:px-4 sm:text-xs">{tx.common.bookNow}</Button>
              <Button href="/artists" variant="outline" className="w-full px-2 py-2.5 text-[0.62rem] sm:w-auto sm:px-4 sm:text-xs">{tx.common.chooseArtist}</Button>
            </div>
          </div>

          <div className="order-2 grid gap-3 lg:order-none lg:content-center">
            <ImageCard src={sacredInkArtwork2} alt="Sacred Khmer ink tattoo artwork" className="h-[250px] sm:h-[340px] lg:h-[460px]" />
            <p className="mx-auto max-w-sm text-center text-xs leading-5 text-ink/65 sm:text-sm sm:leading-6 lg:mx-0 lg:max-w-sm lg:text-left">
              {h.eternalDesc}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

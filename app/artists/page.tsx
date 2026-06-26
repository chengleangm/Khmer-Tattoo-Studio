"use client";

import Image from "next/image";
import { Facebook, Instagram, Send } from "lucide-react";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { artists } from "@/data/site";
import { contactDetails } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

const socialLinks = [
  { Icon: WhatsAppIcon, href: contactDetails.whatsappHref, label: "WhatsApp" },
  { Icon: Send, href: contactDetails.telegramHref, label: "Telegram" },
  { Icon: Facebook, href: contactDetails.facebookHref, label: "Facebook" },
  { Icon: Instagram, href: contactDetails.instagramHref, label: "Instagram" },
];

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

      <section className="editorial-section px-4 py-10 sm:px-5 sm:py-14 lg:px-8 lg:py-28" data-bg-word="ARTISTS">
        <div className="relative mx-auto grid max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-10">
          <div className="relative h-[340px] overflow-hidden bg-charcoal sm:h-[520px] lg:aspect-square lg:h-auto">
            <Image
              src={featuredArtist.image}
              alt={`${featuredArtist.name}, ${featuredArtist.specialty} artist`}
              fill
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0"
            />
          </div>
          <div className="pointer-events-none z-20 -my-4 flex justify-center sm:-my-7 lg:absolute lg:left-[52.5%] lg:top-8 lg:my-0 lg:-translate-x-1/2">
            <Image
              src="/logo/logobamboo.png"
              alt="Khmer Bamboo Sakyant logo"
              width={406}
              height={1080}
              className="h-24 w-auto drop-shadow-[0_18px_26px_rgba(0,0,0,0.38)] sm:h-40 lg:h-52"
            />
          </div>
          <article className="border-t-[3px] border-ink pt-4 text-center sm:pt-5 lg:border-t-4 lg:pt-8 lg:text-left">
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">
              {a.pageTitle}
            </p>
            <h2 className="mt-3 break-words font-display text-[clamp(3.1rem,17vw,9rem)] leading-[0.8]">
              {featuredArtist.name}
            </h2>
            <p
              lang={specialtyHasKhmer ? undefined : "en"}
              className="mt-3 font-condensed text-base uppercase leading-tight tracking-[0.18em] text-ink sm:mt-4 sm:text-3xl sm:tracking-editorial"
            >
              {featuredArtist.specialty}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/65 lg:mx-0">
              {featuredArtist.years}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink/65 sm:mt-5 lg:mx-0">
              {a.pageDesc}
            </p>
            <Button href="/gallery" variant="dark" className="mt-5 w-full px-4 py-3 text-xs sm:mt-6 sm:w-auto sm:text-sm">
              {tx.common.viewWorks}
            </Button>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-5 sm:gap-3 lg:justify-start">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-bone text-ink transition hover:border-teal hover:bg-teal hover:text-white sm:h-11 sm:w-11"
                >
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

"use client";

import Button from "@/components/Button";
import ImageCard from "@/components/ImageCard";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";
import {
  BadgeCheck,
  BookOpenText,
  CircleDot,
  Flame,
  HandCoins,
  HeartHandshake,
  MapPin,
  PenTool,
  Ruler,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const reasonIcons = [PenTool, Sparkles, BadgeCheck, ShieldCheck, MapPin];
const valueIcons = [HeartHandshake, ScrollText, Ruler, ShieldCheck];
const craftIcons = [BookOpenText, PenTool, Sparkles, Flame];
const traditionIcons = [CircleDot, Flame, PenTool, HandCoins];

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
          <ImageCard src="/gallery/photo_2026-06-26_11-18-39.jpg" alt="Khmer Sakyant tattoo artistry in Cambodia" className="h-[300px] sm:h-[460px] lg:h-[620px]" />
          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">{a.ourStory}</p>
            <h2 className="mt-3 max-w-[21rem] font-display text-[clamp(2.8rem,12vw,4.25rem)] leading-[0.82] sm:mt-4 sm:max-w-none sm:text-[clamp(4rem,9vw,8rem)]">
              <span className="km-title-text">{a.heading}</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink/70 sm:mt-6 sm:text-base sm:leading-7">{a.desc}</p>
            <p className="mt-4 text-sm leading-6 text-ink/70 sm:text-base sm:leading-7">
              People searching for Khmer tattoo Siem Reap, Sak Yant Cambodia, Khmer Sakyant tattoo,
              or Bamboo Sakyant Siem Reap come to us for work that respects Khmer visual heritage
              while fitting the body with clean, long-lasting linework.
            </p>
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

      <section className="px-4 pb-14 sm:px-5 sm:pb-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 sm:gap-4">
          <ImageCard src="/gallery/photo_2026-06-26_11-12-44.jpg" alt="Khmer script sacred tattoo detail" className="h-[170px] sm:h-[260px] lg:h-[420px]" />
          <ImageCard src="/gallery/photo_2026-06-26_11-16-00.jpg" alt="Full back Sak Yant Khmer tattoo" className="h-[170px] sm:h-[260px] lg:h-[420px]" />
          <ImageCard src="/gallery/photo_2026-06-26_11-21-28.jpg" alt="Khmer Sakyant tattoo session in studio" className="h-[170px] sm:h-[260px] lg:h-[420px]" />
        </div>
      </section>

      <section className="bg-ink px-4 py-14 text-white sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-10">
            <div>
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">{tx.kicker}</p>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(3rem,13vw,7rem)] leading-[0.82]">
                <span className="km-title-text">{a.valuesTitle}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {a.values.map((value, index) => {
                const Icon = valueIcons[index] ?? BadgeCheck;
                return (
                  <article key={value.title} className="border border-white/15 p-3 transition hover:border-teal sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-teal text-teal sm:h-10 sm:w-10">
                        <Icon className="h-4 w-4 sm:h-[21px] sm:w-[21px]" strokeWidth={1.8} />
                      </span>
                      <h3 className="break-words font-display text-[1.15rem] leading-none [overflow-wrap:anywhere] sm:text-4xl">
                        <span className="km-title-text">{value.title}</span>
                      </h3>
                    </div>
                    <p className="mt-3 text-[0.68rem] leading-4 text-white/65 sm:mt-4 sm:text-sm sm:leading-6">{value.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28" data-bg-word="YANT">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-10">
            <div>
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">{tx.kicker}</p>
              <h2 className="mt-3 max-w-2xl font-display text-[clamp(3rem,13vw,7rem)] leading-[0.82]">
                <span className="km-title-text">{a.traditionTitle}</span>
              </h2>
              <p className="mt-5 text-sm leading-6 text-ink/70 sm:text-base sm:leading-7">{a.traditionIntro}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {a.traditionPoints.map((point, index) => {
                const Icon = traditionIcons[index] ?? BadgeCheck;
                return (
                  <article key={point.title} className="border border-ink/10 bg-bone p-3 transition hover:border-teal hover:bg-white sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-teal text-teal sm:h-10 sm:w-10">
                        <Icon className="h-4 w-4 sm:h-[21px] sm:w-[21px]" strokeWidth={1.8} />
                      </span>
                      <span className="font-display text-2xl leading-none text-ink/10 sm:text-5xl">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-3 break-words font-display text-[1.2rem] leading-none [overflow-wrap:anywhere] sm:mt-4 sm:text-4xl">
                      <span className="km-title-text">{point.title}</span>
                    </h3>
                    <p className="mt-2 text-[0.68rem] leading-4 text-ink/65 sm:mt-3 sm:text-sm sm:leading-6">{point.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={a.craftTitle} kicker={tx.kicker} />
          <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-5 lg:grid-cols-4">
            {a.craftSteps.map((step, index) => {
              const Icon = craftIcons[index] ?? PenTool;
              return (
                <article key={step.title} className="border-t-[3px] border-ink bg-bone p-3 sm:border-t-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <p className="font-display text-3xl leading-none text-teal sm:text-7xl">{String(index + 1).padStart(2, "0")}</p>
                    <Icon className="mt-1 h-5 w-5 text-ink sm:h-[26px] sm:w-[26px]" strokeWidth={1.7} />
                  </div>
                  <h3 className="mt-3 font-display text-[1.35rem] leading-none sm:mt-4 sm:text-5xl">
                    <span className="km-title-text">{step.title}</span>
                  </h3>
                  <p className="mt-2 text-[0.68rem] leading-4 text-ink/65 sm:mt-3 sm:text-sm sm:leading-6">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="why-choose-title">
            <SectionTitle title={a.whyChooseUs} kicker={tx.kicker} />
          </div>
          <div className="mt-6 grid grid-cols-5 gap-1.5 sm:mt-10 sm:gap-3">
            {a.reasons.map((reason, index) => {
              const Icon = reasonIcons[index] ?? BadgeCheck;
              const reasonTextClass =
                lang === "en"
                  ? "flex min-h-8 max-w-full items-center justify-center font-display text-[clamp(0.55rem,2.5vw,0.72rem)] leading-[0.95] sm:min-h-14 sm:text-[clamp(1.15rem,1.8vw,1.65rem)] sm:leading-none"
                  : "flex min-h-8 max-w-full items-center justify-center font-display text-[0.58rem] leading-tight sm:min-h-14 sm:text-2xl lg:text-[1.65rem]";
              return (
              <div
                key={reason}
                className="flex min-h-20 flex-col items-center justify-start gap-1.5 border border-ink bg-bone px-1 py-2 text-center transition hover:bg-teal hover:text-white sm:min-h-36 sm:gap-4 sm:px-4 sm:py-5"
              >
                <span className="flex h-5 shrink-0 items-start justify-center sm:h-10">
                  <Icon className="h-4 w-4 sm:h-[26px] sm:w-[26px]" strokeWidth={1.7} />
                </span>
                <span className={reasonTextClass}>{reason}</span>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

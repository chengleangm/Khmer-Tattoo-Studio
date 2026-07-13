"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, Sparkles, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import GiveawayRegistration from "@/components/GiveawayRegistration";
import { Promotion } from "@/lib/promotions";

function dateLabel(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/promotions", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setPromotions(Array.isArray(data.promotions) ? data.promotions : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="grain relative overflow-hidden bg-ink px-5 py-14 text-white lg:px-8 lg:py-24">
        <div className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-teal/20 sm:h-96 sm:w-96" />
        <div className="relative mx-auto max-w-7xl">
          <SectionTitle title="STUDIO PROMOTIONS" kicker="Limited Offers" light />
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-white/60 sm:text-base">
            Seasonal tattoo offers, studio packages, and special rewards from Khmer Bamboo Sakyant.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-5 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {loading && <div className="grid gap-5 md:grid-cols-2"><div className="h-96 animate-pulse bg-ink/5" /><div className="h-96 animate-pulse bg-ink/5" /></div>}

          {!loading && promotions.length === 0 && (
            <div className="border border-dashed border-ink/20 px-5 py-20 text-center">
              <Gift className="mx-auto h-12 w-12 text-teal" strokeWidth={1.3} />
              <h2 className="mt-5 font-display text-5xl leading-none">NEW OFFERS COMING SOON</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-ink/55">Follow the studio or contact us to hear about the next promotion.</p>
              <Link href="/contact" className="mt-7 inline-flex items-center gap-2 bg-ink px-6 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal">Contact Studio <ArrowRight size={14} /></Link>
            </div>
          )}

          {!loading && promotions.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:gap-7">
              {promotions.map((promotion, index) => (
                <article key={promotion.id} className={`group overflow-hidden border bg-white ${promotion.featured && index === 0 ? "border-teal md:col-span-2 md:grid md:grid-cols-2" : "border-ink/10"}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    {promotion.imageUrl ? <Image src={promotion.imageUrl} alt={promotion.title} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="grain flex h-full items-center justify-center"><Sparkles className="h-16 w-16 text-teal/60" strokeWidth={1} /></div>}
                    <span className="absolute left-4 top-4 bg-teal px-3 py-2 font-condensed text-[10px] uppercase tracking-editorial text-white">{promotion.badge || "Special Offer"}</span>
                  </div>
                  <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                    {promotion.code && <p className="flex items-center gap-2 font-condensed text-xs uppercase tracking-editorial text-teal"><Tag size={14} /> Code: {promotion.code}</p>}
                    <h2 className="mt-3 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.86]">{promotion.title}</h2>
                    <p className="mt-4 flex-1 text-sm leading-6 text-ink/60 sm:text-base sm:leading-7">{promotion.description}</p>
                    {(promotion.startDate || promotion.endDate) && <p className="mt-5 flex items-center gap-2 border-t border-ink/10 pt-4 font-condensed text-[11px] uppercase tracking-editorial text-ink/45"><CalendarDays size={14} /> {promotion.startDate && dateLabel(promotion.startDate)}{promotion.startDate && promotion.endDate && " — "}{promotion.endDate && dateLabel(promotion.endDate)}</p>}
                    <Link href={promotion.ctaHref || "/booking"} className="mt-5 inline-flex w-fit items-center gap-2 bg-ink px-5 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal">{promotion.ctaLabel || "Book This Offer"} <ArrowRight size={14} /></Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <GiveawayRegistration />
    </main>
  );
}

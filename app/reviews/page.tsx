"use client";

import Link from "next/link";
import { MessageCircle, Quote, Star } from "lucide-react";
import Button from "@/components/Button";
import RecentCustomerMoments from "@/components/RecentCustomerMoments";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactDetails, reviewPageContent } from "@/data/site";
import { t } from "@/data/translations";

function Stars() {
  return (
    <div className="flex gap-1 text-teal" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const page = reviewPageContent[lang];

  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <SectionTitle title={page.pageTitle} kicker={tx.kicker} light align="left" />
          <div className="border border-white/15 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-condensed text-xs uppercase tracking-editorial text-white/55">
                  {page.scoreLabel}
                </p>
                <p className="mt-2 font-display text-6xl leading-none text-white">5.0</p>
              </div>
              <Stars />
            </div>
            <p className="mt-4 text-sm leading-6 text-white/65">{page.reviewCount}</p>
          </div>
        </div>
      </section>

      <section className="editorial-section px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24" data-bg-word="REVIEWS">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">
                {page.featuredTitle}
              </p>
              <h2 className="mt-3 max-w-md font-display text-[clamp(3rem,13vw,6.5rem)] leading-[0.78] text-ink">
                {page.featuredTitle}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-ink/65 sm:text-base sm:leading-7">
                {page.pageDesc}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
                <Button href="/booking" variant="dark" className="px-4 py-3 text-xs sm:text-sm">
                  {tx.common.bookNow}
                </Button>
                <Link
                  href={contactDetails.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
              {page.reviews.map((review, index) => (
                <article
                  key={review.name}
                  className={`border border-ink/10 bg-white p-4 sm:p-5 ${
                    index === 0 ? "sm:col-span-2 lg:grid lg:grid-cols-[0.58fr_1fr] lg:gap-6 lg:p-6" : ""
                  }`}
                >
                  <div>
                    <Quote className="h-7 w-7 text-teal" />
                    <div className="mt-4">
                      <Stars />
                    </div>
                  </div>
                  <div className={index === 0 ? "mt-4 lg:mt-0" : "mt-4"}>
                    <p className="text-sm leading-6 text-ink/70 sm:text-base sm:leading-7">
                      {review.text}
                    </p>
                    <div className="mt-5 border-t border-ink/10 pt-4">
                      <p className="font-condensed text-lg uppercase tracking-editorial text-ink">
                        {review.name}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/45">
                        {review.origin} / {review.service}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">
                {page.recentTitle}
              </p>
              <h2 className="mt-3 font-display text-[clamp(3rem,12vw,7rem)] leading-[0.78] text-ink">
                {page.recentTitle}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ink/65 lg:justify-self-end">
              {page.recentDesc}
            </p>
          </div>

          <RecentCustomerMoments initialMoments={page.moments} />
        </div>
      </section>

      <section className="px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl bg-ink p-5 text-white sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">
              {page.ctaTitle}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              {page.ctaDesc}
            </p>
          </div>
          <Button href="/booking" variant="light" className="mt-5 w-full px-4 py-3 text-xs sm:w-auto sm:text-sm lg:mt-0">
            {tx.common.bookAppointment}
          </Button>
        </div>
      </section>
    </main>
  );
}

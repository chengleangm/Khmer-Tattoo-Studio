"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Quote, Send, Star } from "lucide-react";
import Button from "@/components/Button";
import RecentCustomerMoments from "@/components/RecentCustomerMoments";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactDetails, reviewPageContent } from "@/data/site";
import { t } from "@/data/translations";

type Review = {
  id: string;
  name: string;
  origin: string;
  service: string;
  text: string;
  rating: number;
  createdAt: string;
  approved: boolean;
};

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-1 text-teal" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < rounded ? "fill-current" : "fill-none opacity-25"}`} />
      ))}
    </div>
  );
}

function DynamicReviews({
  reviews,
  loaded,
  formRef,
}: {
  reviews: Review[];
  loaded: boolean;
  formRef: React.RefObject<HTMLElement | null>;
}) {
  if (!loaded) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`h-48 animate-pulse bg-ink/5 ${i === 0 ? "sm:col-span-2" : ""}`} />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="border border-dashed border-ink/15 p-8 text-center sm:p-12">
        <Quote className="mx-auto h-8 w-8 text-ink/20" />
        <p className="mt-4 font-condensed text-xs uppercase tracking-editorial text-ink/40">
          No reviews yet
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/50">
          Be the first to share your experience.
        </p>
        <button
          type="button"
          onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="mt-5 inline-flex items-center justify-center gap-2 bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal"
        >
          Leave a Review
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
      {reviews.map((review, index) => (
        <article
          key={review.id}
          className={`border border-ink/10 bg-white p-4 sm:p-5 ${
            index === 0 ? "sm:col-span-2 lg:grid lg:grid-cols-[0.58fr_1fr] lg:gap-6 lg:p-6" : ""
          }`}
        >
          <div>
            <Quote className="h-7 w-7 text-teal" />
            <div className="mt-4">
              <StarRow rating={review.rating} />
            </div>
          </div>
          <div className={index === 0 ? "mt-4 lg:mt-0" : "mt-4"}>
            <p className="text-sm leading-6 text-ink/70 sm:text-base sm:leading-7">{review.text}</p>
            <div className="mt-5 border-t border-ink/10 pt-4">
              <p className="font-condensed text-lg uppercase tracking-editorial text-ink">{review.name}</p>
              {(review.origin || review.service) && (
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/45">
                  {[review.origin, review.service].filter(Boolean).join(" / ")}
                </p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ReviewForm({ formRef }: { formRef: React.RefObject<HTMLElement | null> }) {
  const [form, setForm] = useState({ name: "", origin: "", service: "", text: "", rating: 5 });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      setErrorMessage("Please enter your name and review.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed.");
      setForm({ name: "", origin: "", service: "", text: "", rating: 5 });
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Submission failed.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section ref={formRef as React.RefObject<HTMLElement>} className="border border-ink/10 bg-white p-4 sm:p-6">
        <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Thank you</p>
        <p className="mt-2 font-display text-[clamp(1.8rem,7vw,3.5rem)] leading-[0.85] text-ink">
          Review Received
        </p>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          Pending approval — it will appear on this page once reviewed.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 inline-flex items-center justify-center gap-2 border border-ink px-4 py-2.5 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white"
        >
          Leave another review
        </button>
      </section>
    );
  }

  return (
    <section ref={formRef as React.RefObject<HTMLElement>} className="border border-ink/10 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Leave a Review</p>
          <h2 className="mt-1 font-display text-[clamp(1.6rem,6vw,2.8rem)] leading-[0.85] text-ink">
            Share Your Experience
          </h2>
        </div>
        <div className="flex shrink-0 gap-0.5 text-teal">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current" />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-2.5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="font-condensed text-[10px] uppercase tracking-editorial text-ink/50">
              Name <span className="text-teal">*</span>
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
              required
              maxLength={80}
              className="w-full border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-teal"
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-1">
            <span className="font-condensed text-[10px] uppercase tracking-editorial text-ink/50">Country / City</span>
            <input
              type="text"
              value={form.origin}
              onChange={(e) => setForm((v) => ({ ...v, origin: e.target.value }))}
              maxLength={80}
              className="w-full border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-teal"
              placeholder="e.g. Japan, UK"
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="font-condensed text-[10px] uppercase tracking-editorial text-ink/50">What did you get?</span>
          <input
            type="text"
            value={form.service}
            onChange={(e) => setForm((v) => ({ ...v, service: e.target.value }))}
            maxLength={120}
            className="w-full border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-teal"
            placeholder="e.g. Khmer Sakyant arm piece"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-condensed text-[10px] uppercase tracking-editorial text-ink/50">
            Your review <span className="text-teal">*</span>
          </span>
          <textarea
            value={form.text}
            onChange={(e) => setForm((v) => ({ ...v, text: e.target.value }))}
            required
            maxLength={1000}
            rows={3}
            className="w-full border border-ink/15 bg-bone px-3 py-2 text-sm leading-6 outline-none focus:border-teal"
            placeholder="Tell us about your experience..."
          />
          <span className="text-right font-condensed text-[10px] text-ink/25">{form.text.length}/1000</span>
        </label>

        <div className="flex items-center justify-between border border-ink/10 bg-bone px-3 py-2.5">
          <span className="font-condensed text-[10px] uppercase tracking-editorial text-ink/50">Rating</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm((v) => ({ ...v, rating: star }))}
                className={`transition ${form.rating >= star ? "text-teal" : "text-ink/20 hover:text-teal/50"}`}
                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              >
                <Star className={`h-5 w-5 ${form.rating >= star ? "fill-current" : ""}`} />
              </button>
            ))}
            <span className="ml-1 font-condensed text-[11px] text-ink/40">{form.rating}/5</span>
          </div>
        </div>

        {status === "error" && errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}

        <div className="flex flex-col gap-2 pt-0.5 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-2.5 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Send className="h-3.5 w-3.5" />
            {status === "sending" ? "Sending..." : "Submit Review"}
          </button>
          <p className="text-center text-[10px] leading-4 text-ink/35 sm:text-left">
            Reviewed before going live.
          </p>
        </div>
      </form>
    </section>
  );
}

export default function ReviewsPage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const page = reviewPageContent[lang];
  const formRef = useRef<HTMLElement>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setReviewsLoaded(true);
      })
      .catch(() => setReviewsLoaded(true));
  }, []);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const scoreDisplay = avgRating !== null ? avgRating.toFixed(1) : "5.0";
  const starsDisplay = avgRating !== null ? avgRating : 5;
  const countLabel =
    reviews.length > 0
      ? `Based on ${reviews.length} client review${reviews.length !== 1 ? "s" : ""}`
      : page.reviewCount;

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
                <p className="mt-2 font-display text-6xl leading-none text-white">{scoreDisplay}</p>
              </div>
              <StarRow rating={starsDisplay} size="lg" />
            </div>
            <p className="mt-4 text-sm leading-6 text-white/65">{countLabel}</p>
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

            <DynamicReviews reviews={reviews} loaded={reviewsLoaded} formRef={formRef} />
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

          <RecentCustomerMoments />
        </div>
      </section>

      <section className="px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <ReviewForm formRef={formRef} />
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

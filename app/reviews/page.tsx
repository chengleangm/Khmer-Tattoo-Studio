"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { MessageCircle, Quote, Send, Star } from "lucide-react";
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

function ReviewForm() {
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
      <div className="border border-ink/10 bg-white p-5 sm:p-6 lg:p-8">
        <p className="font-condensed text-xs uppercase tracking-editorial text-teal">
          Thank you
        </p>
        <p className="mt-3 font-display text-[clamp(2rem,8vw,4rem)] leading-[0.85] text-ink">
          Review Received
        </p>
        <p className="mt-4 text-sm leading-6 text-ink/65">
          Your review is pending approval and will appear on this page soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex items-center justify-center gap-2 border border-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white"
        >
          Leave another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink/10 bg-white p-5 sm:p-6 lg:p-8">
      <p className="font-condensed text-xs uppercase tracking-editorial text-teal">
        Leave a Review
      </p>
      <h2 className="mt-3 font-display text-[clamp(2.5rem,10vw,5rem)] leading-[0.78] text-ink">
        Share Your Experience
      </h2>
      <p className="mt-4 text-sm leading-6 text-ink/65">
        Got tattooed at Khmer Bamboo Sakyant? Let others know what the experience was like.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">
            Your name <span className="text-teal">*</span>
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            required
            maxLength={80}
            className="border border-ink/15 bg-bone px-3 py-3 text-sm outline-none focus:border-teal"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2">
          <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">
            Country or city
          </span>
          <input
            type="text"
            value={form.origin}
            onChange={(e) => setForm((v) => ({ ...v, origin: e.target.value }))}
            maxLength={80}
            className="border border-ink/15 bg-bone px-3 py-3 text-sm outline-none focus:border-teal"
            placeholder="e.g. Australia, UK, Japan"
          />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">
            What did you get?
          </span>
          <input
            type="text"
            value={form.service}
            onChange={(e) => setForm((v) => ({ ...v, service: e.target.value }))}
            maxLength={120}
            className="border border-ink/15 bg-bone px-3 py-3 text-sm outline-none focus:border-teal"
            placeholder="e.g. Khmer Sakyant arm piece"
          />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">
            Your review <span className="text-teal">*</span>
          </span>
          <textarea
            value={form.text}
            onChange={(e) => setForm((v) => ({ ...v, text: e.target.value }))}
            required
            maxLength={1000}
            rows={4}
            className="border border-ink/15 bg-bone px-3 py-3 text-sm leading-6 outline-none focus:border-teal"
            placeholder="Tell us about your experience at the studio..."
          />
          <span className="text-right text-xs text-ink/30">{form.text.length}/1000</span>
        </label>
        <label className="grid gap-2">
          <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">
            Rating
          </span>
          <div className="flex items-center gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm((v) => ({ ...v, rating: star }))}
                className={`transition ${form.rating >= star ? "text-teal" : "text-ink/20 hover:text-teal/60"}`}
                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              >
                <Star className={`h-6 w-6 ${form.rating >= star ? "fill-current" : ""}`} />
              </button>
            ))}
            <span className="ml-1 font-condensed text-xs uppercase tracking-editorial text-ink/50">
              {form.rating}/5
            </span>
          </div>
        </label>
      </div>

      {status === "error" && errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex items-center justify-center gap-2 bg-ink px-5 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending..." : "Submit Review"}
      </button>
    </form>
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

      <section className="px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <ReviewForm />
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

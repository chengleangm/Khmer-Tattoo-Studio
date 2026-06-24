"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { galleryItems } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

const filterKeys = ["All", "Blackwork", "Realistic", "Khmer", "Geometric", "Fine Line"] as const;

const kmFilterLabels: Record<string, string> = {
  Blackwork: "សាក់ខ្មៅ",
  Realistic: "សាក់បែបពិតនិយម",
  Khmer: "សាក់បែបខ្មែរ",
  Geometric: "សាក់ធរណីមាត្រ",
  "Fine Line": "សាក់បន្ទាត់ស្តើង",
};

function getStyleLabel(style: string, lang: "en" | "km") {
  return lang === "km" ? kmFilterLabels[style] ?? style : style;
}

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const { lang } = useLanguage();
  const filterAll = t[lang].gallery.filterAll;

  const filters = filterKeys.map((key) => ({
    value: key,
    label: key === "All" ? filterAll : getStyleLabel(key, lang),
  }));

  const items = useMemo(() => {
    if (active === "All") return galleryItems;
    return galleryItems.filter((item) => item.style === active);
  }, [active]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            lang={filter.value !== "All" && lang === "en" ? "en" : undefined}
            className={`border px-4 py-2 font-condensed text-sm uppercase tracking-editorial transition ${
              active === filter.value
                ? "border-teal bg-teal text-white"
                : "border-ink/15 bg-bone text-ink hover:border-ink"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-5">
        {items.map((item) => (
          <div
            key={`${item.src}-${active}`}
            className="group relative aspect-square overflow-hidden bg-charcoal"
          >
            <Image
              src={item.src}
              alt={lang === "km" ? `ស្នាដៃ${getStyleLabel(item.style, lang)}` : `${item.style} tattoo portfolio piece`}
              fill
              sizes="(max-width: 768px) 33vw, 32vw"
              className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-ink/15 to-transparent p-2 opacity-0 transition duration-300 group-hover:opacity-100 sm:p-4 md:p-5">
              <p className="font-display text-2xl leading-none text-white sm:text-4xl md:text-5xl">
                {getStyleLabel(item.style, lang)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { galleryItems } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

const kmFilterLabels: Record<string, string> = {
  "Sak Yant Khmer": "សាក់យ័ន្តខ្មែរ",
  "Abstract Khmer": "អាប់ស្ត្រាក់ខ្មែរ",
  "Khmer Script Flow": "លំហូរអក្សរខ្មែរ",
  "Protective Yantra": "យ័ន្តការពារ",
  "Japanese Inspired": "ឥទ្ធិពលជប៉ុន",
};

function getStyleLabel(style: string, lang: "en" | "km") {
  return lang === "km" ? kmFilterLabels[style] ?? style : style;
}

type RevealState = "below" | "visible" | "above";

function GalleryItem({
  item,
  col,
  lang,
  filterKey,
}: {
  item: { src: string; style: string };
  col: number;
  lang: "en" | "km";
  filterKey: string;
}) {
  const [state, setState] = useState<RevealState>("below");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
        } else {
          // Exiting at top → slide out upward; exiting at bottom → slide out downward
          setState(entry.boundingClientRect.top < 0 ? "above" : "below");
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [filterKey]);

  const yDir = state === "below" ? 1 : -1;
  const flyTransform =
    state === "visible"
      ? "translate(0px, 0px) scale(1)"
      : col === 0
      ? `translate(-180px, ${25 * yDir}px) scale(0.88)`
      : col === 2
      ? `translate(180px, ${25 * yDir}px) scale(0.88)`
      : `translate(0px, ${110 * yDir}px) scale(0.88)`;

  return (
    <div className="overflow-hidden">
      <div
        ref={ref}
        style={{
          transform: flyTransform,
          opacity: state === "visible" ? 1 : 0,
          transitionProperty: "transform, opacity",
          transitionDuration: "750ms, 600ms",
          transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94), ease-out",
          transitionDelay: `${col * 70}ms, ${col * 70}ms`,
        }}
      >
      <div className="group relative aspect-square overflow-hidden bg-charcoal">
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
        {/* Gold border on hover */}
        <div className="absolute inset-0 border-2 border-teal/0 transition-all duration-500 group-hover:border-teal/70" />
      </div>
      </div>
    </div>
  );
}

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const { lang } = useLanguage();
  const filterAll = t[lang].gallery.filterAll;

  const filterKeys = useMemo(
    () => ["All", ...Array.from(new Set(galleryItems.map((item) => item.style)))],
    []
  );

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

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4">
        {items.map((item, index) => (
          <GalleryItem
            key={`${item.src}-${active}`}
            item={item}
            col={index % 3}
            lang={lang}
            filterKey={active}
          />
        ))}
      </div>
    </div>
  );
}

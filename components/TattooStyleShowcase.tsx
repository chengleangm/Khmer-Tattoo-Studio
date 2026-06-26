"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

const styleOptions = [
  { name: "Sak Yant Khmer", image: "/tattoo-img-categgory/sakyant-khmer.jpg" },
  { name: "Abstract Khmer", image: "/tattoo-img-categgory/abstract-khmer.jpg" },
  { name: "Khmer Script Flow", image: "/tattoo-img-categgory/khmer-script-flow.jpg" },
  { name: "Protective Yantra", image: "/tattoo-img-categgory/protective-yantra.jpg" },
  { name: "Japanese Inspired", image: "/tattoo-img-categgory/japanese-inspired.jpg" },
  { name: "Custom Sacred Piece", image: "/tattoo-img-categgory/custom-sacred-piece.jpg" },
];

export default function TattooStyleShowcase() {
  const [activeIndex, setActiveIndex] = useState(2);
  const { lang } = useLanguage();
  const text = t[lang].showcase;

  const active = styleOptions[activeIndex];

  return (
    <section className="editorial-section bg-white px-5 py-14 lg:px-8 lg:py-28" data-bg-word="STUDIO">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:items-center">
        <div className="group relative h-[250px] overflow-hidden bg-charcoal sm:h-[320px] lg:h-[520px]">
          <Image
            key={active.image}
            src={active.image}
            alt={`${styleOptions[activeIndex].name} preview`}
            fill
            sizes="(max-width: 768px) 90vw, 42vw"
            className="object-cover grayscale transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-4">
            <p className="font-condensed text-xs uppercase tracking-editorial text-white/70">{text.selectedStyle}</p>
            <p lang={lang === "en" ? "en" : undefined} className="font-display text-4xl leading-none text-white sm:text-5xl">{text.styleNames[activeIndex]}</p>
          </div>
        </div>

        <div>
          <div className="max-w-[22rem] lg:max-w-4xl">
            <p className="font-condensed text-xs uppercase tracking-[0.35em] text-charcoal/70">{text.kicker}</p>
            <h2 className="mt-3 max-w-full break-words font-display text-[clamp(2.3rem,8vw,5.5rem)] leading-[0.82] text-ink [overflow-wrap:anywhere] lg:text-[clamp(3rem,10vw,9rem)]">
              <span className="km-title-text">{text.title}</span>
            </h2>
          </div>

          <div className="mt-6 grid w-[calc(100vw-2.5rem)] max-w-[22rem] grid-cols-2 gap-2 overflow-hidden lg:mt-8 lg:w-full lg:max-w-none lg:grid-cols-1 lg:gap-3">
            {styleOptions.map((style, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  key={style.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={selected}
                  className={`flex min-h-12 min-w-0 items-center justify-center border px-2 py-2 text-center font-display text-[0.95rem] leading-[0.9] transition duration-200 active:scale-[0.98] sm:min-h-14 sm:text-[1.2rem] lg:min-h-0 lg:px-5 lg:py-3 lg:text-4xl ${
                    selected
                      ? "border-teal bg-teal text-white"
                      : "border-ink bg-bone text-ink hover:border-teal"
                  }`}
                >
                  <span lang={lang === "en" ? "en" : undefined} className="max-w-full break-words [overflow-wrap:anywhere]">{text.styleNames[index]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

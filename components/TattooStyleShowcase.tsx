"use client";

import Image from "next/image";
import { useState } from "react";

const styleOptions = [
  {
    name: "Japanese Tattoo",
    image: "/images/about-studio-work.jpg",
  },
  {
    name: "Geometric Tattoo",
    image: "/images/gallery-7.jpg",
  },
  {
    name: "Blackwork Tattoo",
    image: "/images/studio-tattoo-arm.jpg",
  },
  {
    name: "Dotwork Tattoo",
    image: "/images/eternal-tattoo-closeup.jpg",
  },
  {
    name: "Realistic Tattoo",
    image: "/images/gallery-2.jpg",
  },
  {
    name: "Khmer Inspired Tattoo",
    image: "/images/gallery-3.jpg",
  },
];

export default function TattooStyleShowcase() {
  const [activeStyle, setActiveStyle] = useState(styleOptions[2]);

  return (
    <section className="editorial-section bg-white px-5 py-14 lg:px-8 lg:py-28" data-bg-word="STUDIO">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:items-center">
        <div className="group relative h-[250px] overflow-hidden bg-charcoal sm:h-[320px] lg:h-[520px]">
          <Image
            key={activeStyle.image}
            src={activeStyle.image}
            alt={`${activeStyle.name} preview`}
            fill
            sizes="(max-width: 768px) 90vw, 42vw"
            className="object-cover grayscale transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-4">
            <p className="font-condensed text-xs uppercase tracking-editorial text-white/70">Selected Style</p>
            <p className="font-display text-4xl leading-none text-white sm:text-5xl">{activeStyle.name}</p>
          </div>
        </div>

        <div>
          <div className="max-w-[22rem] lg:max-w-4xl">
            <p className="font-condensed text-xs uppercase tracking-[0.35em] text-charcoal/70">
              Stories on Skin
            </p>
            <h2 className="mt-3 max-w-full break-words font-display text-[clamp(2.3rem,8vw,5.5rem)] leading-[0.82] text-ink [overflow-wrap:anywhere] lg:text-[clamp(3rem,10vw,9rem)]">
              TATTOO STUDIO
            </h2>
          </div>

          <div className="mt-6 grid w-[calc(100vw-2.5rem)] max-w-[22rem] grid-cols-2 gap-2 overflow-hidden lg:mt-8 lg:w-full lg:max-w-none lg:grid-cols-1 lg:gap-3">
            {styleOptions.map((style) => {
              const selected = activeStyle.name === style.name;

              return (
                <button
                  key={style.name}
                  type="button"
                  onClick={() => setActiveStyle(style)}
                  aria-pressed={selected}
                  className={`flex min-h-12 min-w-0 items-center justify-center border px-2 py-2 text-center font-display text-[0.95rem] leading-[0.9] transition duration-200 active:scale-[0.98] sm:min-h-14 sm:text-[1.2rem] lg:min-h-0 lg:px-5 lg:py-3 lg:text-4xl ${
                    selected
                      ? "border-teal bg-teal text-white"
                      : "border-ink bg-bone text-ink hover:border-teal"
                  }`}
                >
                  <span className="max-w-full break-words [overflow-wrap:anywhere]">{style.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

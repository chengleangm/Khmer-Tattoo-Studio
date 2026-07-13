"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Moment = { src: string; label: string };

export default function RollingCustomerMoments() {
  const [all, setAll] = useState<Moment[]>([]);
  const [start, setStart] = useState(0);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/review-moments", { cache: "no-store" })
      .then((r) => r.json() as Promise<{ moments?: Moment[] }>)
      .then((data) => {
        if (Array.isArray(data.moments) && data.moments.length > 0) {
          // Shuffle once on load
          const shuffled = [...data.moments].sort(() => Math.random() - 0.5);
          setAll(shuffled);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (all.length <= 3) return;

    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setStart((s) => (s + 3) % all.length);
        setFading(false);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [all.length]);

  if (!loaded || all.length === 0) return null;

  // Pick 3 images wrapping around the shuffled list
  const displayed = [0, 1, 2].map((i) => all[(start + i) % all.length]);

  return (
    <div
      className={`mt-6 grid grid-cols-1 gap-3 transition-opacity duration-500 sm:grid-cols-3 sm:mt-8 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {displayed.map((moment, i) => (
        <figure
          key={`${moment.src}-${i}`}
          className="group relative h-[220px] overflow-hidden bg-charcoal sm:h-[280px] lg:h-[340px]"
        >
          <Image
            src={moment.src}
            alt={moment.label}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            unoptimized
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-ink/75 px-3 py-2 font-condensed text-[0.65rem] uppercase tracking-editorial text-white sm:text-xs">
            {moment.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

type Moment = {
  src: string;
  label: string;
  uploadedAt?: string;
};

const REVIEW_MOMENTS_CHANGED_EVENT = "review-moments:changed";

export default function RecentCustomerMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMoments() {
      try {
        const response = await fetch("/api/review-moments", { cache: "no-store" });
        const result = await response.json();
        if (active) {
          setMoments(Array.isArray(result.moments) ? result.moments : []);
          setLoaded(true);
        }
      } catch {
        if (active) {
          setMoments([]);
          setLoaded(true);
        }
      }
    }

    loadMoments();
    window.addEventListener(REVIEW_MOMENTS_CHANGED_EVENT, () => loadMoments());

    return () => {
      active = false;
      window.removeEventListener(REVIEW_MOMENTS_CHANGED_EVENT, () => loadMoments());
    };
  }, []);

  if (!loaded) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse bg-charcoal/20 ${
              i === 0 ? "col-span-2 h-[300px] sm:col-span-1 sm:h-[360px] lg:h-[460px]" : "h-[180px] sm:h-[360px] lg:h-[460px]"
            }`}
          />
        ))}
      </div>
    );
  }

  if (moments.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center gap-4 border border-dashed border-ink/20 py-16 text-center sm:mt-8">
        <Camera className="h-8 w-8 text-ink/25" />
        <div>
          <p className="font-condensed text-sm uppercase tracking-editorial text-ink/40">Coming Soon</p>
          <p className="mt-1 text-sm text-ink/35">Studio moments will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:gap-4">
      {moments.map((moment, index) => (
        <figure
          key={`${moment.src}-${index}`}
          className={`group relative overflow-hidden bg-charcoal ${
            index === 0 ? "col-span-2 h-[300px] sm:col-span-1 sm:h-[360px] lg:h-[460px]" : "h-[180px] sm:h-[360px] lg:h-[460px]"
          }`}
        >
          <Image
            src={moment.src}
            alt={moment.label}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-ink/78 px-3 py-2 font-condensed text-[0.68rem] uppercase tracking-editorial text-white sm:text-xs">
            {moment.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

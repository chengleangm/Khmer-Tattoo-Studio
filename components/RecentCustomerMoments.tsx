"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Moment = {
  src: string;
  label: string;
  uploadedAt?: string;
};

type RecentCustomerMomentsProps = {
  initialMoments: readonly Moment[];
};

export default function RecentCustomerMoments({ initialMoments }: RecentCustomerMomentsProps) {
  const [uploadedMoments, setUploadedMoments] = useState<Moment[]>([]);

  useEffect(() => {
    let active = true;

    async function loadMoments() {
      try {
        const response = await fetch("/api/review-moments", { cache: "no-store" });
        const result = await response.json();
        if (active && Array.isArray(result.moments)) {
          setUploadedMoments(result.moments);
        }
      } catch {
        if (active) setUploadedMoments([]);
      }
    }

    loadMoments();
    return () => {
      active = false;
    };
  }, []);

  const moments = useMemo(() => {
    const uploadedSources = new Set(uploadedMoments.map((moment) => moment.src));
    return [
      ...uploadedMoments,
      ...initialMoments.filter((moment) => !uploadedSources.has(moment.src)),
    ];
  }, [initialMoments, uploadedMoments]);

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

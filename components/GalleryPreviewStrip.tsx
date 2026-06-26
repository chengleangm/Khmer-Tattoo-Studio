"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryItem = {
  src: string;
  style: string;
};

const tileSettings = [
  { startIndex: 0, offsetMs: 0, animationClass: "gallery-slide-from-left" },
  { startIndex: 1, offsetMs: 1600, animationClass: "gallery-slide-from-up" },
  { startIndex: 2, offsetMs: 3200, animationClass: "gallery-slide-from-right" },
];

function GalleryPreviewTile({
  items,
  startIndex,
  offsetMs,
  animationClass,
}: {
  items: GalleryItem[];
  startIndex: number;
  offsetMs: number;
  animationClass: string;
}) {
  const [position, setPosition] = useState(0);
  const item = items[(startIndex + position * tileSettings.length) % items.length];

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      setPosition((current) => current + 1);
      intervalId = setInterval(() => {
        setPosition((current) => current + 1);
      }, 5000);
    }, 5000 + offsetMs);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [offsetMs]);

  return (
    <div className="relative h-[180px] overflow-hidden bg-charcoal sm:h-[240px] md:h-[420px]">
      <Image
        key={item.src}
        src={item.src}
        alt={`${item.style} tattoo gallery preview`}
        fill
        sizes="(max-width: 768px) 33vw, 30vw"
        className={`object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0 ${animationClass}`}
      />
    </div>
  );
}

export default function GalleryPreviewStrip({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      {tileSettings.map((tile) => (
        <GalleryPreviewTile
          key={tile.startIndex}
          items={items}
          startIndex={tile.startIndex}
          offsetMs={tile.offsetMs}
          animationClass={tile.animationClass}
        />
      ))}
    </div>
  );
}

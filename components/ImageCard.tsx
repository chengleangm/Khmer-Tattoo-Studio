"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

type ImageCardProps = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function ImageCard({ src, alt, className = "", priority = false }: ImageCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`group relative overflow-hidden bg-charcoal ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-charcoal">
          <div className="absolute inset-y-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 42vw"
        onLoad={() => setLoaded(true)}
        className={`object-cover grayscale transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

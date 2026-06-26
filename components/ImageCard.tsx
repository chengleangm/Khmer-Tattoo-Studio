"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type ImageCardProps = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function ImageCard({ src, alt, className = "", priority = false }: ImageCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(priority);
  const ref = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (priority) return;
    let mounted = true;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (mounted && entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [priority]);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden bg-charcoal ${className} transition-[opacity,transform] duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Shimmer skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 z-20 overflow-hidden bg-charcoal">
          <div className="absolute inset-y-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      )}

      {/* Gold tint overlay on hover */}
      <div className="absolute inset-0 z-10 bg-teal/0 transition-colors duration-500 group-hover:bg-teal/15" />

      {/* Gold border that draws in on hover */}
      <div className="absolute inset-0 z-10 border-2 border-teal/0 transition-all duration-500 group-hover:border-teal/70" />

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 42vw"
        onLoad={() => {
          if (mountedRef.current) setLoaded(true);
        }}
        className={`object-cover grayscale transition-[opacity,transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Send } from "lucide-react";
import Button from "@/components/Button";

const socialIcons = [Instagram, Facebook, Send, Linkedin];

export default function Footer() {
  return (
    <footer className="grain bg-ink px-5 py-8 text-white lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 bg-teal p-4 sm:p-5 md:flex md:items-center md:justify-between md:px-6">
          <p className="max-w-[18rem] break-words font-display text-[2rem] leading-[0.9] sm:max-w-xl sm:text-5xl">
            Artistry in Ink. Chronicles of Skin Stories.
          </p>
          <Button href="/booking" variant="light" className="mt-5 w-full md:mt-0 md:w-auto">
            Book Now
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-7 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:gap-8 md:pt-8">
          <div className="col-span-2 md:col-span-1">
            <p className="max-w-[18rem] font-display text-[clamp(3.1rem,17vw,6rem)] leading-[0.78] text-white md:max-w-none lg:text-[clamp(4.5rem,13vw,12rem)]">
              A TOUCH OF INK
            </p>
            <p className="mt-3 font-condensed text-xs uppercase tracking-editorial text-white/60 md:mt-4 md:text-sm">
              Khmer Tattoo Studio
            </p>
          </div>

          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal md:text-sm">
              Explore
            </p>
            <div className="mt-3 grid gap-2 font-condensed text-xs uppercase tracking-editorial text-white/70 md:mt-4 md:text-sm">
              <Link href="/gallery" className="hover:text-white">Gallery</Link>
              <Link href="/artists" className="hover:text-white">Artists</Link>
              <Link href="/aftercare" className="hover:text-white">Aftercare</Link>
              <Link href="/booking" className="hover:text-white">Booking</Link>
            </div>
          </div>

          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal md:text-sm">
              Social
            </p>
            <div className="mt-3 grid max-w-48 grid-cols-4 gap-2 md:mt-4 md:flex md:max-w-none md:gap-3">
              {socialIcons.map((Icon, index) => (
                <Link
                  key={index}
                  href="/contact"
                  aria-label="Social link placeholder"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/20 transition hover:border-teal hover:bg-teal"
                >
                  <Icon size={17} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-7 border-t border-white/10 pt-5 font-condensed text-[0.68rem] uppercase tracking-editorial text-white/45 md:mt-8 md:text-xs">
          (c) 2026 Khmer Tattoo Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

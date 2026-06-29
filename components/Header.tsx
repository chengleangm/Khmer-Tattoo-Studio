"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang, toggle } = useLanguage();
  const text = t[lang].nav;

  const navItems = [
    { label: text.home, href: "/" },
    { label: text.artists, href: "/artists" },
    { label: text.gallery, href: "/gallery" },
    { label: text.services, href: "/services" },
    { label: text.reviews, href: "/reviews" },
    { label: text.booking, href: "/booking" },
    { label: text.about, href: "/about" },
    { label: text.contact, href: "/contact" },
    { label: text.aftercare, href: "/aftercare" },
    { label: text.store, href: "/store" },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 lg:px-8">
          <Link
            href="/"
            lang="en"
            className="flex min-w-0 shrink-0 items-center"
            onClick={() => setOpen(false)}
            aria-label="Khmer Bamboo Sakyant home"
          >
            <Image
              src="/logo/logobamboohz.png"
              alt="Khmer Bamboo Sakyant"
              width={1080}
              height={398}
              priority
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          {/* Desktop nav — ml-auto pushes it right of the logo */}
          <nav className="ml-auto hidden items-center gap-4 xl:gap-5 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-condensed text-xs uppercase tracking-editorial transition hover:text-teal ${
                    active ? "text-teal" : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Lang toggle + hamburger — rightmost on both mobile and desktop */}
          <div className="ml-auto flex items-center gap-3 lg:ml-6">
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle language"
              className="flex overflow-hidden border border-white/20 transition hover:border-white/50"
            >
              <span
                className={`px-3 py-1.5 font-condensed text-xs uppercase tracking-editorial transition ${
                  lang === "en" ? "bg-teal text-white" : "text-white/45"
                }`}
              >
                EN
              </span>
              <span
                className={`border-l border-white/20 px-3 py-1.5 font-kantumruy text-xs transition ${
                  lang === "km" ? "bg-teal text-white" : "text-white/45"
                }`}
              >
                ខ្មែរ
              </span>
            </button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 transition hover:border-teal hover:text-teal lg:hidden"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-white/10 bg-ink px-5 py-5 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border border-white/10 px-4 py-3 font-condensed text-sm uppercase tracking-editorial ${
                    pathname === item.href ? "bg-teal text-white" : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      <div className="h-20" aria-hidden="true" />
    </>
  );
}

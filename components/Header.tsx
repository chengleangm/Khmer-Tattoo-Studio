"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 lg:px-8">
          <Link
            href="/"
            className="min-w-0 max-w-[16rem] truncate font-display text-2xl leading-none tracking-[0.04em] sm:max-w-none sm:text-3xl"
            onClick={() => setOpen(false)}
          >
            Khmer Tattoo Studio
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 transition hover:border-teal hover:text-teal lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="ml-auto hidden items-center gap-6 lg:flex">
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

        </div>

        {open ? (
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
        ) : null}
      </header>
      <div className="h-20" aria-hidden="true" />
    </>
  );
}

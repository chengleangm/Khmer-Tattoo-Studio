"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";
import { contactDetails } from "@/data/site";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Clock, MessageCircle, Package,
  ShoppingBag, SlidersHorizontal, Truck, X,
} from "lucide-react";

type StoreProduct = {
  id: string;
  name: string;
  category: string;
  desc: string;
  price: string;
  tag: string;
  imageUrl: string;
  inStock: boolean;
  visible: boolean;
};

function formatPrice(price: string): string {
  if (!price) return "";
  if (price.startsWith("$")) return price;
  const n = parseFloat(price);
  return isNaN(n) ? price : `$${n % 1 === 0 ? n.toString() : n.toFixed(2)}`;
}

const stepIcons = [ShoppingBag, MessageCircle, Package, Truck];

export default function StorePage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const s = tx.store;

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json() as Promise<{ products?: StoreProduct[]; categories?: string[] }>)
      .then((data) => {
        setProducts(data.products ?? []);
        setCategories(data.categories ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // close drawer on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    function handler(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  // prevent body scroll when drawer open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const usedCategories = categories.filter((cat) =>
    products.some((p) => p.category === cat)
  );

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const countFor = (cat: string) =>
    cat === "all"
      ? products.length
      : products.filter((p) => p.category === cat).length;

  const hasProducts = products.length > 0;
  const showSidebar = usedCategories.length > 1;

  return (
    <main>
      {/* Hero */}
      <section className="grain bg-ink px-5 py-12 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={s.pageTitle} kicker={tx.kicker} light />
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-white/60">
            {s.pageDesc}
          </p>
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && (
        <section className="px-4 py-10 sm:px-5 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse border border-ink/5 bg-bone" style={{ height: 280 }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon */}
      {!loading && !hasProducts && (
        <section className="editorial-section px-4 py-20 sm:px-5 sm:py-28 lg:px-8 lg:py-36" data-bg-word="SOON">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center border-2 border-teal">
              <Clock className="h-9 w-9 text-teal" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 font-display text-[clamp(3rem,12vw,7rem)] leading-[0.82]">
              {s.comingSoonTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-ink/60 sm:text-base sm:leading-7">
              {s.comingSoonDesc}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={contactDetails.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal px-6 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-ink"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
              <Button href="/booking" variant="outline" className="gap-2 px-6 py-3 text-xs">
                Book a Tattoo
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Product section with sidebar ── */}
      {!loading && hasProducts && (
        <section className="px-4 py-6 sm:px-5 sm:py-10 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">

            {/* Mobile filter bar */}
            {showSidebar && (
              <div className="mb-4 flex items-center justify-between md:hidden">
                <p className="font-condensed text-xs uppercase tracking-editorial text-ink/50">
                  {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                  {activeFilter !== "all" && (
                    <span className="ml-1 text-teal">— {activeFilter}</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 border border-ink/20 bg-white px-4 py-2.5 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:border-teal hover:text-teal"
                >
                  <SlidersHorizontal size={13} />
                  Filter
                  {activeFilter !== "all" && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal text-[9px] text-white">1</span>
                  )}
                </button>
              </div>
            )}

            <div className="flex gap-0 md:gap-5 lg:gap-7">

              {/* ── Left sidebar ── */}
              {showSidebar && (
                <>
                  {/* Mobile overlay */}
                  {sidebarOpen && (
                    <div
                      className="fixed inset-0 z-30 bg-ink/50 backdrop-blur-sm md:hidden"
                      aria-hidden="true"
                    />
                  )}

                  {/* Sidebar panel */}
                  <aside
                    ref={sidebarRef}
                    className={`
                      fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-ink/10 bg-white pt-20 shadow-2xl
                      transition-transform duration-300 ease-in-out
                      md:relative md:top-auto md:z-auto md:h-auto md:w-44 md:shrink-0 md:translate-x-0 md:shadow-none md:pt-0
                      lg:w-52
                      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    `}
                  >
                    {/* Mobile close button */}
                    <div className="flex items-center justify-between border-b border-ink/10 px-5 pb-4 md:hidden">
                      <p className="font-condensed text-xs uppercase tracking-editorial text-ink/50">
                        Filter by Category
                      </p>
                      <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="flex h-8 w-8 items-center justify-center border border-ink/15 text-ink/50 hover:bg-ink hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Desktop label */}
                    <p className="mb-3 hidden font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/35 md:block">
                      Category
                    </p>

                    <nav className="flex flex-col gap-1 overflow-y-auto px-5 py-4 md:px-0 md:py-0">
                      {/* All */}
                      <CategoryBtn
                        label={s.filterAll}
                        count={countFor("all")}
                        active={activeFilter === "all"}
                        onClick={() => { setActiveFilter("all"); setSidebarOpen(false); }}
                      />
                      {usedCategories.map((cat) => (
                        <CategoryBtn
                          key={cat}
                          label={cat}
                          count={countFor(cat)}
                          active={activeFilter === cat}
                          onClick={() => { setActiveFilter(cat); setSidebarOpen(false); }}
                        />
                      ))}
                    </nav>

                    {/* Clear filter (mobile) */}
                    {activeFilter !== "all" && (
                      <div className="border-t border-ink/10 px-5 py-4 md:hidden">
                        <button
                          type="button"
                          onClick={() => { setActiveFilter("all"); setSidebarOpen(false); }}
                          className="font-condensed text-xs uppercase tracking-editorial text-teal"
                        >
                          Clear filter
                        </button>
                      </div>
                    )}
                  </aside>
                </>
              )}

              {/* ── Product grid ── */}
              <div className="min-w-0 flex-1">
                {/* Desktop result count */}
                {showSidebar && (
                  <p className="mb-4 hidden font-condensed text-[0.65rem] uppercase tracking-editorial text-ink/40 md:block">
                    {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                    {activeFilter !== "all" && <span className="text-teal"> — {activeFilter}</span>}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 lg:gap-4">
                  {filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      outOfStockLabel={s.outOfStock}
                    />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="font-condensed text-xs uppercase tracking-editorial text-ink/35">
                      No products in this category yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How to order */}
      {!loading && hasProducts && (
        <section className="bg-white px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionTitle title={s.howTitle} kicker={tx.kicker} />
            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {s.howSteps.map((item, index) => {
                const Icon = stepIcons[index] ?? Package;
                return (
                  <article
                    key={item.step}
                    className="grid grid-cols-[2.5rem_1fr] gap-3 border-t-2 border-ink bg-bone p-3 sm:border-t-4 sm:p-5 lg:block lg:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink lg:mb-4 lg:h-12 lg:w-12 lg:rounded-2xl">
                      <Icon className="h-4 w-4 text-teal lg:h-5 lg:w-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-xl leading-none text-teal lg:text-3xl">{item.step}</p>
                      <p className="mt-1.5 text-xs leading-5 text-ink/65 sm:mt-3 sm:text-sm sm:leading-6">{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="font-display text-4xl leading-none sm:text-5xl lg:text-7xl">
            {s.ctaTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            {s.ctaDesc}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={contactDetails.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal px-6 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-white hover:text-ink"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
            <Button
              href="/contact"
              variant="outline"
              className="gap-2 border-white/30 px-6 py-3 text-xs text-white hover:border-white hover:bg-white hover:text-ink"
            >
              {tx.common.contactStudio}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Sidebar category button ───────────────────────────────────────────────────

function CategoryBtn({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 border px-3 py-2.5 text-left font-condensed text-xs uppercase tracking-editorial transition ${
        active
          ? "border-teal bg-teal text-white"
          : "border-transparent bg-transparent text-ink/60 hover:border-ink/20 hover:bg-bone hover:text-ink"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`shrink-0 font-condensed text-[0.6rem] tabular-nums ${
          active ? "text-white/70" : "text-ink/35"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  outOfStockLabel,
}: {
  product: StoreProduct;
  outOfStockLabel: string;
}) {
  return (
    <Link
      href={`/store/${product.id}`}
      className="group relative flex flex-col border border-ink/10 bg-white transition hover:border-teal/50 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bone">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-ink/10" strokeWidth={1} />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-ink/0 transition duration-300 group-hover:bg-ink/10" />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.tag && (
            <span className="bg-teal px-1.5 py-0.5 font-condensed text-[0.55rem] uppercase tracking-editorial text-white sm:text-[0.6rem]">
              {product.tag}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-ink/80 px-1.5 py-0.5 font-condensed text-[0.55rem] uppercase tracking-editorial text-white sm:text-[0.6rem]">
              {outOfStockLabel}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        {product.category && (
          <p className="font-condensed text-[0.55rem] uppercase tracking-editorial text-ink/35 sm:text-[0.6rem]">
            {product.category}
          </p>
        )}
        <h3 className="mt-0.5 font-display text-base leading-none sm:mt-1 sm:text-xl">
          {product.name}
        </h3>
        {product.desc && (
          <p className="mt-1 hidden flex-1 line-clamp-2 text-[0.7rem] leading-5 text-ink/55 sm:block sm:text-xs">
            {product.desc}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-2 sm:mt-3 sm:pt-3">
          <p className="font-display text-lg leading-none text-teal sm:text-2xl">
            {formatPrice(product.price)}
          </p>
          <span className="inline-flex items-center gap-0.5 font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/40 transition group-hover:text-teal sm:gap-1 sm:text-[0.65rem]">
            {product.inStock ? (
              <>View <ArrowRight size={10} className="sm:hidden" /><ArrowRight size={11} className="hidden sm:inline" /></>
            ) : (
              <span className="text-ink/25">{outOfStockLabel}</span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

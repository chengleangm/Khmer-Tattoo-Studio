"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";
import { contactDetails } from "@/data/site";
import { useEffect, useState } from "react";
import {
  ArrowRight, Clock, MessageCircle, Package, ShoppingBag, Truck,
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

const stepIcons = [ShoppingBag, MessageCircle, Package, Truck];

export default function StorePage() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const s = tx.store;

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setCategories(data.categories ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const usedCategories = categories.filter((cat) =>
    products.some((p) => p.category === cat)
  );

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const hasProducts = products.length > 0;

  return (
    <main>
      {/* Hero */}
      <section className="grain bg-ink px-5 py-14 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title={s.pageTitle} kicker={tx.kicker} light />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-white/60">
            {s.pageDesc}
          </p>
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && (
        <section className="px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse border border-ink/5 bg-bone" style={{ height: 320 }} />
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon — no products yet */}
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

      {/* Product grid */}
      {!loading && hasProducts && (
        <section
          className="editorial-section px-4 py-10 sm:px-5 sm:py-14 lg:px-8 lg:py-20"
          data-bg-word="STORE"
        >
          <div className="mx-auto max-w-7xl">
            {/* Category filter */}
            {usedCategories.length > 1 && (
              <div className="mb-8 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`border px-4 py-2 font-condensed text-xs uppercase tracking-editorial transition ${
                    activeFilter === "all"
                      ? "border-teal bg-teal text-white"
                      : "border-ink/20 text-ink/60 hover:border-teal hover:text-teal"
                  }`}
                >
                  {s.filterAll}
                </button>
                {usedCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveFilter(cat)}
                    className={`border px-4 py-2 font-condensed text-xs uppercase tracking-editorial transition ${
                      activeFilter === cat
                        ? "border-teal bg-teal text-white"
                        : "border-ink/20 text-ink/60 hover:border-teal hover:text-teal"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} outOfStockLabel={s.outOfStock} />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="py-10 text-center font-condensed text-xs uppercase tracking-editorial text-ink/40">
                No products in this category yet.
              </p>
            )}
          </div>
        </section>
      )}

      {/* How to order */}
      {!loading && hasProducts && (
        <section className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle title={s.howTitle} kicker={tx.kicker} />
            <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {s.howSteps.map((item, index) => {
                const Icon = stepIcons[index] ?? Package;
                return (
                  <article
                    key={item.step}
                    className="grid grid-cols-[2.75rem_1fr] gap-3 border-t-2 border-ink bg-bone p-3 sm:border-t-4 sm:p-5 lg:block lg:p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink lg:mb-4 lg:rounded-2xl">
                      <Icon className="h-5 w-5 text-teal" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-2xl leading-none text-teal lg:text-3xl">{item.step}</p>
                      <p className="mt-2 text-xs leading-5 text-ink/65 sm:mt-3 sm:text-sm sm:leading-6">{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="font-display text-4xl leading-none sm:text-6xl lg:text-7xl">
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
            <Button href="/contact" variant="outline" className="gap-2 border-white/30 px-6 py-3 text-xs text-white hover:border-white hover:bg-white hover:text-ink">
              {tx.common.contactStudio}
            </Button>
          </div>
        </div>
      </section>
    </main>
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
      className="group relative flex flex-col border border-ink/10 bg-white transition hover:border-teal/50"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bone">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-ink/15" strokeWidth={1} />
          </div>
        )}
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.tag && (
            <span className="bg-teal px-2 py-0.5 font-condensed text-[0.6rem] uppercase tracking-editorial text-white">
              {product.tag}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-ink/80 px-2 py-0.5 font-condensed text-[0.6rem] uppercase tracking-editorial text-white">
              {outOfStockLabel}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/40">
            {product.category}
          </p>
        )}
        <h3 className="mt-1 font-display text-xl leading-none sm:text-2xl">{product.name}</h3>
        {product.desc && (
          <p className="mt-2 flex-1 line-clamp-2 text-xs leading-5 text-ink/60">{product.desc}</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
          <p className="font-display text-2xl leading-none text-teal">{product.price}</p>
          <span className="inline-flex items-center gap-1 font-condensed text-[0.65rem] uppercase tracking-editorial text-ink/50 transition group-hover:text-teal">
            {product.inStock ? "Order" : outOfStockLabel}
            {product.inStock && <ArrowRight size={11} />}
          </span>
        </div>
      </div>
    </Link>
  );
}

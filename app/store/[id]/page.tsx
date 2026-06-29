"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Check, ChevronDown, MapPin, MessageCircle,
  Package, ShoppingBag, Store, Truck,
} from "lucide-react";
import { contactDetails } from "@/data/site";

// ── Types ─────────────────────────────────────────────────────────────────────

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

type Fulfillment = "pickup" | "delivery";

function formatPrice(price: string): string {
  if (!price) return "";
  if (price.startsWith("$")) return price;
  const n = parseFloat(price);
  return isNaN(n) ? price : `$${n % 1 === 0 ? n.toString() : n.toFixed(2)}`;
}

// ── Delivery zones for Siem Reap ──────────────────────────────────────────────

export const DELIVERY_ZONES = [
  {
    id: "zone1",
    label: "Pub Street / Old Market / Near studio (0 – 3 km)",
    fee: 1,
  },
  {
    id: "zone2",
    label: "Siem Reap city center (3 – 7 km)",
    fee: 2,
  },
  {
    id: "zone3",
    label: "NR6 / Hotel zone / Airport road (7 – 12 km)",
    fee: 3,
  },
  {
    id: "zone4",
    label: "Outskirts / Village areas (12 km+)",
    fee: 5,
  },
];

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  ready: "bg-purple-100 text-purple-700",
  delivered: "bg-teal/15 text-teal",
  cancelled: "bg-red-100 text-red-600",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "found" | "not-found">("loading");
  const [showOrder, setShowOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const found = (data.products as StoreProduct[])?.find((p) => p.id === params.id);
        if (found) {
          setProduct(found);
          setLoadState("found");
        } else {
          setLoadState("not-found");
        }
      })
      .catch(() => setLoadState("not-found"));
  }, [params.id]);

  if (loadState === "loading") {
    return (
      <main className="min-h-screen bg-bone">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-5 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-ink/10" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="aspect-square bg-ink/10" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-ink/10" />
                <div className="h-6 w-1/3 bg-ink/10" />
                <div className="h-24 bg-ink/10" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loadState === "not-found" || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bone px-4">
        <div className="text-center">
          <p className="font-display text-6xl text-ink/20">404</p>
          <p className="mt-3 font-condensed text-sm uppercase tracking-editorial text-ink/50">Product not found</p>
          <Link href="/store" className="mt-6 inline-flex items-center gap-2 bg-ink px-5 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal">
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>
      </main>
    );
  }

  const whatsappMsg = encodeURIComponent(`Hi! I'd like to order:\n${product.name} (${formatPrice(product.price)})\n\nPlease let me know availability and delivery options.`);
  const whatsappHref = `${contactDetails.whatsappHref}?text=${whatsappMsg}`;

  return (
    <main className="min-h-screen bg-bone">
      {/* Breadcrumb */}
      <div className="border-b border-ink/10 bg-white px-4 py-3 sm:px-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 font-condensed text-xs uppercase tracking-editorial text-ink/40">
          <Link href="/store" className="flex items-center gap-1.5 transition hover:text-teal">
            <Store size={12} /> Store
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <span>{product.category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-ink/70">{product.name}</span>
        </div>
      </div>

      {/* Product detail */}
      <section className="px-4 py-8 sm:px-5 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-white border border-ink/10">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ShoppingBag className="h-20 w-20 text-ink/15" strokeWidth={1} />
                </div>
              )}
              {product.tag && (
                <span className="absolute left-4 top-4 bg-teal px-3 py-1 font-condensed text-xs uppercase tracking-editorial text-white">
                  {product.tag}
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
                  <span className="bg-ink px-4 py-2 font-condensed text-sm uppercase tracking-editorial text-white">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Info + CTA */}
            <div className="flex flex-col">
              {product.category && (
                <p className="font-condensed text-xs uppercase tracking-editorial text-ink/40">
                  {product.category}
                </p>
              )}
              <h1 className="mt-2 font-display text-[clamp(2rem,8vw,4rem)] leading-[0.85]">
                {product.name}
              </h1>
              <p className="mt-4 font-display text-4xl leading-none text-teal sm:text-5xl">
                {formatPrice(product.price)}
              </p>

              {product.desc && (
                <p className="mt-5 text-sm leading-6 text-ink/65 sm:text-base sm:leading-7">
                  {product.desc}
                </p>
              )}

              {/* Info badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 border border-ink/15 bg-white px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink/60">
                  <Store size={13} className="text-teal" /> Pick up from studio
                </span>
                <span className="flex items-center gap-1.5 border border-ink/15 bg-white px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink/60">
                  <Truck size={13} className="text-teal" /> Delivery in Siem Reap
                </span>
                <span className="flex items-center gap-1.5 border border-ink/15 bg-white px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink/60">
                  <Package size={13} className="text-teal" /> Cash on Delivery (COD)
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {product.inStock ? (
                  <button
                    type="button"
                    onClick={() => { setShowOrder(true); setOrderSuccess(null); }}
                    className="inline-flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 font-condensed text-sm uppercase tracking-editorial text-white transition hover:bg-teal sm:w-auto sm:justify-start"
                  >
                    <ShoppingBag size={16} />
                    Order Now — COD
                  </button>
                ) : (
                  <p className="font-condensed text-sm uppercase tracking-editorial text-ink/40">
                    Currently out of stock
                  </p>
                )}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 border border-ink/20 px-6 py-3 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:border-teal hover:text-teal sm:w-auto sm:justify-start"
                >
                  <MessageCircle size={14} />
                  Ask via WhatsApp
                </a>
              </div>

              <p className="mt-6 text-xs leading-5 text-ink/40">
                COD only · Local Siem Reap delivery · No online payment required
              </p>
            </div>
          </div>

          {/* Order form */}
          {showOrder && !orderSuccess && product.inStock && (
            <div className="mt-10">
              <div className="border-t-2 border-teal bg-white p-5 sm:p-8">
                <h2 className="font-display text-3xl leading-none sm:text-4xl">PLACE YOUR ORDER</h2>
                <p className="mt-2 text-sm text-ink/55">
                  Cash on Delivery · Siem Reap only · We confirm by phone
                </p>
                <OrderForm
                  product={product}
                  onSuccess={(orderId) => {
                    setOrderSuccess(orderId);
                    setShowOrder(false);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                  }}
                  onCancel={() => setShowOrder(false)}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {orderSuccess && (
            <div className="mt-10 border-t-2 border-teal bg-white p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-teal">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-2xl leading-none sm:text-3xl">Order Received!</h2>
                  <p className="mt-3 text-sm leading-6 text-ink/65">
                    Thank you! We will call or WhatsApp you to confirm your order and arrange delivery or pick-up. Your order ID is <strong className="text-ink">{orderSuccess.split("-")[0]}</strong>.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={contactDetails.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-teal px-4 py-2.5 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-ink"
                    >
                      <MessageCircle size={13} /> WhatsApp Studio
                    </a>
                    <Link
                      href="/store"
                      className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white"
                    >
                      <ArrowLeft size={13} /> Back to Store
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// ── Order Form ────────────────────────────────────────────────────────────────

function OrderForm({
  product,
  onSuccess,
  onCancel,
}: {
  product: StoreProduct;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}) {
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [zoneId, setZoneId] = useState(DELIVERY_ZONES[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedZone = DELIVERY_ZONES.find((z) => z.id === zoneId) ?? DELIVERY_ZONES[0];
  const deliveryFee = fulfillment === "delivery" ? selectedZone.fee : 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (fulfillment === "delivery" && !address.trim()) {
      setError("Please enter your delivery address."); return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          fulfillment,
          deliveryZoneId: fulfillment === "delivery" ? selectedZone.id : "pickup",
          deliveryZoneLabel: fulfillment === "delivery" ? selectedZone.label : "Pick up from studio",
          deliveryFee,
          deliveryAddress: fulfillment === "delivery" ? address.trim() : "",
          note: note.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed.");
      onSuccess(data.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed. Please try WhatsApp instead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
      {/* Product summary */}
      <div className="flex items-center gap-4 border border-ink/10 bg-bone p-4">
        {product.imageUrl && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-ink/10">
            <Image src={product.imageUrl} alt={product.name} fill sizes="64px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-condensed text-xs uppercase tracking-editorial text-ink/45">{product.category}</p>
          <p className="font-display text-lg leading-none">{product.name}</p>
          <p className="mt-1 font-display text-xl leading-none text-teal">{formatPrice(product.price)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center border border-ink/20 font-condensed text-sm text-ink transition hover:bg-ink hover:text-white">−</button>
          <span className="w-6 text-center font-condensed text-sm">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="flex h-8 w-8 items-center justify-center border border-ink/20 font-condensed text-sm text-ink transition hover:bg-ink hover:text-white">+</button>
        </div>
      </div>

      {/* Fulfillment */}
      <div>
        <p className="mb-3 font-condensed text-xs uppercase tracking-editorial text-ink/55">
          How do you want it?
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setFulfillment("pickup")}
            className={`flex items-center gap-3 border p-3 text-left transition ${
              fulfillment === "pickup"
                ? "border-teal bg-teal/5"
                : "border-ink/15 hover:border-teal/50"
            }`}
          >
            <Store size={20} className={fulfillment === "pickup" ? "text-teal" : "text-ink/40"} strokeWidth={1.5} />
            <div>
              <p className="font-condensed text-xs uppercase tracking-editorial">Pick up</p>
              <p className="mt-0.5 text-xs text-ink/50">Free · From studio</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFulfillment("delivery")}
            className={`flex items-center gap-3 border p-3 text-left transition ${
              fulfillment === "delivery"
                ? "border-teal bg-teal/5"
                : "border-ink/15 hover:border-teal/50"
            }`}
          >
            <Truck size={20} className={fulfillment === "delivery" ? "text-teal" : "text-ink/40"} strokeWidth={1.5} />
            <div>
              <p className="font-condensed text-xs uppercase tracking-editorial">Delivery</p>
              <p className="mt-0.5 text-xs text-ink/50">Siem Reap · $1–$5</p>
            </div>
          </button>
        </div>
      </div>

      {/* Delivery zone */}
      {fulfillment === "delivery" && (
        <div className="grid gap-3">
          <label className="grid gap-1.5">
            <span className="font-condensed text-xs uppercase tracking-editorial text-ink/55">
              <MapPin size={11} className="mr-1 inline" />Your area in Siem Reap
            </span>
            <div className="relative">
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full appearance-none border border-ink/15 bg-bone py-3 pl-3 pr-10 text-sm outline-none focus:border-teal"
              >
                {DELIVERY_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.label} — ${z.fee} delivery fee
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" />
            </div>
            <p className="text-xs text-teal">
              Delivery fee: <strong>${selectedZone.fee}</strong>
            </p>
          </label>
          <label className="grid gap-1.5">
            <span className="font-condensed text-xs uppercase tracking-editorial text-ink/55">
              Full delivery address *
            </span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="resize-none border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
              placeholder="Street, area, landmark near your location..."
            />
          </label>
        </div>
      )}

      {/* Customer info */}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-condensed text-xs uppercase tracking-editorial text-ink/55">Your Name *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
            placeholder="Full name"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="font-condensed text-xs uppercase tracking-editorial text-ink/55">Phone / WhatsApp *</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
            placeholder="+855 ..."
            type="tel"
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="font-condensed text-xs uppercase tracking-editorial text-ink/55">Note (optional)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="resize-none border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
          placeholder="Size, colour, or any special request..."
        />
      </label>

      {/* Order summary */}
      <div className="border border-ink/10 bg-bone p-4">
        <p className="font-condensed text-xs uppercase tracking-editorial text-ink/55">Order Summary</p>
        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/65">{product.name} × {quantity}</span>
            <span>{formatPrice(product.price)}{quantity > 1 ? ` × ${quantity}` : ""}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/65">
              {fulfillment === "pickup" ? "Pick up from studio" : `Delivery — ${selectedZone.label.split("(")[0].trim()}`}
            </span>
            <span className={deliveryFee === 0 ? "text-teal" : ""}>
              {deliveryFee === 0 ? "Free" : `$${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 font-condensed text-xs uppercase tracking-editorial">
            <span>Payment Method</span>
            <span className="text-teal">Cash on Delivery (COD)</span>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-ink/40">
          We will call or WhatsApp you to confirm before delivery. No payment until you receive.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 bg-ink py-3.5 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingBag size={15} />
          {loading ? "Placing order..." : "Confirm Order (COD)"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-ink/20 px-5 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

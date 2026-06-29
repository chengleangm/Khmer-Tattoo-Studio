"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check, ChevronDown, MapPin, Package, Phone, RefreshCcw, Store, Trash2, Truck, X,
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "ready" | "delivered" | "cancelled";

type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  fulfillment: "pickup" | "delivery";
  deliveryZoneId: string;
  deliveryZoneLabel: string;
  deliveryFee: number;
  deliveryAddress: string;
  note: string;
};

const TOKEN_KEY = "khmer_tattoo_admin_token";

const STATUS_META: Record<OrderStatus, { label: string; color: string; next: OrderStatus | null; nextLabel: string }> = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",   next: "confirmed", nextLabel: "Confirm" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700",     next: "ready",     nextLabel: "Mark Ready" },
  ready:     { label: "Ready",     color: "bg-purple-100 text-purple-700", next: "delivered",  nextLabel: "Mark Delivered" },
  delivered: { label: "Delivered", color: "bg-teal/15 text-teal",           next: null,        nextLabel: "" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600",        next: null,        nextLabel: "" },
};

const STATUS_FILTERS: Array<{ id: "all" | OrderStatus; label: string }> = [
  { id: "all",       label: "All" },
  { id: "pending",   label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "ready",     label: "Ready" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

// Revenue helpers
function parsePrice(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function orderTotal(order: Order): number {
  return parsePrice(order.productPrice) * order.quantity + order.deliveryFee;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return d >= monday;
}

export default function AdminOrdersManager() {
  const router = useRouter();
  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(TOKEN_KEY) ?? "";
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  async function load(currentToken = token) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-token": currentToken },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Load failed.");
      setOrders(data.orders ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Load failed.");
      if (error instanceof Error && error.message === "Unauthorized.") {
        window.sessionStorage.removeItem(TOKEN_KEY);
        router.push("/admin");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(id: string, status: OrderStatus) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setMessage("Status updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrder(id: string) {
    if (!confirm("Delete this order permanently?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setMessage("Order deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-xl border border-ink/10 bg-white p-5">
        <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Admin</p>
        <h2 className="mt-2 font-display text-[clamp(2rem,10vw,4rem)] leading-[0.78]">Login Required</h2>
        <a href="/admin" className="mt-5 inline-flex items-center gap-2 bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal">
          Go To Login
        </a>
      </div>
    );
  }

  const pending   = orders.filter((o) => o.status === "pending").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const ready     = orders.filter((o) => o.status === "ready").length;

  const nonCancelled = orders.filter((o) => o.status !== "cancelled");
  const todayIncome  = nonCancelled.filter((o) => isToday(o.createdAt)).reduce((s, o) => s + orderTotal(o), 0);
  const weekIncome   = nonCancelled.filter((o) => isThisWeek(o.createdAt)).reduce((s, o) => s + orderTotal(o), 0);
  const totalReceived = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + orderTotal(o), 0);
  const pendingRevenue = orders
    .filter((o) => o.status === "confirmed" || o.status === "ready")
    .reduce((s, o) => s + orderTotal(o), 0);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Order count stats */}
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Orders", value: orders.length, color: "text-ink" },
          { label: "Pending",      value: pending,        color: "text-amber-600" },
          { label: "Confirmed",    value: confirmed,      color: "text-blue-600" },
          { label: "Ready",        value: ready,          color: "text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="border border-ink/10 bg-white p-4">
            <p className={`font-display text-4xl leading-none ${stat.color}`}>{stat.value}</p>
            <p className="mt-2 font-condensed text-[0.65rem] uppercase tracking-editorial text-ink/50">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Income stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Today's Income",   value: todayIncome,    color: "text-teal",        note: "non-cancelled" },
          { label: "This Week",        value: weekIncome,     color: "text-teal",        note: "non-cancelled" },
          { label: "Total Received",   value: totalReceived,  color: "text-emerald-600", note: "delivered only" },
          { label: "Pending Revenue",  value: pendingRevenue, color: "text-amber-600",   note: "confirmed + ready" },
        ].map((stat) => (
          <div key={stat.label} className="border border-ink/10 bg-white p-4">
            <p className={`font-display text-3xl leading-none ${stat.color}`}>
              ${stat.value.toFixed(2)}
            </p>
            <p className="mt-2 font-condensed text-[0.65rem] uppercase tracking-editorial text-ink/50">{stat.label}</p>
            <p className="mt-0.5 font-condensed text-[0.55rem] uppercase tracking-editorial text-ink/30">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => {
            const count = f.id === "all" ? orders.length : orders.filter((o) => o.status === f.id).length;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`border px-3 py-1.5 font-condensed text-[0.65rem] uppercase tracking-editorial transition ${
                  filter === f.id
                    ? "border-teal bg-teal text-white"
                    : "border-ink/15 text-ink/55 hover:border-teal hover:text-teal"
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => load()}
          className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {message && (
        <p className="mb-4 border-l-2 border-teal pl-3 text-sm text-ink/65">{message}</p>
      )}

      {/* Orders */}
      <div className="grid gap-3">
        {filtered.length === 0 && !loading && (
          <div className="border border-dashed border-ink/20 p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-ink/15" strokeWidth={1} />
            <p className="mt-3 font-condensed text-xs uppercase tracking-editorial text-ink/40">
              {filter === "all" ? "No orders yet" : `No ${filter} orders`}
            </p>
          </div>
        )}

        {filtered.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            loading={loading}
            onUpdateStatus={updateStatus}
            onDelete={deleteOrder}
          />
        ))}
      </div>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  loading,
  onUpdateStatus,
  onDelete,
}: {
  order: Order;
  loading: boolean;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}) {
  const meta = STATUS_META[order.status];
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <article className={`border bg-white p-4 sm:p-5 ${
      order.status === "pending" ? "border-amber-200" :
      order.status === "cancelled" ? "border-red-100 opacity-70" :
      "border-ink/10"
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Left: order info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 font-condensed text-[0.6rem] uppercase tracking-editorial ${meta.color}`}>
              {meta.label}
            </span>
            <span className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/35">
              #{order.id.split("-")[0]}
            </span>
            <span className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/35">
              {dateStr} · {timeStr}
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {/* Product */}
            <div>
              <p className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/40">Product</p>
              <p className="mt-0.5 font-display text-lg leading-none">{order.productName}</p>
              <p className="mt-1 font-condensed text-sm text-teal">
                {order.productPrice.startsWith("$") ? order.productPrice : `$${order.productPrice}`} × {order.quantity}
              </p>
            </div>

            {/* Customer */}
            <div>
              <p className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/40">Customer</p>
              <p className="mt-0.5 font-condensed text-sm uppercase tracking-editorial">{order.customerName}</p>
              <a
                href={`tel:${order.customerPhone}`}
                className="mt-1 flex items-center gap-1 text-xs text-ink/55 hover:text-teal"
              >
                <Phone size={11} /> {order.customerPhone}
              </a>
            </div>

            {/* Fulfillment */}
            <div>
              <p className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/40">Fulfillment</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                {order.fulfillment === "pickup" ? (
                  <Store size={13} className="text-teal" />
                ) : (
                  <Truck size={13} className="text-teal" />
                )}
                <span className="font-condensed text-xs uppercase tracking-editorial">
                  {order.fulfillment === "pickup" ? "Pick up from studio" : "Delivery"}
                </span>
              </div>
              {order.fulfillment === "delivery" && (
                <>
                  <p className="mt-1 flex items-start gap-1 text-xs text-ink/55">
                    <MapPin size={11} className="mt-0.5 shrink-0" />
                    {order.deliveryZoneLabel}
                  </p>
                  {order.deliveryAddress && (
                    <p className="mt-1 text-xs text-ink/55">{order.deliveryAddress}</p>
                  )}
                  <p className="mt-1 font-condensed text-xs uppercase tracking-editorial text-teal">
                    Delivery fee: ${order.deliveryFee}
                  </p>
                </>
              )}
            </div>

            {/* Payment */}
            <div>
              <p className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/40">Payment</p>
              <p className="mt-0.5 font-condensed text-xs uppercase tracking-editorial text-ink">Cash on Delivery (COD)</p>
              {order.note && (
                <p className="mt-2 text-xs leading-5 text-ink/55">
                  <span className="font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/30">Note: </span>
                  {order.note}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
        {meta.next && (
          <button
            type="button"
            disabled={loading}
            onClick={() => onUpdateStatus(order.id, meta.next!)}
            className="inline-flex items-center gap-1.5 bg-ink px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:opacity-60"
          >
            <Check size={13} />
            {meta.nextLabel}
          </button>
        )}
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => onUpdateStatus(order.id, "cancelled")}
            className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
          >
            <X size={13} />
            Cancel
          </button>
        )}
        <a
          href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${order.customerName}! Your order for ${order.productName} is ${meta.label.toLowerCase()}. `)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-ink/15 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink/60 transition hover:border-teal hover:text-teal"
        >
          WhatsApp Customer
        </a>
        <button
          type="button"
          disabled={loading}
          onClick={() => onDelete(order.id)}
          className="ml-auto inline-flex items-center gap-1.5 border border-ink/10 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink/35 transition hover:border-red-300 hover:text-red-500 disabled:opacity-60"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </article>
  );
}

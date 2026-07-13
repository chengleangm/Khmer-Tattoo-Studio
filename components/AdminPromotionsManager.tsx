"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, RefreshCcw, Star, Trash2, X } from "lucide-react";
import { Promotion } from "@/lib/promotions";
import AdminGiveawayManager from "@/components/AdminGiveawayManager";

const TOKEN_KEY = "khmer_tattoo_admin_token";
const BLANK = { title: "", badge: "Special Offer", description: "", code: "", startDate: "", endDate: "", ctaLabel: "Book This Offer", ctaHref: "/booking", featured: false, visible: true };

export default function AdminPromotionsManager() {
  const [token] = useState(() => typeof window === "undefined" ? "" : sessionStorage.getItem(TOKEN_KEY) ?? "");
  const [items, setItems] = useState<Promotion[]>([]);
  const [form, setForm] = useState({ ...BLANK });
  const [image, setImage] = useState<File | null>(null);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load(currentToken = token) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/promotions", { headers: { "x-admin-token": currentToken }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load promotions.");
      setItems(data.promotions ?? []);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load promotions."); }
    finally { setLoading(false); }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (token) void load(token); }, [token]);

  async function create(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return setMessage("Title and description are required.");
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.set(key, String(value)));
    if (image) body.set("image", image);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/promotions", { method: "POST", headers: { "x-admin-token": token }, body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Create failed.");
      setItems((current) => [...current, data.promotion]); setForm({ ...BLANK }); setImage(null); setMessage("Promotion created.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Create failed."); }
    finally { setLoading(false); }
  }

  async function update(changes: Partial<Promotion> & { id: string }) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/promotions", { method: "PATCH", headers: { "content-type": "application/json", "x-admin-token": token }, body: JSON.stringify(changes) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed.");
      setItems((current) => current.map((item) => item.id === changes.id ? data.promotion : item)); setEditing(null); setMessage("Promotion updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Update failed."); }
    finally { setLoading(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this promotion?")) return;
    const response = await fetch("/api/admin/promotions", { method: "DELETE", headers: { "content-type": "application/json", "x-admin-token": token }, body: JSON.stringify({ id }) });
    if (response.ok) { setItems((current) => current.filter((item) => item.id !== id)); setMessage("Promotion deleted."); }
  }

  if (!token) return <div className="mx-auto max-w-xl border border-ink/10 bg-white p-6"><h2 className="font-display text-5xl">LOGIN REQUIRED</h2><a href="/admin" className="mt-5 inline-flex bg-ink px-5 py-3 font-condensed text-xs uppercase tracking-editorial text-white">Go to login</a></div>;

  return <div className="mx-auto max-w-7xl">
    <div className="mb-5 flex items-center justify-between border-b border-ink/10 pb-4"><div><p className="font-condensed text-xs uppercase tracking-editorial text-teal">Promotion Manager</p><p className="mt-1 text-sm text-ink/50">{items.filter((item) => item.visible).length} live · {items.length} total</p></div><button type="button" onClick={() => load()} disabled={loading} className="inline-flex h-10 items-center gap-2 border border-ink/20 px-4 font-condensed text-xs uppercase tracking-editorial"><RefreshCcw size={14} /> Refresh</button></div>
    {message && <p className="mb-4 border-l-2 border-teal pl-3 text-sm text-ink/65">{message}</p>}
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={create} className="h-fit border border-ink/10 bg-white p-5"><p className="font-condensed text-xs uppercase tracking-editorial text-teal">Add Promotion</p><PromotionFields value={form} onChange={setForm} /><label className="mt-3 grid gap-1.5"><span className="label-xs">Promotion Image</span><input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className="field py-2" /></label><button disabled={loading} className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-teal px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white"><Plus size={15} /> Add Promotion</button></form>
      <div className="grid gap-4">{items.length === 0 && <div className="border border-dashed border-ink/20 p-10 text-center text-sm text-ink/50">No promotions yet. Add your first offer.</div>}{items.map((item) => <article key={item.id} className="grid gap-4 border border-ink/10 bg-white p-4 sm:grid-cols-[150px_1fr]"><div className="relative aspect-[4/3] overflow-hidden bg-ink">{item.imageUrl ? <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover" /> : null}</div><div className="min-w-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-condensed text-[10px] uppercase tracking-editorial text-teal">{item.badge}</p><h3 className="mt-1 font-display text-3xl leading-none">{item.title}</h3></div><div className="flex gap-2"><button onClick={() => update({ id: item.id, visible: !item.visible })} className="icon-admin" aria-label="Toggle visibility">{item.visible ? <Eye size={15} /> : <EyeOff size={15} />}</button><button onClick={() => update({ id: item.id, featured: !item.featured })} className={`icon-admin ${item.featured ? "text-teal" : ""}`} aria-label="Toggle featured"><Star size={15} /></button><button onClick={() => setEditing(item)} className="icon-admin" aria-label="Edit"><Pencil size={15} /></button><button onClick={() => remove(item.id)} className="icon-admin text-red-600" aria-label="Delete"><Trash2 size={15} /></button></div></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/55">{item.description}</p><p className="mt-3 font-condensed text-[10px] uppercase tracking-editorial text-ink/40">{item.visible ? "Live" : "Draft"}{item.featured ? " · Featured" : ""}{item.code ? ` · Code: ${item.code}` : ""}</p></div></article>)}</div>
    </div>
    <AdminGiveawayManager />
    {editing && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4"><div className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white p-5 sm:p-7"><div className="flex justify-between"><h2 className="font-display text-4xl">EDIT PROMOTION</h2><button onClick={() => setEditing(null)}><X /></button></div><PromotionFields value={editing} onChange={setEditing} /><button onClick={() => update(editing)} disabled={loading} className="mt-5 w-full bg-teal px-5 py-3 font-condensed text-xs uppercase tracking-editorial text-white">Save Changes</button></div></div>}
  </div>;
}

type FieldValue = typeof BLANK | Promotion;
function PromotionFields<T extends FieldValue>({ value, onChange }: { value: T; onChange: (value: T) => void }) {
  const set = (key: keyof T, next: string | boolean) => onChange({ ...value, [key]: next });
  return <div className="mt-4 grid gap-3"><label className="grid gap-1.5"><span className="label-xs">Title *</span><input className="field" value={value.title} onChange={(e) => set("title", e.target.value)} /></label><div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5"><span className="label-xs">Badge</span><input className="field" value={value.badge} onChange={(e) => set("badge", e.target.value)} /></label><label className="grid gap-1.5"><span className="label-xs">Promo Code</span><input className="field" value={value.code} onChange={(e) => set("code", e.target.value)} /></label></div><label className="grid gap-1.5"><span className="label-xs">Description *</span><textarea className="field min-h-28 py-3" value={value.description} onChange={(e) => set("description", e.target.value)} /></label><div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5"><span className="label-xs">Start Date</span><input type="date" className="field" value={value.startDate} onChange={(e) => set("startDate", e.target.value)} /></label><label className="grid gap-1.5"><span className="label-xs">End Date</span><input type="date" className="field" value={value.endDate} onChange={(e) => set("endDate", e.target.value)} /></label></div><label className="grid gap-1.5"><span className="label-xs">Button Text</span><input className="field" value={value.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} /></label><label className="grid gap-1.5"><span className="label-xs">Button Link</span><input className="field" value={value.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} /></label><div className="flex gap-5"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.visible} onChange={(e) => set("visible", e.target.checked)} /> Live</label></div></div>;
}

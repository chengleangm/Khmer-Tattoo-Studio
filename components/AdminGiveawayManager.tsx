"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Dices, RefreshCcw, RotateCcw, Trash2, Trophy } from "lucide-react";
import { GiveawayEntry } from "@/lib/giveaway";

const TOKEN_KEY = "khmer_tattoo_admin_token";

export default function AdminGiveawayManager() {
  const [token] = useState(() => typeof window === "undefined" ? "" : sessionStorage.getItem(TOKEN_KEY) ?? "");
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [message, setMessage] = useState("");
  const filtered = useMemo(() => entries.filter((entry) => entry.month === month), [entries, month]);
  const winner = filtered.find((entry) => entry.winner);

  async function load(currentToken = token) { const response = await fetch("/api/admin/giveaway", { headers: { "x-admin-token": currentToken }, cache: "no-store" }); const data = await response.json(); if (response.ok) setEntries(data.entries ?? []); else setMessage(data.error || "Load failed."); }
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (token) void load(token); }, [token]);
  async function action(name: "draw" | "clear-winner") { if (name === "draw" && !confirm(`Randomly select a winner for ${month}?`)) return; const response = await fetch("/api/admin/giveaway", { method: "PATCH", headers: { "content-type": "application/json", "x-admin-token": token }, body: JSON.stringify({ action: name, month }) }); const data = await response.json(); if (!response.ok) return setMessage(data.error || "Action failed."); setEntries(data.entries); setMessage(name === "draw" ? `Winner selected: ${data.winner.name}` : "Winner cleared."); }
  async function remove(id: string) { if (!confirm("Delete this giveaway entry?")) return; const response = await fetch("/api/admin/giveaway", { method: "DELETE", headers: { "content-type": "application/json", "x-admin-token": token }, body: JSON.stringify({ id }) }); if (response.ok) setEntries((current) => current.filter((entry) => entry.id !== id)); }

  return <section className="mt-10 border-t border-ink/15 pt-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-condensed text-xs uppercase tracking-editorial text-teal">Monthly Giveaway</p><h2 className="mt-2 font-display text-5xl leading-none">ENTRIES & RANDOM WINNER</h2></div><div className="flex flex-wrap gap-2"><input type="month" className="field w-auto" value={month} onChange={(e) => setMonth(e.target.value)} /><button onClick={() => load()} className="icon-admin" aria-label="Refresh"><RefreshCcw size={15} /></button></div></div>{message && <p className="mt-4 border-l-2 border-teal pl-3 text-sm text-ink/65">{message}</p>}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-ink/10 bg-white p-4"><p className="font-condensed text-xs uppercase tracking-editorial text-ink/50">{filtered.length} eligible {filtered.length === 1 ? "entry" : "entries"}</p><div className="flex gap-2"><button onClick={() => action("draw")} disabled={!filtered.length} className="inline-flex items-center gap-2 bg-teal px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white disabled:opacity-30"><Dices size={15} /> Pick Random Winner</button>{winner && <button onClick={() => action("clear-winner")} className="inline-flex items-center gap-2 border border-ink/20 px-4 font-condensed text-xs uppercase tracking-editorial"><RotateCcw size={14} /> Reset</button>}</div></div>
    {winner && <div className="mt-4 border-2 border-teal bg-teal/10 p-5"><p className="flex items-center gap-2 font-condensed text-xs uppercase tracking-editorial text-teal"><Trophy size={16} /> Selected Winner</p><p className="mt-2 font-display text-4xl">{winner.name}</p><a href={`tel:${winner.phone}`} className="mt-2 block text-sm text-ink/65">{winner.phone}</a><p className="mt-2 text-sm leading-6 text-ink/65">{winner.tattooIdea}</p></div>}
    <div className="mt-4 grid gap-3">{filtered.map((entry) => <article key={entry.id} className={`grid gap-4 border bg-white p-4 sm:grid-cols-[90px_1fr_auto] ${entry.winner ? "border-teal" : "border-ink/10"}`}><div className="relative aspect-square overflow-hidden bg-bone">{entry.imageUrl && <Image src={entry.imageUrl} alt="Tattoo reference" fill unoptimized className="object-cover" />}</div><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-2xl">{entry.name}</h3>{entry.winner && <span className="bg-teal px-2 py-1 font-condensed text-[9px] uppercase tracking-editorial text-white">Winner</span>}</div><a href={`tel:${entry.phone}`} className="text-sm text-teal">{entry.phone}</a><p className="mt-2 text-sm leading-6 text-ink/60">{entry.tattooIdea}</p><p className="mt-2 text-[10px] text-ink/35">{new Date(entry.createdAt).toLocaleString()}</p></div><button onClick={() => remove(entry.id)} className="icon-admin text-red-600" aria-label="Delete entry"><Trash2 size={15} /></button></article>)}{!filtered.length && <div className="border border-dashed border-ink/20 p-8 text-center text-sm text-ink/45">No entries for this month.</div>}</div>
  </section>;
}

"use client";

import { FormEvent, useState } from "react";
import { Gift, ImagePlus, Phone, Sparkles } from "lucide-react";

export default function GiveawayRegistration() {
  const [form, setForm] = useState({ name: "", phone: "", tattooIdea: "" });
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.set(key, value));
    if (image) body.set("image", image);
    try {
      const response = await fetch("/api/giveaway", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed.");
      setStatus("success"); setForm({ name: "", phone: "", tattooIdea: "" }); setImage(null);
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Registration failed."); }
  }

  return <section className="bg-ink px-4 py-14 text-white sm:px-5 sm:py-20 lg:px-8 lg:py-24">
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
      <div><p className="flex items-center gap-2 font-condensed text-xs uppercase tracking-editorial text-teal"><Gift size={15} /> Monthly Tattoo Giveaway</p><h2 className="mt-4 font-display text-[clamp(3.5rem,12vw,7.5rem)] leading-[0.8]">ENTER. DREAM. WIN.</h2><p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base">Register once each month for a chance to win our tattoo prize. Tell us what tattoo you want and leave a phone number so the studio can contact the randomly selected winner.</p><div className="mt-6 grid gap-3 text-sm text-white/70"><p className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> One entry per phone number each month.</p><p className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> Your phone number is private and visible only to the studio admin.</p></div></div>
      {status === "success" ? <div className="border border-teal bg-white p-8 text-center text-ink sm:p-12"><Gift className="mx-auto h-12 w-12 text-teal" /><h3 className="mt-5 font-display text-5xl">YOU&apos;RE ENTERED!</h3><p className="mt-3 text-sm leading-6 text-ink/60">Your entry is saved for this month. We will contact the winner by phone.</p><button onClick={() => setStatus("idle")} className="mt-6 font-condensed text-xs uppercase tracking-editorial text-teal">Enter another person</button></div> : <form onSubmit={submit} className="bg-white p-5 text-ink sm:p-8"><p className="font-condensed text-xs uppercase tracking-editorial text-teal">Monthly Registration</p><div className="mt-5 grid gap-4"><label className="grid gap-1.5"><span className="label-xs">Your Name *</span><input required className="field" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} /></label><label className="grid gap-1.5"><span className="label-xs">Phone / WhatsApp *</span><input required type="tel" className="field" placeholder="+855 ..." value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} /></label><label className="grid gap-1.5"><span className="label-xs">Tattoo You Want *</span><textarea required className="field min-h-28 py-3" placeholder="Style, placement, meaning, size..." value={form.tattooIdea} onChange={(e) => setForm((v) => ({ ...v, tattooIdea: e.target.value }))} /></label><label className="grid gap-1.5"><span className="label-xs">Reference Image (Optional)</span><span className="flex min-h-12 cursor-pointer items-center gap-3 border border-dashed border-ink/25 px-4 text-sm text-ink/50"><ImagePlus size={18} className="text-teal" />{image?.name || "Choose tattoo reference"}<input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] ?? null)} /></span></label></div>{message && <p className="mt-4 text-sm text-red-600">{message}</p>}<button disabled={status === "sending"} className="mt-5 w-full bg-teal px-5 py-4 font-condensed text-xs uppercase tracking-editorial text-white disabled:opacity-50">{status === "sending" ? "Registering..." : "Enter Monthly Draw"}</button><p className="mt-3 text-center text-[11px] leading-5 text-ink/40">By entering, you agree that the studio may contact you about this giveaway.</p></form>}
    </div>
  </section>;
}

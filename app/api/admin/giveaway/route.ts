import { del, put, readJson } from "@/lib/r2-blob";
import { GiveawayEntry, GIVEAWAY_ENTRIES_PATH } from "@/lib/giveaway";
import { NextRequest } from "next/server";

function authorized(request: NextRequest) {
  return Boolean(process.env.ADMIN_UPLOAD_TOKEN && request.headers.get("x-admin-token") === process.env.ADMIN_UPLOAD_TOKEN);
}

async function readEntries() { return (await readJson<GiveawayEntry[]>(GIVEAWAY_ENTRIES_PATH)) ?? []; }
async function saveEntries(entries: GiveawayEntry[]) { await put(GIVEAWAY_ENTRIES_PATH, JSON.stringify(entries), { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true }); }

export async function GET(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const entries = await readEntries();
  return Response.json({ entries: entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) });
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null) as { action?: string; month?: string; id?: string } | null;
  const entries = await readEntries();
  if (body?.action === "draw") {
    const eligible = entries.filter((entry) => entry.month === body.month);
    if (!eligible.length) return Response.json({ error: "No entries for this month." }, { status: 400 });
    const random = eligible[Math.floor(Math.random() * eligible.length)];
    entries.forEach((entry) => { if (entry.month === body.month) entry.winner = entry.id === random.id; });
    await saveEntries(entries);
    return Response.json({ ok: true, winner: random, entries });
  }
  if (body?.action === "clear-winner") {
    entries.forEach((entry) => { if (entry.month === body.month) entry.winner = false; });
    await saveEntries(entries);
    return Response.json({ ok: true, entries });
  }
  return Response.json({ error: "Unknown action." }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null) as { id?: string } | null;
  const entries = await readEntries();
  const entry = entries.find((item) => item.id === body?.id);
  if (!entry) return Response.json({ error: "Entry not found." }, { status: 404 });
  if (entry.imageUrl) await del(entry.imageUrl).catch(() => undefined);
  await saveEntries(entries.filter((item) => item.id !== entry.id));
  return Response.json({ ok: true });
}

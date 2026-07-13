import { hasR2Storage, put, readJson } from "@/lib/r2-blob";
import { GiveawayEntry, GIVEAWAY_ENTRIES_PATH, GIVEAWAY_IMAGE_PREFIX } from "@/lib/giveaway";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export async function POST(request: Request) {
  if (!hasR2Storage()) return Response.json({ error: "Registration is temporarily unavailable." }, { status: 503 });
  const data = await request.formData();
  const name = String(data.get("name") ?? "").trim().slice(0, 80);
  const phone = String(data.get("phone") ?? "").trim().slice(0, 40);
  const tattooIdea = String(data.get("tattooIdea") ?? "").trim().slice(0, 800);
  if (!name || !phone || !tattooIdea) return Response.json({ error: "Name, phone number, and tattoo idea are required." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 7) return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });

  const month = currentMonth();
  const entries = (await readJson<GiveawayEntry[]>(GIVEAWAY_ENTRIES_PATH)) ?? [];
  const normalizedPhone = phone.replace(/\D/g, "");
  if (entries.some((entry) => entry.month === month && entry.phone.replace(/\D/g, "") === normalizedPhone)) {
    return Response.json({ error: "This phone number is already registered for this month." }, { status: 409 });
  }

  let imageUrl = "";
  const image = data.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) return Response.json({ error: "Only image files are allowed." }, { status: 400 });
    if (image.size > MAX_IMAGE_SIZE) return Response.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
    imageUrl = (await put(`${GIVEAWAY_IMAGE_PREFIX}${Date.now()}-reference`, image, { access: "public", addRandomSuffix: true })).url;
  }

  entries.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, phone, tattooIdea, imageUrl, month, winner: false, createdAt: new Date().toISOString() });
  await put(GIVEAWAY_ENTRIES_PATH, JSON.stringify(entries), { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
  return Response.json({ ok: true, month });
}

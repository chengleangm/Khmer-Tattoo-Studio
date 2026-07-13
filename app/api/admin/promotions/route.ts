import { del, hasR2Storage, put, readJson } from "@/lib/r2-blob";
import { Promotion, PROMOTION_IMAGE_PREFIX, PROMOTIONS_PATH } from "@/lib/promotions";
import { NextRequest } from "next/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function authorized(request: NextRequest) {
  const configured = process.env.ADMIN_UPLOAD_TOKEN;
  const provided = request.headers.get("x-admin-token");
  return Boolean(configured && provided && configured === provided);
}

async function readPromotions() {
  return (await readJson<Promotion[]>(PROMOTIONS_PATH)) ?? [];
}

async function savePromotions(promotions: Promotion[]) {
  await put(PROMOTIONS_PATH, JSON.stringify(promotions), {
    access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true,
  });
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  if (!hasR2Storage()) return Response.json({ error: "Cloudflare R2 not connected." }, { status: 503 });
  return Response.json({ promotions: await readPromotions() });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  if (!hasR2Storage()) return Response.json({ error: "Cloudflare R2 not connected." }, { status: 503 });
  const data = await request.formData();
  const title = String(data.get("title") ?? "").trim().slice(0, 120);
  const description = String(data.get("description") ?? "").trim().slice(0, 1200);
  if (!title || !description) return Response.json({ error: "Title and description are required." }, { status: 400 });

  let imageUrl = "";
  const image = data.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) return Response.json({ error: "Only image files are allowed." }, { status: 400 });
    if (image.size > MAX_IMAGE_SIZE) return Response.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
    const result = await put(`${PROMOTION_IMAGE_PREFIX}${Date.now()}-${slugify(title) || "promotion"}`, image, { access: "public", addRandomSuffix: true });
    imageUrl = result.url;
  }

  const promotion: Promotion = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    badge: String(data.get("badge") ?? "Special Offer").trim().slice(0, 50),
    description,
    code: String(data.get("code") ?? "").trim().slice(0, 40),
    imageUrl,
    startDate: String(data.get("startDate") ?? ""),
    endDate: String(data.get("endDate") ?? ""),
    ctaLabel: String(data.get("ctaLabel") ?? "Book This Offer").trim().slice(0, 50),
    ctaHref: String(data.get("ctaHref") ?? "/booking").trim().slice(0, 300) || "/booking",
    featured: data.get("featured") === "true",
    visible: data.get("visible") !== "false",
    createdAt: new Date().toISOString(),
  };
  const promotions = await readPromotions();
  promotions.push(promotion);
  await savePromotions(promotions);
  return Response.json({ ok: true, promotion });
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null) as Partial<Promotion> & { id?: string } | null;
  if (!body?.id) return Response.json({ error: "Promotion id is required." }, { status: 400 });
  const promotions = await readPromotions();
  const index = promotions.findIndex((item) => item.id === body.id);
  if (index < 0) return Response.json({ error: "Promotion not found." }, { status: 404 });
  const current = promotions[index];
  promotions[index] = {
    ...current,
    ...(body.title !== undefined && { title: String(body.title).trim().slice(0, 120) }),
    ...(body.badge !== undefined && { badge: String(body.badge).trim().slice(0, 50) }),
    ...(body.description !== undefined && { description: String(body.description).trim().slice(0, 1200) }),
    ...(body.code !== undefined && { code: String(body.code).trim().slice(0, 40) }),
    ...(body.startDate !== undefined && { startDate: String(body.startDate) }),
    ...(body.endDate !== undefined && { endDate: String(body.endDate) }),
    ...(body.ctaLabel !== undefined && { ctaLabel: String(body.ctaLabel).trim().slice(0, 50) }),
    ...(body.ctaHref !== undefined && { ctaHref: String(body.ctaHref).trim().slice(0, 300) || "/booking" }),
    ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
    ...(body.visible !== undefined && { visible: Boolean(body.visible) }),
  };
  await savePromotions(promotions);
  return Response.json({ ok: true, promotion: promotions[index] });
}

export async function DELETE(request: NextRequest) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null) as { id?: string } | null;
  if (!body?.id) return Response.json({ error: "Promotion id is required." }, { status: 400 });
  const promotions = await readPromotions();
  const promotion = promotions.find((item) => item.id === body.id);
  if (!promotion) return Response.json({ error: "Promotion not found." }, { status: 404 });
  if (promotion.imageUrl) await del(promotion.imageUrl).catch(() => undefined);
  await savePromotions(promotions.filter((item) => item.id !== body.id));
  return Response.json({ ok: true });
}

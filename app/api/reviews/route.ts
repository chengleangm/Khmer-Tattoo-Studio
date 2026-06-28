import { del, list, put } from "@vercel/blob";
import { NextRequest } from "next/server";

const REVIEWS_PATH = "reviews/reviews.json";

type Review = {
  id: string;
  name: string;
  origin: string;
  service: string;
  text: string;
  rating: number;
  createdAt: string;
  approved: boolean;
};

function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.VERCEL_OIDC_TOKEN
  );
}

async function readReviews(): Promise<Review[]> {
  const { blobs } = await list({ prefix: "reviews/", limit: 10 });
  const blob = blobs.find((b) => b.pathname === REVIEWS_PATH);
  if (!blob) return [];
  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) return [];
  return response.json() as Promise<Review[]>;
}

async function saveReviews(reviews: Review[]): Promise<void> {
  const { blobs } = await list({ prefix: "reviews/", limit: 10 });
  const existing = blobs.find((b) => b.pathname === REVIEWS_PATH);
  if (existing) await del(existing.url);
  await put(REVIEWS_PATH, JSON.stringify(reviews), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  if (!hasBlobCredentials()) {
    return Response.json({ reviews: [] });
  }

  try {
    const all = await readReviews();
    return Response.json({ reviews: all.filter((r) => r.approved) });
  } catch {
    return Response.json({ reviews: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!hasBlobCredentials()) {
    return Response.json({ error: "Service unavailable." }, { status: 503 });
  }

  let body: { name?: string; origin?: string; service?: string; text?: string; rating?: number } | null = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body?.name?.trim() || !body?.text?.trim()) {
    return Response.json({ error: "Name and review text are required." }, { status: 400 });
  }

  const review: Review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(body.name).trim().slice(0, 80),
    origin: String(body.origin || "").trim().slice(0, 80),
    service: String(body.service || "").trim().slice(0, 120),
    text: String(body.text).trim().slice(0, 1000),
    rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    createdAt: new Date().toISOString(),
    approved: false,
  };

  try {
    const existing = await readReviews();
    existing.push(review);
    await saveReviews(existing);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save review." },
      { status: 500 }
    );
  }
}

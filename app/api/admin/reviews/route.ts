import { hasR2Storage, list, put } from "@/lib/r2-blob";
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
  return hasR2Storage();
}

function verifyAdminToken(request: NextRequest) {
  const configuredToken = process.env.ADMIN_UPLOAD_TOKEN;
  const providedToken = request.headers.get("x-admin-token");
  return Boolean(configuredToken && providedToken && configuredToken === providedToken);
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
  await put(REVIEWS_PATH, JSON.stringify(reviews), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasBlobCredentials()) {
    return Response.json(
      { error: "Cloudflare R2 is not connected.", reviews: [] },
      { status: 503 }
    );
  }

  try {
    return Response.json({ reviews: await readReviews() });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to load reviews.", reviews: [] },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasBlobCredentials()) {
    return Response.json({ error: "Cloudflare R2 is not connected." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as {
    id?: string;
    approved?: boolean;
    name?: string;
    origin?: string;
    service?: string;
    text?: string;
  } | null;

  if (!body?.id) {
    return Response.json({ error: "Missing review id." }, { status: 400 });
  }

  try {
    const reviews = await readReviews();
    const index = reviews.findIndex((r) => r.id === body.id);
    if (index === -1) {
      return Response.json({ error: "Review not found." }, { status: 404 });
    }

    reviews[index] = {
      ...reviews[index],
      ...(body.approved !== undefined && { approved: Boolean(body.approved) }),
      ...(body.name !== undefined && { name: String(body.name).trim().slice(0, 80) }),
      ...(body.origin !== undefined && { origin: String(body.origin).trim().slice(0, 80) }),
      ...(body.service !== undefined && { service: String(body.service).trim().slice(0, 120) }),
      ...(body.text !== undefined && { text: String(body.text).trim().slice(0, 1000) }),
    };

    await saveReviews(reviews);
    return Response.json({ ok: true, review: reviews[index] });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasBlobCredentials()) {
    return Response.json({ error: "Cloudflare R2 is not connected." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { id?: string } | null;
  if (!body?.id) {
    return Response.json({ error: "Missing review id." }, { status: 400 });
  }

  try {
    const reviews = await readReviews();
    const filtered = reviews.filter((r) => r.id !== body.id);
    if (filtered.length === reviews.length) {
      return Response.json({ error: "Review not found." }, { status: 404 });
    }
    await saveReviews(filtered);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Delete failed." },
      { status: 500 }
    );
  }
}

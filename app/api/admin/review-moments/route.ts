import { del, list, put } from "@vercel/blob";
import { NextRequest } from "next/server";

const REVIEW_MOMENTS_PREFIX = "review-moments/";
const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

function verifyAdminToken(request: NextRequest) {
  const configuredToken = process.env.ADMIN_UPLOAD_TOKEN;
  const providedToken = request.headers.get("x-admin-token");
  return Boolean(configuredToken && providedToken && configuredToken === providedToken);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function safeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
}

function titleFromPathname(pathname: string) {
  const fileName = pathname.split("/").pop() ?? "customer-moment";
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const parts = withoutExtension.split("-");
  const labelParts = parts.length > 2 ? parts.slice(1, -1) : parts;
  return labelParts.join(" ").trim() || "Customer moment";
}

async function listMoments() {
  const { blobs } = await list({ prefix: REVIEW_MOMENTS_PREFIX, limit: 100 });
  return blobs
    .map((blob) => ({
      src: blob.url,
      url: blob.url,
      pathname: blob.pathname,
      label: titleFromPathname(blob.pathname),
      uploadedAt: blob.uploadedAt,
      size: blob.size,
    }))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasBlobCredentials()) {
    return Response.json(
      { error: "Vercel Blob is not connected. Connect a Blob store or set BLOB_READ_WRITE_TOKEN." },
      { status: 503 }
    );
  }

  return Response.json({ moments: await listMoments() });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasBlobCredentials()) {
    return Response.json(
      { error: "Vercel Blob is not connected. Connect a Blob store or set BLOB_READ_WRITE_TOKEN." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const label = String(formData.get("label") || "customer moment");

  if (!(file instanceof File)) {
    return Response.json({ error: "Please choose an image file." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return Response.json({ error: "Image must be 4MB or smaller." }, { status: 400 });
  }

  const labelSlug = slugify(label) || "customer-moment";
  const pathname = `${REVIEW_MOMENTS_PREFIX}${Date.now()}-${labelSlug}-${safeFileName(file.name)}`;
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return Response.json({
    moment: {
      src: blob.url,
      url: blob.url,
      pathname: blob.pathname,
      label,
      uploadedAt: new Date().toISOString(),
      size: file.size,
    },
  });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasBlobCredentials()) {
    return Response.json(
      { error: "Vercel Blob is not connected. Connect a Blob store or set BLOB_READ_WRITE_TOKEN." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null) as { url?: string } | null;
  if (!body?.url) {
    return Response.json({ error: "Missing image URL." }, { status: 400 });
  }

  await del(body.url);
  return Response.json({ ok: true });
}

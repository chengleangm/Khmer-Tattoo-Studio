import { list } from "@vercel/blob";

const REVIEW_MOMENTS_PREFIX = "review-moments/";
const LABELS_PATH = "review-moments/labels.json";

function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

function titleFromPathname(pathname: string) {
  const fileName = pathname.split("/").pop() ?? "customer-moment";
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const parts = withoutExtension.split("-");
  const labelParts = parts.length > 2 ? parts.slice(1, -1) : parts;
  const label = labelParts.join(" ").trim();
  return label || "Customer moment";
}

async function readLabels(): Promise<Record<string, string>> {
  const { blobs } = await list({ prefix: REVIEW_MOMENTS_PREFIX, limit: 200 });
  const labelBlob = blobs.find((b) => b.pathname === LABELS_PATH);
  if (!labelBlob) return {};
  try {
    const response = await fetch(labelBlob.url, { cache: "no-store" });
    if (!response.ok) return {};
    return response.json() as Promise<Record<string, string>>;
  } catch {
    return {};
  }
}

export async function GET() {
  if (!hasBlobCredentials()) {
    return Response.json({ moments: [] });
  }

  try {
    const { blobs } = await list({ prefix: REVIEW_MOMENTS_PREFIX, limit: 200 });
    const imageBlobs = blobs.filter((b) => b.pathname !== LABELS_PATH);
    const labels = await readLabels();

    const moments = imageBlobs
      .map((blob) => ({
        src: blob.url,
        label: labels[blob.url] ?? titleFromPathname(blob.pathname),
        uploadedAt: blob.uploadedAt,
      }))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return Response.json({ moments });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to load review moments.", moments: [] },
      { status: 500 }
    );
  }
}

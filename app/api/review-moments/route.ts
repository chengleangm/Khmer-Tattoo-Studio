import { list } from "@vercel/blob";

const REVIEW_MOMENTS_PREFIX = "review-moments/";

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

export async function GET() {
  if (!hasBlobCredentials()) {
    return Response.json({ moments: [] });
  }

  try {
    const { blobs } = await list({ prefix: REVIEW_MOMENTS_PREFIX, limit: 100 });
    const moments = blobs
      .map((blob) => ({
        src: blob.url,
        label: titleFromPathname(blob.pathname),
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

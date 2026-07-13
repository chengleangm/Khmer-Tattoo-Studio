import { hasR2Storage, list } from "@/lib/r2-blob";

const STORE_DATA_PATH = "store/store-data.json";

function hasBlobCredentials() {
  return hasR2Storage();
}

export async function GET() {
  if (!hasBlobCredentials()) {
    return Response.json({ products: [], categories: [] });
  }

  try {
    const { blobs } = await list({ prefix: "store/", limit: 500 });
    const blob = blobs.find((b) => b.pathname === STORE_DATA_PATH);
    if (!blob) return Response.json({ products: [], categories: [] });

    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return Response.json({ products: [], categories: [] });

    const data = await res.json() as { categories: string[]; products: Array<{ visible: boolean; inStock: boolean }> };
    const visible = data.products.filter((p) => p.visible);
    return Response.json({ products: visible, categories: data.categories });
  } catch {
    return Response.json({ products: [], categories: [] });
  }
}

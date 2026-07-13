import { hasR2Storage, readJson } from "@/lib/r2-blob";

const STORE_DATA_PATH = "store/store-data.json";

function hasBlobCredentials() {
  return hasR2Storage();
}

export async function GET() {
  if (!hasBlobCredentials()) {
    return Response.json({ products: [], categories: [] });
  }

  try {
    const data = await readJson<{ categories: string[]; products: Array<{ visible: boolean; inStock: boolean }> }>(STORE_DATA_PATH);
    if (!data) return Response.json({ products: [], categories: [] });
    const visible = data.products.filter((p) => p.visible);
    return Response.json({ products: visible, categories: data.categories });
  } catch {
    return Response.json({ products: [], categories: [] });
  }
}

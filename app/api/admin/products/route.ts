import { del, hasR2Storage, list, put } from "@/lib/r2-blob";
import { NextRequest } from "next/server";

const STORE_DATA_PATH = "store/store-data.json";
const PRODUCT_IMAGE_PREFIX = "store/images/";
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  desc: string;
  price: string;
  tag: string;
  imageUrl: string;
  inStock: boolean;
  visible: boolean;
  createdAt: string;
};

type StoreData = {
  categories: string[];
  products: StoreProduct[];
};

function hasBlobCredentials() {
  return hasR2Storage();
}

function verifyAdminToken(request: NextRequest) {
  const configured = process.env.ADMIN_UPLOAD_TOKEN;
  const provided = request.headers.get("x-admin-token");
  return Boolean(configured && provided && configured === provided);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

async function readStoreData(): Promise<StoreData> {
  const { blobs } = await list({ prefix: "store/", limit: 500 });
  const blob = blobs.find((b) => b.pathname === STORE_DATA_PATH);
  if (!blob) return { categories: [], products: [] };
  try {
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return { categories: [], products: [] };
    return res.json() as Promise<StoreData>;
  } catch {
    return { categories: [], products: [] };
  }
}

async function saveStoreData(data: StoreData): Promise<void> {
  await put(STORE_DATA_PATH, JSON.stringify(data), {
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
    return Response.json({ error: "Cloudflare R2 not connected.", products: [], categories: [] }, { status: 503 });
  }
  try {
    const data = await readStoreData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Load failed.", products: [], categories: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasBlobCredentials()) {
    return Response.json({ error: "Cloudflare R2 not connected." }, { status: 503 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  // Category create: POST with JSON { action: "add-category", name }
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null) as { action?: string; name?: string } | null;
    if (body?.action === "add-category") {
      const name = String(body.name ?? "").trim().slice(0, 60);
      if (!name) return Response.json({ error: "Category name required." }, { status: 400 });
      const data = await readStoreData();
      if (!data.categories.includes(name)) {
        data.categories.push(name);
        await saveStoreData(data);
      }
      return Response.json({ ok: true, categories: data.categories });
    }
    return Response.json({ error: "Unknown action." }, { status: 400 });
  }

  // Product create: POST with FormData
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const category = String(formData.get("category") ?? "").trim().slice(0, 60);
  const desc = String(formData.get("desc") ?? "").trim().slice(0, 600);
  const price = String(formData.get("price") ?? "").trim().slice(0, 40);
  const tag = String(formData.get("tag") ?? "").trim().slice(0, 40);
  const inStock = formData.get("inStock") !== "false";
  const visible = formData.get("visible") !== "false";
  const imageFile = formData.get("image");

  if (!name) return Response.json({ error: "Product name required." }, { status: 400 });
  if (!price) return Response.json({ error: "Price required." }, { status: 400 });

  let imageUrl = "";
  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      return Response.json({ error: "Only image files allowed." }, { status: 400 });
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return Response.json({ error: "Image must be 4MB or smaller." }, { status: 400 });
    }
    const slug = slugify(name) || "product";
    const pathname = `${PRODUCT_IMAGE_PREFIX}${Date.now()}-${slug}`;
    const blob = await put(pathname, imageFile, { access: "public", addRandomSuffix: true });
    imageUrl = blob.url;
  }

  const product: StoreProduct = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name, category, desc, price, tag, imageUrl,
    inStock, visible,
    createdAt: new Date().toISOString(),
  };

  const data = await readStoreData();
  data.products.push(product);
  await saveStoreData(data);

  return Response.json({ ok: true, product });
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasBlobCredentials()) {
    return Response.json({ error: "Cloudflare R2 not connected." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as {
    id?: string;
    action?: string;
    name?: string;
    oldName?: string;
    category?: string;
    desc?: string;
    price?: string;
    tag?: string;
    imageUrl?: string;
    inStock?: boolean;
    visible?: boolean;
  } | null;

  if (!body) return Response.json({ error: "Invalid body." }, { status: 400 });

  const data = await readStoreData();

  // Category rename/delete
  if (body.action === "delete-category") {
    const name = String(body.name ?? "").trim();
    data.categories = data.categories.filter((c) => c !== name);
    await saveStoreData(data);
    return Response.json({ ok: true, categories: data.categories });
  }

  if (body.action === "rename-category") {
    const oldName = String(body.oldName ?? "").trim();
    const newName = String(body.name ?? "").trim().slice(0, 60);
    if (!newName) return Response.json({ error: "Name required." }, { status: 400 });
    data.categories = data.categories.map((c) => (c === oldName ? newName : c));
    data.products = data.products.map((p) => (p.category === oldName ? { ...p, category: newName } : p));
    await saveStoreData(data);
    return Response.json({ ok: true, categories: data.categories });
  }

  // Product update
  if (!body.id) return Response.json({ error: "Missing product id." }, { status: 400 });
  const index = data.products.findIndex((p) => p.id === body.id);
  if (index === -1) return Response.json({ error: "Product not found." }, { status: 404 });

  data.products[index] = {
    ...data.products[index],
    ...(body.name !== undefined && { name: String(body.name).trim().slice(0, 120) }),
    ...(body.category !== undefined && { category: String(body.category).trim().slice(0, 60) }),
    ...(body.desc !== undefined && { desc: String(body.desc).trim().slice(0, 600) }),
    ...(body.price !== undefined && { price: String(body.price).trim().slice(0, 40) }),
    ...(body.tag !== undefined && { tag: String(body.tag).trim().slice(0, 40) }),
    ...(body.imageUrl !== undefined && { imageUrl: String(body.imageUrl) }),
    ...(body.inStock !== undefined && { inStock: Boolean(body.inStock) }),
    ...(body.visible !== undefined && { visible: Boolean(body.visible) }),
  };

  await saveStoreData(data);
  return Response.json({ ok: true, product: data.products[index] });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasBlobCredentials()) {
    return Response.json({ error: "Cloudflare R2 not connected." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { id?: string } | null;
  if (!body?.id) return Response.json({ error: "Missing product id." }, { status: 400 });

  const data = await readStoreData();
  const product = data.products.find((p) => p.id === body.id);
  if (!product) return Response.json({ error: "Product not found." }, { status: 404 });

  // Delete associated image from blob if stored there
  if (product.imageUrl) {
    try {
      await del(product.imageUrl);
    } catch {
      // non-fatal
    }
  }

  data.products = data.products.filter((p) => p.id !== body.id);
  await saveStoreData(data);
  return Response.json({ ok: true });
}

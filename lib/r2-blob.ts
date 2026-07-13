import { getCloudflareContext } from "@opennextjs/cloudflare";

type PutOptions = {
  access?: "public";
  contentType?: string;
  addRandomSuffix?: boolean;
  allowOverwrite?: boolean;
};

function storage() {
  const env = getCloudflareContext().env as CloudflareEnv & { R2_PUBLIC_URL?: string };
  if (!env.STUDIO_STORAGE) {
    throw new Error("Cloudflare R2 binding STUDIO_STORAGE is not configured.");
  }
  return { bucket: env.STUDIO_STORAGE, publicUrl: env.R2_PUBLIC_URL?.replace(/\/$/, "") };
}

function publicObjectUrl(key: string, publicUrl?: string) {
  void publicUrl;
  return `/api/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

function keyFromUrl(value: string, publicUrl?: string) {
  if (value.startsWith("/api/media/")) {
    return value.slice("/api/media/".length).split("/").map(decodeURIComponent).join("/");
  }
  if (!value.startsWith("http")) return value;
  if (!publicUrl || !value.startsWith(`${publicUrl}/`)) {
    throw new Error("This object does not belong to the configured R2 bucket.");
  }
  return value.slice(publicUrl.length + 1).split("/").map(decodeURIComponent).join("/");
}

export async function list({ prefix = "", limit = 1000 }: { prefix?: string; limit?: number } = {}) {
  const { bucket, publicUrl } = storage();
  const result = await bucket.list({ prefix, limit });
  return {
    blobs: result.objects.map((object) => ({
      pathname: object.key,
      url: publicObjectUrl(object.key, publicUrl),
      uploadedAt: object.uploaded.toISOString(),
      size: object.size,
    })),
  };
}

export async function put(pathname: string, body: string | File | Blob, options: PutOptions = {}) {
  const { bucket, publicUrl } = storage();
  const suffix = options.addRandomSuffix
    ? `-${crypto.randomUUID().slice(0, 8)}`
    : "";
  const dot = pathname.lastIndexOf(".");
  const key = suffix && dot > pathname.lastIndexOf("/")
    ? `${pathname.slice(0, dot)}${suffix}${pathname.slice(dot)}`
    : `${pathname}${suffix}`;

  const contentType = options.contentType || (body instanceof Blob ? body.type : "application/octet-stream");
  const value = typeof body === "string" ? body : await body.arrayBuffer();

  await bucket.put(key, value, {
    httpMetadata: {
      contentType,
    },
  });

  return { pathname: key, url: publicObjectUrl(key, publicUrl) };
}

export async function del(value: string) {
  const { bucket, publicUrl } = storage();
  await bucket.delete(keyFromUrl(value, publicUrl));
}

export async function readJson<T>(pathname: string): Promise<T | null> {
  const { bucket } = storage();
  const object = await bucket.get(pathname);
  if (!object) return null;
  try {
    return JSON.parse(await object.text()) as T;
  } catch {
    return null;
  }
}

export async function getObject(pathname: string) {
  const { bucket } = storage();
  return bucket.get(pathname);
}

export function hasR2Storage() {
  try {
    return Boolean((getCloudflareContext().env as CloudflareEnv).STUDIO_STORAGE);
  } catch {
    return false;
  }
}

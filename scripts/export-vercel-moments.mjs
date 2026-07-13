import { get, list } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve(".vercel-migration");
const prefix = "review-moments/";
const labelPath = `${prefix}labels.json`;

await mkdir(path.join(outputRoot, prefix), { recursive: true });

const blobs = [];
let cursor;
do {
  const page = await list({ prefix, limit: 1000, cursor });
  blobs.push(...page.blobs);
  cursor = page.cursor;
} while (cursor);

const labelsBlob = blobs.find((blob) => blob.pathname === labelPath);
let oldLabels = {};
if (labelsBlob) {
  const result = await get(labelsBlob.pathname, {
    access: "public",
    useCache: false,
  });
  if (result?.stream) {
    const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
    oldLabels = JSON.parse(bytes.toString("utf8"));
  }
}

const newLabels = {};
for (const blob of blobs) {
  if (blob.pathname === labelPath) continue;
  const result = await get(blob.pathname, {
    access: "public",
    useCache: false,
  });
  if (!result?.stream) throw new Error(`Unable to download ${blob.pathname}`);
  const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
  const destination = path.join(outputRoot, ...blob.pathname.split("/"));
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  const newUrl = `/api/media/${blob.pathname.split("/").map(encodeURIComponent).join("/")}`;
  newLabels[newUrl] = oldLabels[blob.url] || "Customer moment";
}

await writeFile(
  path.join(outputRoot, labelPath),
  JSON.stringify(newLabels, null, 2),
  "utf8",
);

console.log(`Exported ${blobs.filter((blob) => blob.pathname !== labelPath).length} customer moments.`);

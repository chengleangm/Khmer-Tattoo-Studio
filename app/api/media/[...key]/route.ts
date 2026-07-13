import { getObject } from "@/lib/r2-blob";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const { key } = await context.params;
  const pathname = key.join("/");
  const object = await getObject(pathname);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  if (object.httpMetadata?.contentType) {
    headers.set("content-type", object.httpMetadata.contentType);
  }
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=3600, s-maxage=86400");

  return new Response(await object.arrayBuffer(), { headers });
}

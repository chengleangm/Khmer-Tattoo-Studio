import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const configuredToken = process.env.ADMIN_UPLOAD_TOKEN;
  const providedToken = request.headers.get("x-admin-token");

  if (!configuredToken || !providedToken || configuredToken !== providedToken) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }

  return Response.json({ ok: true });
}

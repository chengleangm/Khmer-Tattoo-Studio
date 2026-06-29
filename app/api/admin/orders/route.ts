import { NextRequest } from "next/server";
import { readOrders, saveOrders } from "@/app/api/orders/route";

function verifyAdminToken(request: NextRequest) {
  const configured = process.env.ADMIN_UPLOAD_TOKEN;
  const provided = request.headers.get("x-admin-token");
  return Boolean(configured && provided && configured === provided);
}

const VALID_STATUSES = ["pending", "confirmed", "ready", "delivered", "cancelled"] as const;

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    return Response.json({ orders: await readOrders() });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Load failed.", orders: [] },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { id?: string; status?: string } | null;
  if (!body?.id) return Response.json({ error: "Missing order id." }, { status: 400 });
  if (!body.status || !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const orders = await readOrders();
    const index = orders.findIndex((o) => o.id === body.id);
    if (index === -1) return Response.json({ error: "Order not found." }, { status: 404 });
    orders[index] = { ...orders[index], status: body.status as typeof VALID_STATUSES[number] };
    await saveOrders(orders);
    return Response.json({ ok: true, order: orders[index] });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { id?: string } | null;
  if (!body?.id) return Response.json({ error: "Missing order id." }, { status: 400 });

  try {
    const orders = await readOrders();
    const filtered = orders.filter((o) => o.id !== body.id);
    if (filtered.length === orders.length) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
    await saveOrders(filtered);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Delete failed." },
      { status: 500 }
    );
  }
}

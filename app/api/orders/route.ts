import { hasR2Storage } from "@/lib/r2-blob";
import { Order, readOrders, saveOrders } from "@/lib/orders";
import { NextRequest } from "next/server";

async function sendTelegramNotification(order: Order): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const fulfillmentLine =
    order.fulfillment === "pickup"
      ? "📍 Pick up from studio (Free)"
      : `🚚 Delivery — ${order.deliveryZoneLabel}\n📬 ${order.deliveryAddress}\n💵 Delivery fee: $${order.deliveryFee}`;

  const text = [
    `🛒 *NEW ORDER — Khmer Bamboo Sakyant Store*`,
    ``,
    `🏷 Product: *${order.productName}*`,
    `💰 Price: ${order.productPrice} × ${order.quantity}`,
    ``,
    `👤 Customer: *${order.customerName}*`,
    `📞 Phone: ${order.customerPhone}`,
    ``,
    fulfillmentLine,
    ``,
    `💳 Payment: Cash on Delivery (COD)`,
    order.note ? `📝 Note: ${order.note}` : null,
    ``,
    `🆔 Order ID: ${order.id.split("-")[0]}`,
    `🕐 Time: ${new Date(order.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh" })} (ICT)`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch {
    // non-fatal — order is still saved even if Telegram fails
  }
}

function hasBlobCredentials() {
  return hasR2Storage();
}

function verifyAdminToken(request: NextRequest) {
  const configured = process.env.ADMIN_UPLOAD_TOKEN;
  const provided = request.headers.get("x-admin-token");
  return Boolean(configured && provided && configured === provided);
}

// Public POST — customer places an order
export async function POST(request: NextRequest) {
  if (!hasBlobCredentials()) {
    return Response.json({ error: "Store not configured yet." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as Partial<Order> | null;
  if (!body?.customerName?.trim() || !body?.customerPhone?.trim()) {
    return Response.json({ error: "Name and phone are required." }, { status: 400 });
  }
  if (!body.productId || !body.productName) {
    return Response.json({ error: "Product information missing." }, { status: 400 });
  }

  const order: Order = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    productId: String(body.productId).slice(0, 80),
    productName: String(body.productName).slice(0, 120),
    productPrice: String(body.productPrice ?? "").slice(0, 40),
    quantity: Math.max(1, Math.min(10, Number(body.quantity) || 1)),
    customerName: String(body.customerName).trim().slice(0, 80),
    customerPhone: String(body.customerPhone).trim().slice(0, 30),
    fulfillment: body.fulfillment === "delivery" ? "delivery" : "pickup",
    deliveryZoneId: String(body.deliveryZoneId ?? "pickup").slice(0, 30),
    deliveryZoneLabel: String(body.deliveryZoneLabel ?? "Pick up from studio").slice(0, 80),
    deliveryFee: Math.max(0, Number(body.deliveryFee) || 0),
    deliveryAddress: String(body.deliveryAddress ?? "").trim().slice(0, 300),
    note: String(body.note ?? "").trim().slice(0, 500),
  };

  try {
    const orders = await readOrders();
    orders.unshift(order); // newest first
    await saveOrders(orders);
    // Fire-and-forget — don't await, don't let it block the response
    void sendTelegramNotification(order);
    return Response.json({ ok: true, orderId: order.id });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Order failed." },
      { status: 500 }
    );
  }
}

// Admin GET — list all orders
export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasBlobCredentials()) {
    return Response.json({ orders: [] });
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

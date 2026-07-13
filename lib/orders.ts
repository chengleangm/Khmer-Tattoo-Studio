import { list, put } from "@/lib/r2-blob";

const ORDERS_PATH = "orders/orders.json";

export type Order = {
  id: string;
  createdAt: string;
  status: "pending" | "confirmed" | "ready" | "delivered" | "cancelled";
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  fulfillment: "pickup" | "delivery";
  deliveryZoneId: string;
  deliveryZoneLabel: string;
  deliveryFee: number;
  deliveryAddress: string;
  note: string;
};

export async function readOrders(): Promise<Order[]> {
  const { blobs } = await list({ prefix: "orders/", limit: 10 });
  const blob = blobs.find((item) => item.pathname === ORDERS_PATH);
  if (!blob) return [];
  try {
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return [];
    return response.json() as Promise<Order[]>;
  } catch {
    return [];
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await put(ORDERS_PATH, JSON.stringify(orders), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

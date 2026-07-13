import { put, readJson } from "@/lib/r2-blob";

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
  return (await readJson<Order[]>(ORDERS_PATH)) ?? [];
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await put(ORDERS_PATH, JSON.stringify(orders), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

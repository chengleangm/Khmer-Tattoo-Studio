import { hasR2Storage, readJson } from "@/lib/r2-blob";
import { Promotion, PROMOTIONS_PATH } from "@/lib/promotions";

export async function GET() {
  if (!hasR2Storage()) return Response.json({ promotions: [] });
  try {
    const promotions = (await readJson<Promotion[]>(PROMOTIONS_PATH)) ?? [];
    return Response.json({
      promotions: promotions
        .filter((promotion) => promotion.visible)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch {
    return Response.json({ promotions: [] });
  }
}

export type Promotion = {
  id: string;
  title: string;
  badge: string;
  description: string;
  code: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
  visible: boolean;
  createdAt: string;
};

export const PROMOTIONS_PATH = "promotions/promotions.json";
export const PROMOTION_IMAGE_PREFIX = "promotions/images/";

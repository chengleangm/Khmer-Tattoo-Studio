export type GiveawayEntry = {
  id: string;
  name: string;
  phone: string;
  tattooIdea: string;
  imageUrl: string;
  month: string;
  winner: boolean;
  createdAt: string;
};

export const GIVEAWAY_ENTRIES_PATH = "promotions/giveaway-entries.json";
export const GIVEAWAY_IMAGE_PREFIX = "promotions/giveaway-images/";

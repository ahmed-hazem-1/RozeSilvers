export type RecipientType = 'self' | 'partner' | 'mother' | 'friend';

export type OccasionType = 'everyday' | 'anniversary' | 'birthday' | 'specialGift';

export type JewelryCategory = 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'anklets';

export type StyleVibe = 'minimal' | 'classic' | 'statement' | 'zircon';

export type BudgetRange = 'under600' | '600to1500' | 'above1500' | 'any';

export interface AIChooserPreferences {
  recipient: RecipientType | null;
  occasion: OccasionType | null;
  categories: JewelryCategory[];
  style: StyleVibe | null;
  budget: BudgetRange | null;
}

export interface AIChooserRequestPayload {
  locale: string;
  preferences: {
    recipient: RecipientType;
    occasion: OccasionType;
    categories: JewelryCategory[];
    style: StyleVibe;
    budget: BudgetRange;
  };
}

export interface AIChooserProductRecommendation {
  handle: string;
  title: string;
  matchScore: number;
  reason: string;
  price?: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  imageUrl?: string;
  variantId?: string;
  suggestedPairingHandle?: string;
  suggestedPairing?: AIChooserProductRecommendation | null;
}

export interface AIChooserResponsePayload {
  recommendationSummary: string;
  products: AIChooserProductRecommendation[];
  giftNoteSuggestion?: string;
}

export type AIChooserStep = 1 | 2 | 3 | 4 | 5; // 5 is results view

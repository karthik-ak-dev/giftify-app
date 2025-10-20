export interface BrandVariantResponse {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  description: string;
  vouchersSold: number;
}

export interface BrandResponse {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  vouchersSold: number;
  popularity: number;
  variants: BrandVariantResponse[];
}


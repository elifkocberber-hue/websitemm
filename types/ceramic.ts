export interface ProductVariations {
  typeName: string;
  options: Array<{ name: string; stock: number }>;
}

export interface CeramicProduct {
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock: number;
  clayType: string;
  images: string[];
  category: string;
  dimensions?: {
    height?: number;
    width?: number;
    depth?: number;
    diameter?: number;
  };
  weight?: number;
  handmade: boolean;
  glaze?: string;
  dishwasherSafe?: boolean;
  microwave?: boolean;
  featured?: boolean;
  variations?: ProductVariations | null;
  categories?: string[];
}

export interface CeramicImage {
  url: string;
  alt: string;
}

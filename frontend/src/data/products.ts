export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  activity: string;
  image: string;
  images?: string[];
  badge?: string;
  isExclusive?: boolean;
  flashSalePrice?: number;
  stockLevel?: number;
  // Rich product detail fields
  sizes?: string[];
  colors?: ProductColor[];
  description?: string;
  features?: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  sold_count?: number;
  variants?: any[];
}

// No dummy products
export const products: Product[] = [];

export const categories = ["Semua Gear", "Jackets", "Bags", "Footwear", "Accessories", "Apparel"];
export const activities = ["Semua", "Hiking", "Travel", "Outdoor", "Camping"];
export const sortOptions = ["Terbaru", "Terpopuler", "Harga: Rendah ke Tinggi", "Harga: Tinggi ke Rendah"];

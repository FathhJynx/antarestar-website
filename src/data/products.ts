import productJacket from "@/assets/product-jacket.jpg";
import productBag from "@/assets/product-bag.jpg";
import productBoots from "@/assets/product-boots.jpg";
import productCap from "@/assets/product-cap.jpg";
import productTshirt from "@/assets/product-tshirt.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  activity: string;
  image: string;
  badge?: string;
}

export const products: Product[] = [
  { id: "1", name: "Valmora Windbreaker Jacket", price: 289000, originalPrice: 350000, category: "Jackets", activity: "Hiking", image: productJacket, badge: "Best Seller" },
  { id: "2", name: "Summit 40L Tactical Backpack", price: 425000, category: "Bags", activity: "Hiking", image: productBag, badge: "New" },
  { id: "3", name: "Trailblazer Hiking Boots", price: 549000, originalPrice: 650000, category: "Footwear", activity: "Hiking", image: productBoots },
  { id: "4", name: "Explorer Adventure Cap", price: 129000, category: "Accessories", activity: "Travel", image: productCap },
  { id: "5", name: "Peak Mountain T-Shirt", price: 159000, category: "Apparel", activity: "Outdoor", image: productTshirt, badge: "New" },
  { id: "6", name: "Windproof Softshell Jacket", price: 375000, category: "Jackets", activity: "Hiking", image: productJacket },
  { id: "7", name: "Daypack 25L Urban Bag", price: 299000, originalPrice: 380000, category: "Bags", activity: "Travel", image: productBag, badge: "Sale" },
  { id: "8", name: "Trail Runner Shoes", price: 489000, category: "Footwear", activity: "Outdoor", image: productBoots },
  { id: "9", name: "Outdoor Bucket Hat", price: 99000, category: "Accessories", activity: "Travel", image: productCap },
  { id: "10", name: "Base Camp Graphic Tee", price: 145000, category: "Apparel", activity: "Outdoor", image: productTshirt },
  { id: "11", name: "Alpine Waterproof Jacket", price: 520000, category: "Jackets", activity: "Hiking", image: productJacket, badge: "Premium" },
  { id: "12", name: "Expedition 60L Backpack", price: 650000, category: "Bags", activity: "Hiking", image: productBag },
];

export const categories = ["All", "Jackets", "Bags", "Footwear", "Accessories", "Apparel"];
export const activities = ["All", "Hiking", "Travel", "Outdoor"];
export const sortOptions = ["Newest", "Popular", "Price: Low to High", "Price: High to Low"];

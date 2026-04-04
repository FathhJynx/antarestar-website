const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('wc_products.json', 'utf8'));
  let productsTs = `export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    activity: string;
    image: string;
    badge?: string;
  }\n\nexport const products: Product[] = [\n`;
  
  data.slice(0, 25).forEach((p, i) => { 
    const name = p.name ? p.name.replace(/"|'/g, '').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'") : 'Product';
    const price = p.prices && p.prices.price ? p.prices.price / 100 : 0;
    const image = p.images && p.images.length > 0 ? p.images[0].src : 'https://placehold.co/400x400/png?text=Image+Not+Found';
    const category = p.categories && p.categories.length > 0 ? p.categories[0].name : 'Accessories';
    
    // Default mock parameters
    const activity = "Outdoor";
    let badgeStr = "";
    if (i === 0) badgeStr = ', badge: "Best Seller"';
    else if (i === 1) badgeStr = ', badge: "New"';
    else if (i === 2) badgeStr = ', badge: "Sale"';
    
    productsTs += `  { id: "${i+1}", name: "${name}", price: ${price}, category: "${category}", activity: "${activity}", image: "${image}"${badgeStr} },\n`;
  });
  
  productsTs += `];\n\nexport const categories = ["All", "Jackets", "Bags", "Footwear", "Accessories", "Apparel"];\n`;
  productsTs += `export const activities = ["All", "Hiking", "Travel", "Outdoor", "Camping"];\n`;
  productsTs += `export const sortOptions = ["Newest", "Popular", "Price: Low to High", "Price: High to Low"];\n`;
  
  fs.writeFileSync('src/data/products.ts', productsTs);
  console.log('Fixed products.ts successfully');
} catch (e) {
  console.error("Error formatting products: ", e);
}

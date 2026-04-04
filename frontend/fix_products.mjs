import https from 'https';
import fs from 'fs';

https.get('https://antarestar.com/wp-json/wc/store/products?per_page=100', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      
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
      
      parsed.forEach((p, i) => { 
        // Fix names encoding
        let name = p.name ? p.name.replace(/"|'/g, '').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&#038;/g, "&").trim() : 'Product';
        // WC Store API returns price as string in lowest currency unit or exact string.
        const priceStr = p.prices && p.prices.price ? p.prices.price : "0";
        let price = parseInt(priceStr, 10);
        if (price < 10000 && price > 0) price = price * 100;

        const originalPriceStr = p.prices && p.prices.regular_price ? p.prices.regular_price : "0";
        let originalPrice = parseInt(originalPriceStr, 10);
        if (originalPrice < 10000 && originalPrice > 0) originalPrice = originalPrice * 100;
        
        let originalPriceParam = originalPrice > price ? `, originalPrice: ${originalPrice}` : '';

        const image = p.images && p.images.length > 0 ? p.images[0].src : 'https://placehold.co/400x400/png?text=' + encodeURIComponent(name);
        
        const n = name.toLowerCase();
        const c = p.categories && p.categories.length > 0 ? p.categories[0].name.toLowerCase() : '';
        const combined = n + ' ' + c;
        
        let category = 'Accessories'; // default
        if (combined.includes('jaket') || combined.includes('jacket') || combined.includes('windbreaker') || combined.includes('sweater') || combined.includes('hoodie') || combined.includes('vest')) {
          category = 'Jackets';
        } else if (combined.includes('tas') || combined.includes('carrier') || combined.includes('dompet') || combined.includes('backpack') || combined.includes('daypack') || combined.includes('sling') || combined.includes('waistbag') || combined.includes('clutch') || combined.includes('pouch') || combined.includes('dry bag') || combined.includes('duffle')) {
          category = 'Bags';
        } else if (combined.includes('sandal') || combined.includes('sepatu') || combined.includes('sendal') || combined.includes('footwear') || combined.includes('boots')) {
          category = 'Footwear';
        } else if (combined.includes('celana') || combined.includes('kemeja') || combined.includes('kaos') || combined.includes('t-shirt') || combined.includes('shirt') || combined.includes('sarung') || combined.includes('apparel') || combined.includes('legging') || combined.includes('baselayer') || combined.includes('pakaian') || combined.includes('baju')) {
          category = 'Apparel';
        } else {
          category = 'Accessories'; // Tenda, sleeping bag, topi, jam tangan, sabuk, dll
        }

        // simple check for activity
        let activity = "Outdoor";
        if (name.toLowerCase().includes("gunung") || name.toLowerCase().includes("hiking") || name.toLowerCase().includes("trekking")) activity = "Hiking";
        if (name.toLowerCase().includes("travel") || name.toLowerCase().includes("ransel")) activity = "Travel";
        if (name.toLowerCase().includes("camping") || name.toLowerCase().includes("tenda")) activity = "Camping";

        let badgeStr = "";
        if (i < 3) badgeStr = ', badge: "Best Seller"';
        else if (i > 3 && i < 10 && originalPrice > price) badgeStr = ', badge: "Sale"';
        else if (i > 90) badgeStr = ', badge: "New"';
        
        productsTs += `  { id: "${i+1}", name: "${name}", price: ${price}${originalPriceParam}, category: "${category}", activity: "${activity}", image: "${image}"${badgeStr} },\n`;
      });
      
      productsTs += `];\n\nexport const categories = ["All", "Jackets", "Bags", "Footwear", "Accessories", "Apparel"];\n`;
      productsTs += `export const activities = ["All", "Hiking", "Travel", "Outdoor", "Camping"];\n`;
      productsTs += `export const sortOptions = ["Newest", "Popular", "Price: Low to High", "Price: High to Low"];\n`;
      
      fs.writeFileSync('src/data/products.ts', productsTs);
      console.log('Fixed products.ts effectively with ' + parsed.length + ' products.');
    } catch(e) {
      console.error(e);
    }
  });
}).on('error', e => console.error(e));

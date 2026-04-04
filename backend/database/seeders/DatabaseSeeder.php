<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Tier;
use App\Models\UserMembership;
use App\Models\Province;
use App\Models\City;
use App\Models\Address;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\Affiliate;
use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use App\Models\Coupon;
use App\Models\Article;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // TIERS
        // ==========================================
        $tiers = [
            ['name' => 'Bronze', 'min_points' => 0, 'benefits' => 'Basic member benefits: 1x points multiplier'],
            ['name' => 'Ranger', 'min_points' => 500, 'benefits' => 'Explorer benefits: 1.5x points multiplier, free shipping on orders > 500k'],
            ['name' => 'Elite', 'min_points' => 2000, 'benefits' => 'Elite benefits: 2x points multiplier, free shipping, early access to flash sales, birthday bonus'],
        ];

        foreach ($tiers as $tier) {
            Tier::create($tier);
        }

        $bronzeTier = Tier::where('name', 'Bronze')->first();

        // ==========================================
        // USERS
        // ==========================================
        $this->call(AdminSeeder::class);
        $admin = User::where('email', 'admin@antarestar.com')->first();

        $user1 = User::updateOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Explorer',
                'password' => 'password123',
                'phone' => '08198765432',
                'birth_date' => '1995-03-20',
                'referral_code' => 'ANT-JOHN0001',
            ]
        );

        $user2 = User::updateOrCreate(
            ['email' => 'sarah@example.com'],
            [
                'name' => 'Sarah Adventurer',
                'password' => 'password123',
                'phone' => '08134567890',
                'birth_date' => '1992-07-10',
                'referral_code' => 'ANT-SARAH001',
            ]
        );

        // Assign tiers
        foreach ([$admin, $user1, $user2] as $user) {
            UserMembership::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'tier_id' => $bronzeTier->id,
                    'joined_at' => now(),
                ]
            );
        }

        // ==========================================
        // PROVINCES & CITIES
        // ==========================================
        $provinces = [
            'DKI Jakarta' => ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat'],
            'Jawa Barat' => ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cirebon'],
            'Jawa Tengah' => ['Semarang', 'Solo', 'Yogyakarta', 'Magelang', 'Salatiga'],
            'Jawa Timur' => ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Kediri'],
            'Bali' => ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Bangli'],
        ];

        foreach ($provinces as $provinceName => $cities) {
            $province = Province::create(['name' => $provinceName]);
            foreach ($cities as $cityName) {
                City::create([
                    'province_id' => $province->id,
                    'name' => $cityName,
                ]);
            }
        }

        // Address for user1
        $jakartaProvince = Province::where('name', 'DKI Jakarta')->first();
        $jakartaPusat = City::where('name', 'Jakarta Pusat')->first();

        Address::create([
            'user_id' => $user1->id,
            'province_id' => $jakartaProvince->id,
            'city_id' => $jakartaPusat->id,
            'recipient_name' => 'John Explorer',
            'phone' => '08198765432',
            'address' => 'Jl. Sudirman No. 123, RT 01/RW 02',
            'postal_code' => '10110',
            'is_default' => true,
        ]);

        // ==========================================
        // CATEGORIES & PRODUCTS
        // ==========================================
        $categories = [
            ['name' => 'Jackets', 'slug' => 'jackets'],
            ['name' => 'Bags', 'slug' => 'bags'],
            ['name' => 'Footwear', 'slug' => 'footwear'],
            ['name' => 'Accessories', 'slug' => 'accessories'],
            ['name' => 'Apparel', 'slug' => 'apparel'],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[$cat['slug']] = Category::create($cat);
        }

        // Products with variants
        $products = [
            [
                'name' => 'Antarestar Summit Pro Tent',
                'slug' => 'antarestar-summit-pro-tent',
                'description' => 'Professional-grade 4-season tent designed for extreme conditions. Lightweight yet durable, with reinforced poles and waterproof flysheet. Perfect for high-altitude expeditions.',
                'category' => 'accessories',
                'variants' => [
                    ['name' => '2-Person', 'price' => 2850000, 'stock' => 25, 'size' => '2P'],
                    ['name' => '3-Person', 'price' => 3450000, 'stock' => 15, 'size' => '3P'],
                    ['name' => '4-Person', 'price' => 4200000, 'stock' => 10, 'size' => '4P'],
                ],
                'images' => ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
            ],
            [
                'name' => 'Explorer Trail 65L Backpack',
                'slug' => 'explorer-trail-65l-backpack',
                'description' => 'Heavy-duty trekking backpack with ergonomic support system. Features rain cover, multiple compartments, and adjustable harness. Built for multi-day expeditions.',
                'category' => 'bags',
                'variants' => [
                    ['name' => 'Forest Green', 'price' => 1250000, 'stock' => 30, 'color_name' => 'Forest Green', 'color_code' => '#2D5A27'],
                    ['name' => 'Midnight Black', 'price' => 1250000, 'stock' => 25, 'color_name' => 'Midnight Black', 'color_code' => '#1A1A1A'],
                    ['name' => 'Alpine Red', 'price' => 1350000, 'stock' => 20, 'color_name' => 'Alpine Red', 'color_code' => '#A52A2A'],
                ],
                'images' => ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
            ],
            [
                'name' => 'Trailblazer GTX Hiking Boots',
                'slug' => 'trailblazer-gtx-hiking-boots',
                'description' => 'Waterproof Gore-Tex hiking boots with Vibram outsoles. Superior ankle support and cushioning for rugged terrain. Ideal for both day hikes and extended treks.',
                'category' => 'footwear',
                'variants' => [
                    ['name' => 'Size 40', 'price' => 1450000, 'stock' => 20, 'size' => '40'],
                    ['name' => 'Size 42', 'price' => 1450000, 'stock' => 25, 'size' => '42'],
                    ['name' => 'Size 44', 'price' => 1450000, 'stock' => 15, 'size' => '44'],
                ],
                'images' => ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'],
            ],
            [
                'name' => 'StormShield Rain Jacket',
                'slug' => 'stormshield-rain-jacket',
                'description' => 'Lightweight, packable rain jacket with 20K waterproof rating. Taped seams, adjustable hood, and pit-zip ventilation. Your go-to protection against mountain storms.',
                'category' => 'jackets',
                'variants' => [
                    ['name' => 'Blue - M', 'price' => 750000, 'stock' => 40, 'color_name' => 'Ocean Blue', 'color_code' => '#0077BE', 'size' => 'M'],
                    ['name' => 'Blue - L', 'price' => 750000, 'stock' => 35, 'color_name' => 'Ocean Blue', 'color_code' => '#0077BE', 'size' => 'L'],
                    ['name' => 'Black - XL', 'price' => 800000, 'stock' => 30, 'color_name' => 'Matte Black', 'color_code' => '#282828', 'size' => 'XL'],
                ],
                'images' => ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
            ],
            [
                'name' => 'CampChef Pro Stove',
                'slug' => 'campchef-pro-stove',
                'description' => 'Portable camping stove with piezo ignition. Boils water in under 3 minutes. Compact design packs into included stuff sack. Compatible with standard gas canisters.',
                'category' => 'accessories',
                'variants' => [
                    ['name' => 'Standard', 'price' => 385000, 'stock' => 50],
                    ['name' => 'Pro (with windscreen)', 'price' => 485000, 'stock' => 30],
                ],
                'images' => ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
            ],
            [
                'name' => 'Lumen X1000 Headlamp',
                'slug' => 'lumen-x1000-headlamp',
                'description' => '1000 lumens USB-rechargeable headlamp with red light mode and IPX6 waterproof rating. 200m beam distance. 8 lighting modes for any outdoor situation.',
                'category' => 'accessories',
                'variants' => [
                    ['name' => 'Standard', 'price' => 285000, 'stock' => 60],
                    ['name' => 'Pro (sensor mode)', 'price' => 425000, 'stock' => 35],
                ],
                'images' => ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'],
            ],
            [
                'name' => 'Antarestar Logo T-Shirt',
                'slug' => 'antarestar-logo-t-shirt',
                'description' => 'Premium cotton t-shirt with high-quality screen printing. Comfortable for both outdoor activities and casual wear.',
                'category' => 'apparel',
                'variants' => [
                    ['name' => 'S - Black', 'price' => 150000, 'stock' => 50],
                    ['name' => 'M - Black', 'price' => 150000, 'stock' => 45],
                    ['name' => 'L - Black', 'price' => 150000, 'stock' => 40],
                ],
                'images' => ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::create([
                'name' => $productData['name'],
                'slug' => $productData['slug'],
                'description' => $productData['description'],
                'category_id' => $createdCategories[$productData['category']]->id,
            ]);

            foreach ($productData['variants'] as $variant) {
                ProductVariant::create(array_merge($variant, ['product_id' => $product->id]));
            }

            foreach ($productData['images'] as $i => $imageUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageUrl,
                    'is_primary' => $i === 0,
                ]);
            }
        }

        // ==========================================
        // AFFILIATES
        // ==========================================
        $affiliate = Affiliate::create([
            'user_id' => $user1->id,
            'code' => 'AFF-JOHN001',
            'parent_affiliate_id' => null,
            'commission_value' => 5.00,
            'balance' => 150000,
            'total_earnings' => 350000,
            'is_active' => true,
        ]);

        Affiliate::create([
            'user_id' => $user2->id,
            'code' => 'AFF-SARAH01',
            'parent_affiliate_id' => $affiliate->id,
            'commission_value' => 5.00,
            'balance' => 50000,
            'total_earnings' => 100000,
            'is_active' => true,
        ]);

        // ==========================================
        // PROMOTIONS
        // ==========================================
        // Flash Sale
        $flashSale = FlashSale::create([
            'name' => 'Weekend Explorer Sale',
            'start_date' => now(),
            'end_date' => now()->addDays(3),
            'is_active' => true,
        ]);

        $saleVariant = ProductVariant::first();
        if ($saleVariant) {
            FlashSaleProduct::create([
                'flash_sale_id' => $flashSale->id,
                'product_variant_id' => $saleVariant->id,
                'sale_price' => $saleVariant->price * 0.7, // 30% off
                'sale_stock' => 10,
            ]);
        }

        // Coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10,
            'min_purchase' => 200000,
            'max_discount' => 100000,
            'usage_limit' => 100,
            'used_count' => 0,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(3),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'FLAT50K',
            'type' => 'fixed',
            'value' => 50000,
            'min_purchase' => 500000,
            'max_discount' => null,
            'usage_limit' => 50,
            'used_count' => 0,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(1),
            'is_active' => true,
        ]);

        // ==========================================
        // ARTICLES
        // ==========================================
        Article::create([
            'title' => '10 Essential Tips for Your First Mountain Trek',
            'slug' => '10-essential-tips-first-mountain-trek',
            'content' => 'Embarking on your first mountain trek is an exciting milestone. Here are 10 essential tips to ensure a safe and memorable experience: 1. Start with proper gear - invest in quality hiking boots and a reliable backpack. 2. Train beforehand - build your stamina with regular cardio. 3. Check the weather - always monitor conditions before heading out. 4. Pack light but smart - bring only the essentials. 5. Stay hydrated - carry enough water and purification tablets. 6. Tell someone your itinerary. 7. Learn basic navigation skills. 8. Respect the environment - leave no trace. 9. Start early - begin your trek before sunrise. 10. Know your limits - there is no shame in turning back.',
            'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
            'is_published' => true,
        ]);

        Article::create([
            'title' => 'Best Camping Spots in Indonesia 2024',
            'slug' => 'best-camping-spots-indonesia-2024',
            'content' => 'Indonesia offers some of the most breathtaking camping spots in Southeast Asia. From the volcanic landscapes of Mount Bromo to the pristine beaches of Raja Ampat, here are our top picks for camping destinations this year. Each location offers unique natural beauty and varied terrain that outdoor enthusiasts will love.',
            'image_url' => 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=800',
            'is_published' => true,
        ]);

        echo "✅ Database seeded successfully!\n";
        echo "📧 Admin login: admin@antarestar.com / password123\n";
        echo "📧 User login: john@example.com / password123\n";
    }
}

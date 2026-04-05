<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\FlashSale;
use App\Models\Product;
use App\Models\FlashSaleProduct;
use Carbon\Carbon;

// Create Flash Sale
$fs = FlashSale::updateOrCreate(
    ['name' => 'SUPER SALE WEEKEND'], 
    [
        'start_date' => Carbon::now()->subDay(), 
        'end_date' => Carbon::now()->addDays(2), 
        'is_active' => true
    ]
);

// Get 4 random products
$products = Product::inRandomOrder()->limit(4)->get();

if ($products->count() === 0) {
    echo "No products found in DB to link to promo.\n";
    exit;
}

foreach($products as $product) { 
    FlashSaleProduct::updateOrCreate(
        ['flash_sale_id' => $fs->id, 'product_id' => $product->id], 
        [
            'discount_type' => 'percentage', 
            'discount_value' => rand(15, 60),  // 15% to 60% discount
            'sale_stock' => rand(10, 30)
        ]
    ); 
}

echo "Flash Sale Generated Successfully! Link to Promo: " . $fs->id . "\n";

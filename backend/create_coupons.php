<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Coupon;
use Carbon\Carbon;

Coupon::updateOrCreate(
    ['code' => 'FREE100'],
    [
        'type' => 'fixed',
        'value' => 100000,
        'min_purchase' => 200000,
        'max_discount' => 100000,
        'usage_limit' => 100,
        'valid_from' => Carbon::now()->subDay(),
        'valid_until' => Carbon::now()->addYear(),
        'is_active' => true,
    ]
);

Coupon::updateOrCreate(
    ['code' => 'HEMAT15'],
    [
        'type' => 'percentage',
        'value' => 15,
        'min_purchase' => 0,
        'max_discount' => 50000,
        'usage_limit' => 999,
        'valid_from' => Carbon::now()->subDay(),
        'valid_until' => Carbon::now()->addYear(),
        'is_active' => true,
    ]
);

echo "Coupons Created Successfully!\n";

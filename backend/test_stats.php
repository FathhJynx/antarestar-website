<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Order;
use App\Models\User;

echo "Total Users: " . User::count() . "\n";
echo "Total Orders: " . Order::count() . "\n";
echo "Total Revenue: " . Order::where('status', '!=', 'cancelled')->sum('total_price') . "\n";

$chart = collect(range(6, 0))->map(function($days) {
    $date = now()->subDays($days);
    return [
        'date' => $date->format('d M'),
        'revenue' => (float) Order::whereDate('created_at', $date)
            ->where('status', '!=', 'cancelled')
            ->sum('total_price'),
        'orders' => Order::whereDate('created_at', $date)->count()
    ];
});

echo "Chart Data: " . json_encode($chart) . "\n";

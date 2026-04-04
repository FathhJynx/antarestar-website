<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\BaseController;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\FlashSale;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends BaseController
{
    public function stats(): JsonResponse
    {
        try {
            $totalOrders = Order::count();
            $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total_price');
            $pendingOrders = Order::where('status', 'unpaid')->count();
            $userGrowth = User::where('created_at', '>=', now()->subDays(30))->count();
            
            Log::info('Dashboard Stats Check', [
                'users' => User::count(),
                'orders' => $totalOrders,
                'revenue' => $totalRevenue
            ]);

            $stats = [
                'overview' => [
                    'total_users' => User::count(),
                    'total_orders' => $totalOrders,
                    'total_revenue' => $totalRevenue,
                    'pending_orders' => $pendingOrders,
                    'user_growth' => $userGrowth,
                ],
                'inventory' => [
                    'total_products' => Product::count(),
                    'low_stock_count' => ProductVariant::where('stock', '<=', 5)->count(),
                ],
                'promotions' => [
                    'active_flash_sales' => FlashSale::where('end_date', '>', now())->count(),
                ],
                'revenue_chart' => collect(range(6, 0))->map(function($days) {
                    $date = now()->subDays($days);
                    return [
                        'date' => $date->format('d M'),
                        'revenue' => (float) Order::whereDate('created_at', $date)
                            ->where('status', '!=', 'cancelled')
                            ->sum('total_price'),
                        'orders' => Order::whereDate('created_at', $date)->count()
                    ];
                }),
                'recent_orders' => Order::with('user')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(fn($o) => [
                        'id' => $o->id,
                        'user' => $o->user->name ?? 'Member',
                        'total' => (float) $o->total_price,
                        'status' => $o->status,
                        'date' => $o->created_at->diffForHumans()
                    ]),
                'top_products' => DB::table('order_items')
                    ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
                    ->join('products', 'product_variants.product_id', '=', 'products.id')
                    ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
                    ->groupBy('products.id', 'products.name')
                    ->orderByDesc('total_sold')
                    ->limit(5)
                    ->get()
            ];

            return $this->success($stats, 'Dashboard statistics.');
        } catch (\Exception $e) {
            Log::error('Dashboard Stats Error: ' . $e->getMessage());
            return $this->error('Gagal mengambil data statistik: ' . $e->getMessage(), 500);
        }
    }
}

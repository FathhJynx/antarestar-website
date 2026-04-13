<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\User;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/**
 * @group Social Proof & Stats
 *
 * Public endpoints for retrieving community growth and sales statistics.
 */
class PublicStatsController extends BaseController
{
    /**
     * Get community and sales statistics for social proof.
     */
    public function index(): JsonResponse
    {
        try {
            $stats = Cache::remember('public_stats', 3600, function () {
                $totalUsers = User::count();
                $totalSold = OrderItem::sum('quantity');

                return [
                    'explorers' => [
                        'raw' => $totalUsers,
                        'display' => $totalUsers > 1000 ? number_format($totalUsers / 1000, 1) . ' K+' : $totalUsers . '+',
                        'label' => 'Penjelajah Terdaftar'
                    ],
                    'sold' => [
                        'raw' => $totalSold,
                        'display' => $totalSold > 1000 ? number_format($totalSold / 1000, 0) . ' K+' : $totalSold . '+',
                        'label' => 'Produk Terjual'
                    ],
                    'rating' => [
                        'display' => '4.9 ★',
                        'label' => 'Rating Pelanggan'
                    ],
                    'experience' => [
                        'display' => '7 Thn',
                        'label' => 'Dedikasi Outdoor'
                    ]
                ];
            });

            return $this->success($stats, 'Public community statistics.');

        } catch (\Exception $e) {
            return $this->error('Gagal mengambil data statistik.', 500);
        }
    }
}

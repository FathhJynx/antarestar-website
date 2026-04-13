<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AffiliateController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\B2BController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\PublicStatsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Antarestar E-Commerce Platform
|--------------------------------------------------------------------------
*/

// ==========================================
// PUBLIC ROUTES (No Auth Required)
// ==========================================

// Auth
Route::get('/stats', [PublicStatsController::class, 'index']);
Route::get('/ping', function() { return response()->json(['message' => 'pong']); });

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:3,10'); // 3 attempts per 10 minutes
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');       // 5 attempts per minute
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Products (public browsing)
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::get('/{id}/similar', [ProductController::class, 'similar']);
    Route::get('/slug/{slug}', [ProductController::class, 'showBySlug']);
});

// Categories (public)
Route::get('/categories', [ProductController::class, 'categories']);

// Regions (public - for dropdowns)
Route::prefix('regions')->group(function () {
    Route::get('/provinces', [RegionController::class, 'provinces']);
    Route::get('/provinces/{provinceId}/cities', [RegionController::class, 'cities']);
});

// Articles (public)
Route::prefix('articles')->group(function () {
    Route::get('/', [ContentController::class, 'articles']);
    Route::get('/{id}', [ContentController::class, 'article']);
    Route::get('/slug/{slug}', [ContentController::class, 'articleBySlug']);
});

// Promotions (public)
Route::prefix('promotions')->group(function () {
    Route::get('/flash-sales', [PromotionController::class, 'activeFlashSales']);
    Route::get('/flash-sales/{id}', [PromotionController::class, 'flashSale']);
});

// Affiliate click tracking (public)
Route::get('/affiliate/track/{code}', [AffiliateController::class, 'trackClick']);

// B2B Inquiry (public)
Route::post('/b2b/inquiries', [B2BController::class, 'store']);


// ==========================================
// PROTECTED ROUTES (Auth Required)
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Profile
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::get('/points', [UserController::class, 'pointHistory']);
        Route::get('/referrals', [UserController::class, 'referrals']);
        Route::get('/leaderboard', [UserController::class, 'leaderboard']);

        // Addresses
        Route::get('/addresses', [UserController::class, 'addresses']);
        Route::post('/addresses', [UserController::class, 'createAddress']);
        Route::put('/addresses/{id}', [UserController::class, 'updateAddress']);
        Route::delete('/addresses/{id}', [UserController::class, 'deleteAddress']);
    });

    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{itemId}', [CartController::class, 'updateItem']);
        Route::delete('/items/{itemId}', [CartController::class, 'removeItem']);
    });

    // Orders
    Route::prefix('orders')->middleware('throttle:10,1')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::put('/{id}/status', [OrderController::class, 'updateStatus']);
        Route::get('/{orderId}/shipment-logs', [OrderController::class, 'shipmentLogs']);
    });

    // Product Reviews
    Route::post('/product-reviews', [\App\Http\Controllers\Api\ProductReviewController::class, 'store']);

    // Affiliate
    Route::prefix('affiliate')->group(function () {
        Route::post('/register', [AffiliateController::class, 'register']);
        Route::get('/dashboard', [AffiliateController::class, 'dashboard']);
        Route::get('/conversions', [AffiliateController::class, 'conversions']);
        Route::post('/payouts', [AffiliateController::class, 'requestPayout']);
        Route::get('/payouts', [AffiliateController::class, 'payouts']);
        Route::put('/payouts/{id}/status', [AffiliateController::class, 'updatePayoutStatus']);
    });

    // Promotions (auth required actions)
    Route::prefix('promotions')->group(function () {
        Route::get('/coupons', [PromotionController::class, 'coupons']);
        Route::post('/coupons/validate', [PromotionController::class, 'validateCoupon']);
        Route::get('/birthday-reward', [PromotionController::class, 'checkBirthdayReward']);
        Route::post('/birthday-reward/{id}/claim', [PromotionController::class, 'claimBirthdayReward']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [ContentController::class, 'notifications']);
        Route::get('/unread-count', [ContentController::class, 'unreadCount']);
        Route::put('/{id}/read', [ContentController::class, 'markAsRead']);
        Route::put('/read-all', [ContentController::class, 'markAllAsRead']);
    });

    // Admin - Full Management
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Dashboard Stats
        Route::get('/dashboard/stats', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'stats']);

        // User Management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/leaderboard/orders', [UserController::class, 'leaderboardOrders']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        Route::post('/users/{id}/adjust-points', [UserController::class, 'adjustPoints']);

        // Order Management
        Route::get('/orders', [OrderController::class, 'adminIndex']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::get('/sold-products', [OrderController::class, 'soldProducts']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Product & Catalog Management
        Route::prefix('catalog')->group(function () {
            // Categories
            Route::post('/categories', [ProductController::class, 'createCategory']);
            Route::put('/categories/{id}', [ProductController::class, 'updateCategory']);
            Route::delete('/categories/{id}', [ProductController::class, 'deleteCategory']);

            // Products
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{id}', [ProductController::class, 'update']);
            Route::delete('/products/{id}', [ProductController::class, 'destroy']);

            // Variants
            Route::post('/variants', [ProductController::class, 'createVariant']);
            Route::put('/variants/{id}', [ProductController::class, 'updateVariant']);
            Route::delete('/variants/{id}', [ProductController::class, 'deleteVariant']);

            // Images
            Route::post('/product-images', [ProductController::class, 'addImage']);
            Route::delete('/product-images/{id}', [ProductController::class, 'deleteImage']);
        });

        // Promotion & Flash Sale Management
        Route::apiResource('/coupons', \App\Http\Controllers\Api\Admin\CouponController::class);
        Route::get('/flash-sales', [PromotionController::class, 'indexFlashSales']);
        Route::post('/flash-sales', [PromotionController::class, 'createFlashSale']);
        Route::put('/flash-sales/{id}', [PromotionController::class, 'updateFlashSale']);
        Route::delete('/flash-sales/{id}', [PromotionController::class, 'deleteFlashSale']);
        Route::post('/flash-sale-products', [PromotionController::class, 'addFlashSaleProduct']);
        Route::delete('/flash-sale-products/{id}', [PromotionController::class, 'removeFlashSaleProduct']);

        // Content Management
        Route::post('/articles', [ContentController::class, 'createArticle']);
        Route::put('/articles/{id}', [ContentController::class, 'updateArticle']);
        Route::delete('/articles/{id}', [ContentController::class, 'deleteArticle']);

        // B2B & Corporate
        Route::get('/b2b/inquiries', [B2BController::class, 'index']);
        Route::get('/b2b/inquiries/{id}', [B2BController::class, 'show']);
        Route::put('/b2b/inquiries/{id}/status', [B2BController::class, 'updateStatus']);

        // Affiliate Management
        Route::get('/affiliates', [AffiliateController::class, 'adminIndex']);
        Route::get('/payouts', [AffiliateController::class, 'adminPayouts']);
        Route::put('/payouts/{id}/status', [AffiliateController::class, 'updatePayoutStatus']);

        // Media Management
        Route::post('/media/upload', [\App\Http\Controllers\Api\Admin\MediaController::class, 'upload']);
    });
});

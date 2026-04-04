<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Repositories
use App\Repositories\AuthRepository;
use App\Repositories\UserRepository;
use App\Repositories\ProductRepository;
use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use App\Repositories\AffiliateRepository;
use App\Repositories\PromotionRepository;
use App\Repositories\ContentRepository;
use App\Repositories\B2BRepository;
use App\Repositories\RegionRepository;

// Models
use App\Models\User;
use App\Models\UserPoint;
use App\Models\UserMembership;
use App\Models\Referral;
use App\Models\Address;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShipmentLog;
use App\Models\Affiliate;
use App\Models\AffiliateClick;
use App\Models\AffiliateConversion;
use App\Models\AffiliatePayout;
use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use App\Models\Coupon;
use App\Models\BirthdayReward;
use App\Models\Article;
use App\Models\Notification;
use App\Models\B2BInquiry;
use App\Models\Province;
use App\Models\City;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Auth Repository
        $this->app->bind(AuthRepository::class, function ($app) {
            return new AuthRepository($app->make(User::class));
        });

        // User Repository
        $this->app->bind(UserRepository::class, function ($app) {
            return new UserRepository(
                $app->make(User::class),
                $app->make(UserPoint::class),
                $app->make(UserMembership::class),
                $app->make(Referral::class),
                $app->make(Address::class)
            );
        });

        // Product Repository
        $this->app->bind(ProductRepository::class, function ($app) {
            return new ProductRepository(
                $app->make(Product::class),
                $app->make(Category::class),
                $app->make(ProductVariant::class),
                $app->make(ProductImage::class)
            );
        });

        // Cart Repository
        $this->app->bind(CartRepository::class, function ($app) {
            return new CartRepository(
                $app->make(Cart::class),
                $app->make(CartItem::class)
            );
        });

        // Order Repository
        $this->app->bind(OrderRepository::class, function ($app) {
            return new OrderRepository(
                $app->make(Order::class),
                $app->make(OrderItem::class),
                $app->make(ShipmentLog::class)
            );
        });

        // Affiliate Repository
        $this->app->bind(AffiliateRepository::class, function ($app) {
            return new AffiliateRepository(
                $app->make(Affiliate::class),
                $app->make(AffiliateClick::class),
                $app->make(AffiliateConversion::class),
                $app->make(AffiliatePayout::class)
            );
        });

        // Promotion Repository
        $this->app->bind(PromotionRepository::class, function ($app) {
            return new PromotionRepository(
                $app->make(FlashSale::class),
                $app->make(FlashSaleProduct::class),
                $app->make(Coupon::class),
                $app->make(BirthdayReward::class)
            );
        });

        // Content Repository
        $this->app->bind(ContentRepository::class, function ($app) {
            return new ContentRepository(
                $app->make(Article::class),
                $app->make(Notification::class)
            );
        });

        // B2B Repository
        $this->app->bind(B2BRepository::class, function ($app) {
            return new B2BRepository($app->make(B2BInquiry::class));
        });

        // Region Repository
        $this->app->bind(RegionRepository::class, function ($app) {
            return new RegionRepository(
                $app->make(Province::class),
                $app->make(City::class)
            );
        });
    }

    public function boot(): void
    {
        //
    }
}

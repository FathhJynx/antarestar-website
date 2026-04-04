<?php

namespace App\Repositories;

use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use App\Models\Coupon;
use App\Models\BirthdayReward;
use Illuminate\Database\Eloquent\Collection;

class PromotionRepository extends BaseRepository
{
    protected FlashSaleProduct $flashSaleProductModel;
    protected Coupon $couponModel;
    protected BirthdayReward $birthdayRewardModel;

    public function __construct(
        FlashSale $model,
        FlashSaleProduct $flashSaleProductModel,
        Coupon $couponModel,
        BirthdayReward $birthdayRewardModel
    ) {
        parent::__construct($model);
        $this->flashSaleProductModel = $flashSaleProductModel;
        $this->couponModel = $couponModel;
        $this->birthdayRewardModel = $birthdayRewardModel;
    }

    // Flash Sales
    public function getActiveFlashSales(): Collection
    {
        return $this->model->where('is_active', true)
            ->where('end_date', '>=', now())
            ->with(['products.product.images', 'products.product.variants', 'products.product.reviews'])
            ->get();
    }

    public function getAllFlashSales(): Collection
    {
        return $this->model->with(['products.product.images', 'products.product.variants', 'products.product.reviews'])->get();
    }

    public function findFlashSale(string $id): ?FlashSale
    {
        return $this->model->with(['products.product.images', 'products.product.variants', 'products.product.reviews'])->find($id);
    }

    public function createFlashSaleProduct(array $data): FlashSaleProduct
    {
        return $this->flashSaleProductModel->create($data);
    }

    public function deleteFlashSaleProduct(string $id): bool
    {
        return $this->flashSaleProductModel->findOrFail($id)->delete();
    }

    // Coupons
    public function findCouponByCode(string $code): ?Coupon
    {
        return $this->couponModel->where('code', $code)->first();
    }

    public function allCoupons(): Collection
    {
        return $this->couponModel->all();
    }

    public function createCoupon(array $data): Coupon
    {
        return $this->couponModel->create($data);
    }

    public function updateCoupon(string $id, array $data): Coupon
    {
        $coupon = $this->couponModel->findOrFail($id);
        $coupon->update($data);
        return $coupon->fresh();
    }

    public function incrementCouponUsage(string $id): void
    {
        $this->couponModel->where('id', $id)->increment('used_count');
    }

    // Birthday Rewards
    public function findBirthdayReward(string $userId, int $year): ?BirthdayReward
    {
        return $this->birthdayRewardModel
            ->where('user_id', $userId)
            ->where('year', $year)
            ->first();
    }

    public function createBirthdayReward(array $data): BirthdayReward
    {
        return $this->birthdayRewardModel->create($data);
    }

    public function claimBirthdayReward(string $id): BirthdayReward
    {
        $reward = $this->birthdayRewardModel->findOrFail($id);
        $reward->update(['is_claimed' => true]);
        return $reward->fresh();
    }
}

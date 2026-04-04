<?php

namespace App\Services;

use App\Repositories\PromotionRepository;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PromotionService
{
    protected PromotionRepository $promotionRepository;
    protected ProductService $productService;

    public function __construct(PromotionRepository $promotionRepository, ProductService $productService)
    {
        $this->promotionRepository = $promotionRepository;
        $this->productService = $productService;
    }

    // Flash Sales
    public function getActiveFlashSales()
    {
        $campaigns = $this->promotionRepository->getActiveFlashSales();
        
        foreach ($campaigns as $campaign) {
            foreach ($campaign->products as $fsp) {
                if ($fsp->product) {
                    $fsp->product = $this->productService->transformProductForFlashSale($fsp->product);
                }
            }
        }
        
        return $campaigns;
    }

    public function getFlashSale(string $id)
    {
        $campaign = $this->promotionRepository->findFlashSale($id);
        
        if ($campaign) {
            foreach ($campaign->products as $fsp) {
                if ($fsp->product) {
                    $fsp->product = $this->productService->transformProductForFlashSale($fsp->product);
                }
            }
        }
        
        return $campaign;
    }

    public function createFlashSale(array $data)
    {
        return $this->promotionRepository->create($data);
    }

    public function updateFlashSale(string $id, array $data)
    {
        return $this->promotionRepository->update($id, $data);
    }

    public function deleteFlashSale(string $id)
    {
        return $this->promotionRepository->delete($id);
    }

    public function getAllFlashSales()
    {
        return $this->promotionRepository->getAllFlashSales();
    }

    public function addFlashSaleProduct(array $data)
    {
        return $this->promotionRepository->createFlashSaleProduct($data);
    }

    public function removeFlashSaleProduct(string $id)
    {
        return $this->promotionRepository->deleteFlashSaleProduct($id);
    }

    // Coupons
    public function getAllCoupons()
    {
        return $this->promotionRepository->allCoupons();
    }

    public function createCoupon(array $data)
    {
        return $this->promotionRepository->createCoupon($data);
    }

    public function updateCoupon(string $id, array $data)
    {
        return $this->promotionRepository->updateCoupon($id, $data);
    }

    public function validateCoupon(string $code, float $purchaseAmount): array
    {
        $coupon = $this->promotionRepository->findCouponByCode($code);

        if (!$coupon) {
            throw new BadRequestHttpException('Coupon not found.');
        }

        if (!$coupon->is_active) {
            throw new BadRequestHttpException('Coupon is inactive.');
        }

        if ($coupon->valid_from && now()->lt($coupon->valid_from)) {
            throw new BadRequestHttpException('Coupon is not yet valid.');
        }

        if ($coupon->valid_until && now()->gt($coupon->valid_until)) {
            throw new BadRequestHttpException('Coupon has expired.');
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            throw new BadRequestHttpException('Coupon usage limit reached.');
        }

        if ($purchaseAmount < $coupon->min_purchase) {
            throw new BadRequestHttpException(
                'Minimum purchase amount not met. Required: ' . $coupon->min_purchase
            );
        }

        // Calculate discount
        $discount = 0;
        if ($coupon->type === 'percentage') {
            $discount = $purchaseAmount * ($coupon->value / 100);
            if ($coupon->max_discount && $discount > $coupon->max_discount) {
                $discount = $coupon->max_discount;
            }
        } else {
            $discount = $coupon->value;
        }

        return [
            'coupon' => $coupon,
            'discount' => round($discount, 2),
            'final_price' => round($purchaseAmount - $discount, 2),
        ];
    }

    public function applyCoupon(string $couponId): void
    {
        $this->promotionRepository->incrementCouponUsage($couponId);
    }

    // Birthday Rewards
    public function checkBirthdayReward(string $userId, string $birthDate): ?array
    {
        $currentYear = (int) date('Y');
        $birthMonth = (int) date('m', strtotime($birthDate));
        $currentMonth = (int) date('m');

        if ($birthMonth !== $currentMonth) {
            return null;
        }

        $existing = $this->promotionRepository->findBirthdayReward($userId, $currentYear);
        if ($existing) {
            return ['reward' => $existing, 'message' => 'Birthday reward already generated.'];
        }

        $reward = $this->promotionRepository->createBirthdayReward([
            'user_id' => $userId,
            'year' => $currentYear,
            'reward_value' => 50000, // Default 50,000 IDR birthday reward
            'is_claimed' => false,
        ]);

        return ['reward' => $reward, 'message' => 'Happy Birthday! Your reward is ready.'];
    }

    public function claimBirthdayReward(string $rewardId)
    {
        return $this->promotionRepository->claimBirthdayReward($rewardId);
    }
}

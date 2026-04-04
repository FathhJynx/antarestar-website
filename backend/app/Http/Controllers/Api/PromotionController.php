<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Services\PromotionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends BaseController
{
    protected PromotionService $promotionService;

    public function __construct(PromotionService $promotionService)
    {
        $this->promotionService = $promotionService;
    }

    // Flash Sales
    public function activeFlashSales(): JsonResponse
    {
        return $this->success($this->promotionService->getActiveFlashSales(), 'Active flash sales.');
    }

    public function flashSale(string $id): JsonResponse
    {
        return $this->success($this->promotionService->getFlashSale($id), 'Flash sale detail.');
    }

    public function createFlashSale(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'nullable|boolean',
        ]);

        return $this->success($this->promotionService->createFlashSale($data), 'Flash sale created.', 201);
    }

    public function updateFlashSale(string $id, Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:150',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'nullable|boolean',
        ]);

        return $this->success($this->promotionService->updateFlashSale($id, $data), 'Flash sale updated.');
    }

    public function deleteFlashSale(string $id): JsonResponse
    {
        $this->promotionService->deleteFlashSale($id);
        return $this->success(null, 'Flash sale deleted.');
    }

    public function indexFlashSales(): JsonResponse
    {
        return $this->success($this->promotionService->getAllFlashSales(), 'Flash sale list.');
    }

    public function addFlashSaleProduct(Request $request): JsonResponse
    {
        $data = $request->validate([
            'flash_sale_id' => 'required|string|exists:flash_sales,id',
            'product_id' => 'required|string|exists:products,id',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'sale_stock' => 'required|integer|min:0',
        ]);

        return $this->success($this->promotionService->addFlashSaleProduct($data), 'Product added to flash sale.', 201);
    }

    public function removeFlashSaleProduct(string $id): JsonResponse
    {
        $this->promotionService->removeFlashSaleProduct($id);
        return $this->success(null, 'Product removed from flash sale.');
    }

    // Coupons
    public function coupons(): JsonResponse
    {
        return $this->success($this->promotionService->getAllCoupons(), 'Coupon list.');
    }

    public function createCoupon(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'is_active' => 'nullable|boolean',
        ]);

        return $this->success($this->promotionService->createCoupon($data), 'Coupon created.', 201);
    }

    public function validateCoupon(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string',
            'purchase_amount' => 'required|numeric|min:0',
        ]);

        $result = $this->promotionService->validateCoupon($data['code'], $data['purchase_amount']);
        return $this->success($result, 'Coupon validated.');
    }

    // Birthday Rewards
    public function checkBirthdayReward(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->birth_date) {
            return $this->error('Birth date not set.', 400);
        }

        $result = $this->promotionService->checkBirthdayReward($user->id, $user->birth_date);
        if (!$result) {
            return $this->success(null, 'No birthday reward available this month.');
        }

        return $this->success($result, $result['message']);
    }

    public function claimBirthdayReward(string $id): JsonResponse
    {
        $reward = $this->promotionService->claimBirthdayReward($id);
        return $this->success($reward, 'Birthday reward claimed.');
    }
}

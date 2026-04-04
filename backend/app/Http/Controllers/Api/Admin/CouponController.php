<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\BaseController;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends BaseController
{
    protected CouponService $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $coupons = $this->couponService->getAllCoupons((int)$perPage);
        return $this->success($coupons, 'Coupon list retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'type' => 'required|string|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'boolean'
        ]);

        $coupon = $this->couponService->createCoupon($data);
        return $this->success($coupon, 'Coupon created successfully.', 201);
    }

    public function show(string $id): JsonResponse
    {
        $coupon = $this->couponService->getCoupon($id);
        if (!$coupon) return $this->error('Coupon not found.', 404);
        return $this->success($coupon, 'Coupon details retrieved.');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'code' => 'sometimes|string|unique:coupons,code,' . $id . '|max:50',
            'type' => 'sometimes|string|in:percentage,fixed',
            'value' => 'sometimes|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'boolean'
        ]);

        $coupon = $this->couponService->updateCoupon($id, $data);
        return $this->success($coupon, 'Coupon updated successfully.');
    }

    public function destroy(string $id): JsonResponse
    {
        $this->couponService->deleteCoupon($id);
        return $this->success(null, 'Coupon deleted successfully.');
    }
}

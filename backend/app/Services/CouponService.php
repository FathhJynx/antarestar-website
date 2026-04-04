<?php

namespace App\Services;

use App\Repositories\CouponRepository;
use App\Models\Coupon;

class CouponService
{
    protected CouponRepository $couponRepository;

    public function __construct(CouponRepository $couponRepository)
    {
        $this->couponRepository = $couponRepository;
    }

    public function getAllCoupons(int $perPage = 15)
    {
        return $this->couponRepository->getAllPaginated($perPage);
    }

    public function createCoupon(array $data): Coupon
    {
        return $this->couponRepository->create($data);
    }

    public function updateCoupon(string $id, array $data): Coupon
    {
        return $this->couponRepository->update($id, $data);
    }

    public function deleteCoupon(string $id): bool
    {
        return $this->couponRepository->delete($id);
    }

    public function getCoupon(string $id): ?Coupon
    {
        return $this->couponRepository->find($id);
    }
}

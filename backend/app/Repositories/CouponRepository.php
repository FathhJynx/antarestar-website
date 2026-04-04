<?php

namespace App\Repositories;

use App\Models\Coupon;
use Illuminate\Pagination\LengthAwarePaginator;

class CouponRepository extends BaseRepository
{
    public function __construct(Coupon $model)
    {
        parent::__construct($model);
    }

    public function getAllPaginated(int $perPage = 15)
    {
        return $this->model->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findByCode(string $code): ?Coupon
    {
        return $this->model->where('code', $code)->first();
    }
}

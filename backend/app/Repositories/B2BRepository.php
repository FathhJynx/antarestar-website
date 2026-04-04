<?php

namespace App\Repositories;

use App\Models\B2BInquiry;
use Illuminate\Pagination\LengthAwarePaginator;

class B2BRepository extends BaseRepository
{
    public function __construct(B2BInquiry $model)
    {
        parent::__construct($model);
    }

    public function getInquiries(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->orderBy('created_at', 'desc')->paginate($perPage);
    }
}

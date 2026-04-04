<?php

namespace App\Repositories;

use App\Models\Province;
use App\Models\City;
use Illuminate\Database\Eloquent\Collection;

class RegionRepository extends BaseRepository
{
    protected City $cityModel;

    public function __construct(Province $model, City $cityModel)
    {
        parent::__construct($model);
        $this->cityModel = $cityModel;
    }

    public function allProvinces(): Collection
    {
        return $this->model->orderBy('name')->get();
    }

    public function getCitiesByProvince(string $provinceId): Collection
    {
        return $this->cityModel->where('province_id', $provinceId)->orderBy('name')->get();
    }

    public function findCity(string $id): ?City
    {
        return $this->cityModel->with('province')->find($id);
    }
}

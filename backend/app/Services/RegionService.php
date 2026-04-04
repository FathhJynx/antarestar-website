<?php

namespace App\Services;

use App\Repositories\RegionRepository;

class RegionService
{
    protected RegionRepository $regionRepository;

    public function __construct(RegionRepository $regionRepository)
    {
        $this->regionRepository = $regionRepository;
    }

    public function getProvinces()
    {
        return $this->regionRepository->allProvinces();
    }

    public function getCitiesByProvince(string $provinceId)
    {
        return $this->regionRepository->getCitiesByProvince($provinceId);
    }
}

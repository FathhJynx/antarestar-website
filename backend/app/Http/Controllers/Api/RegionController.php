<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Services\RegionService;
use Illuminate\Http\JsonResponse;

class RegionController extends BaseController
{
    protected RegionService $regionService;

    public function __construct(RegionService $regionService)
    {
        $this->regionService = $regionService;
    }

    public function provinces(): JsonResponse
    {
        return $this->success($this->regionService->getProvinces(), 'Province list.');
    }

    public function cities(string $provinceId): JsonResponse
    {
        return $this->success($this->regionService->getCitiesByProvince($provinceId), 'City list.');
    }
}

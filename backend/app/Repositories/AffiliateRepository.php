<?php

namespace App\Repositories;

use App\Models\Affiliate;
use App\Models\AffiliateClick;
use App\Models\AffiliateConversion;
use App\Models\AffiliatePayout;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AffiliateRepository extends BaseRepository
{
    protected AffiliateClick $clickModel;
    protected AffiliateConversion $conversionModel;
    protected AffiliatePayout $payoutModel;

    public function __construct(
        Affiliate $model,
        AffiliateClick $clickModel,
        AffiliateConversion $conversionModel,
        AffiliatePayout $payoutModel
    ) {
        parent::__construct($model);
        $this->clickModel = $clickModel;
        $this->conversionModel = $conversionModel;
        $this->payoutModel = $payoutModel;
    }

    public function findByCode(string $code): ?Affiliate
    {
        return $this->model->where('code', $code)->first();
    }

    public function findByUserId(string $userId): ?Affiliate
    {
        return $this->model->where('user_id', $userId)->first();
    }

    public function findWithRelations(string $id): ?Affiliate
    {
        return $this->model->with(['user', 'parent', 'children'])->find($id);
    }

    // Click tracking
    public function recordClick(array $data): AffiliateClick
    {
        return $this->clickModel->create($data);
    }

    public function getClickCount(string $affiliateId): int
    {
        return $this->clickModel->where('affiliate_id', $affiliateId)->count();
    }

    // Conversion tracking
    public function createConversion(array $data): AffiliateConversion
    {
        return $this->conversionModel->create($data);
    }

    public function getConversionCount(string $affiliateId): int
    {
        return $this->conversionModel->where('affiliate_id', $affiliateId)->count();
    }

    public function getConversions(string $affiliateId): Collection
    {
        return $this->conversionModel->where('affiliate_id', $affiliateId)
            ->with(['order', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Balance management
    public function updateBalance(string $affiliateId, float $amount): void
    {
        $this->model->where('id', $affiliateId)->increment('balance', $amount);
        $this->model->where('id', $affiliateId)->increment('total_earnings', $amount);
    }

    public function deductBalance(string $affiliateId, float $amount): void
    {
        $this->model->where('id', $affiliateId)->decrement('balance', $amount);
    }

    public function deductTotalEarnings(string $affiliateId, float $amount): void
    {
        $this->model->where('id', $affiliateId)->decrement('total_earnings', $amount);
    }

    // Payouts
    public function createPayout(array $data): AffiliatePayout
    {
        return $this->payoutModel->create($data);
    }

    public function getPayouts(string $affiliateId): LengthAwarePaginator
    {
        return $this->payoutModel->where('affiliate_id', $affiliateId)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
    }

    public function findPayout(string $id): ?AffiliatePayout
    {
        return $this->payoutModel->find($id);
    }

    public function updatePayout(string $id, array $data): AffiliatePayout
    {
        $payout = $this->payoutModel->findOrFail($id);
        $payout->update($data);
        return $payout->fresh();
    }

    public function getAllAffiliates(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with(['user', 'parent'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getAllPayouts(int $perPage = 15): LengthAwarePaginator
    {
        return $this->payoutModel->with(['affiliate.user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}

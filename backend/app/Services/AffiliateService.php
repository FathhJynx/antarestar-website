<?php

namespace App\Services;

use App\Repositories\AffiliateRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class AffiliateService
{
    protected AffiliateRepository $affiliateRepository;

    public function __construct(AffiliateRepository $affiliateRepository)
    {
        $this->affiliateRepository = $affiliateRepository;
    }

    public function createAffiliate(string $userId, ?string $parentAffiliateId = null): \App\Models\Affiliate
    {
        // Check if user already has an affiliate account
        $existing = $this->affiliateRepository->findByUserId($userId);
        if ($existing) {
            throw new BadRequestHttpException('User already has an affiliate account.');
        }

        $code = $this->generateAffiliateCode();

        return $this->affiliateRepository->create([
            'user_id' => $userId,
            'code' => $code,
            'parent_affiliate_id' => $parentAffiliateId,
            'commission_value' => 5.00, // Default 5% commission
            'balance' => 0,
            'total_earnings' => 0,
            'is_active' => true,
        ]);
    }

    public function trackClick(string $affiliateCode, string $ipAddress, string $userAgent): void
    {
        $affiliate = $this->affiliateRepository->findByCode($affiliateCode);
        if (!$affiliate || !$affiliate->is_active) {
            throw new BadRequestHttpException('Invalid or inactive affiliate code.');
        }

        $this->affiliateRepository->recordClick([
            'affiliate_id' => $affiliate->id,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    public function getDashboard(string $userId): array
    {
        $affiliate = $this->affiliateRepository->findByUserId($userId);
        if (!$affiliate) {
            throw new BadRequestHttpException('No affiliate account found.');
        }

        $totalClicks = $this->affiliateRepository->getClickCount($affiliate->id);
        $totalConversions = $this->affiliateRepository->getConversionCount($affiliate->id);
        $conversionRate = $totalClicks > 0 ? round(($totalConversions / $totalClicks) * 100, 2) : 0;

        return [
            'affiliate' => $affiliate->load(['user', 'parent', 'children']),
            'stats' => [
                'total_clicks' => $totalClicks,
                'total_conversions' => $totalConversions,
                'conversion_rate' => $conversionRate . '%',
                'total_earnings' => $affiliate->total_earnings,
                'current_balance' => $affiliate->balance,
            ],
        ];
    }

    public function getConversions(string $userId)
    {
        $affiliate = $this->affiliateRepository->findByUserId($userId);
        if (!$affiliate) {
            throw new BadRequestHttpException('No affiliate account found.');
        }

        return $this->affiliateRepository->getConversions($affiliate->id);
    }

    public function requestPayout(string $userId, array $data)
    {
        return DB::transaction(function () use ($userId, $data) {
            $affiliate = $this->affiliateRepository->findByUserId($userId);
            if (!$affiliate) {
                throw new BadRequestHttpException('No affiliate account found.');
            }

            $amount = $data['amount'];

            if ($amount <= 0) {
                throw new BadRequestHttpException('Payout amount must be greater than 0.');
            }

            if ($affiliate->balance < $amount) {
                throw new BadRequestHttpException(
                    'Insufficient balance. Current: ' . $affiliate->balance . ', Requested: ' . $amount
                );
            }

            // Deduct balance
            $this->affiliateRepository->deductBalance($affiliate->id, $amount);

            // Create payout record
            return $this->affiliateRepository->createPayout([
                'affiliate_id' => $affiliate->id,
                'amount' => $amount,
                'status' => 'pending',
                'bank_name' => $data['bank_name'],
                'account_number' => $data['account_number'],
                'account_name' => $data['account_name'],
                'requested_at' => now(),
            ]);
        });
    }

    public function getPayouts(string $userId)
    {
        $affiliate = $this->affiliateRepository->findByUserId($userId);
        if (!$affiliate) {
            throw new BadRequestHttpException('No affiliate account found.');
        }

        return $this->affiliateRepository->getPayouts($affiliate->id);
    }

    public function updatePayoutStatus(string $payoutId, string $status)
    {
        $validStatuses = ['pending', 'approved', 'rejected'];
        if (!in_array($status, $validStatuses)) {
            throw new BadRequestHttpException('Invalid payout status.');
        }

        $data = ['status' => $status];

        if ($status === 'approved') {
            $data['processed_at'] = now();
        }

        // If rejected, refund balance
        if ($status === 'rejected') {
            $payout = $this->affiliateRepository->findPayout($payoutId);
            $this->affiliateRepository->updateBalance($payout->affiliate_id, $payout->amount);
        }

        return $this->affiliateRepository->updatePayout($payoutId, $data);
    }

    private function generateAffiliateCode(): string
    {
        do {
            $code = 'AFF-' . strtoupper(Str::random(8));
        } while ($this->affiliateRepository->findByCode($code));

        return $code;
    }

    public function getAllAffiliates(int $perPage = 15)
    {
        return $this->affiliateRepository->getAllAffiliates($perPage);
    }

    public function getAllPayouts(int $perPage = 15)
    {
        return $this->affiliateRepository->getAllPayouts($perPage);
    }
}

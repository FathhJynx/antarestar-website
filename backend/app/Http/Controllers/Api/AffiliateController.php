<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Http\Requests\PayoutRequest;
use App\Services\AffiliateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Affiliate Program
 * 
 * Endpoints for affiliate registration, dashboard, track and payouts.
 */
class AffiliateController extends BaseController
{
    protected AffiliateService $affiliateService;

    public function __construct(AffiliateService $affiliateService)
    {
        $this->affiliateService = $affiliateService;
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'parent_affiliate_id' => 'nullable|string|exists:affiliates,id',
        ]);

        $affiliate = $this->affiliateService->createAffiliate(
            $request->user()->id,
            $data['parent_affiliate_id'] ?? null
        );

        return $this->success($affiliate, 'Affiliate account created.', 201);
    }

    public function trackClick(Request $request, string $code): JsonResponse
    {
        $this->affiliateService->trackClick(
            $code,
            $request->ip(),
            $request->userAgent()
        );

        return $this->success(null, 'Click tracked.');
    }

    public function dashboard(Request $request): JsonResponse
    {
        $result = $this->affiliateService->getDashboard($request->user()->id);
        return $this->success($result, 'Affiliate dashboard.');
    }

    public function conversions(Request $request): JsonResponse
    {
        $result = $this->affiliateService->getConversions($request->user()->id);
        return $this->success($result, 'Affiliate conversions.');
    }

    public function requestPayout(PayoutRequest $request): JsonResponse
    {
        $payout = $this->affiliateService->requestPayout($request->user()->id, $request->validated());
        return $this->success($payout, 'Payout request submitted.', 201);
    }

    public function payouts(Request $request): JsonResponse
    {
        $payouts = $this->affiliateService->getPayouts($request->user()->id);
        return $this->success($payouts, 'Payout list.');
    }

    public function updatePayoutStatus(Request $request, string $id): JsonResponse
    {
        $data = $request->validate(['status' => 'required|in:pending,approved,rejected']);
        $payout = $this->affiliateService->updatePayoutStatus($id, $data['status']);
        return $this->success($payout, 'Payout status updated.');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $affiliates = $this->affiliateService->getAllAffiliates((int)$perPage);
        return $this->success($affiliates, 'Admin affiliate list.');
    }

    public function adminPayouts(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $payouts = $this->affiliateService->getAllPayouts((int)$perPage);
        return $this->success($payouts, 'Admin payout list.');
    }
}

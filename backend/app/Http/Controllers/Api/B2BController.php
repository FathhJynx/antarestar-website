<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Services\B2BService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group B2B & Corporate
 * 
 * Endpoints for B2B portal inquiries and corporate order management.
 */
class B2BController extends BaseController
{
    protected B2BService $b2bService;

    public function __construct(B2BService $b2bService)
    {
        $this->b2bService = $b2bService;
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:150',
            'contact_name' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        $inquiry = $this->b2bService->createInquiry($data);
        return $this->success($inquiry, 'B2B inquiry submitted.', 201);
    }

    public function index(): JsonResponse
    {
        return $this->success($this->b2bService->getInquiries(), 'B2B inquiries.');
    }

    public function show(string $id): JsonResponse
    {
        $inquiry = $this->b2bService->getInquiry($id);
        if (!$inquiry) {
            return $this->error('Inquiry not found.', 404);
        }
        return $this->success($inquiry, 'Inquiry detail.');
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $data = $request->validate(['status' => 'required|in:pending,contacted,completed']);
        return $this->success($this->b2bService->updateInquiryStatus($id, $data['status']), 'Status updated.');
    }
}

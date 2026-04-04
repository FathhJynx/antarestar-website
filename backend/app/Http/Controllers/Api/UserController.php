<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Http\Requests\AddressRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function profile(Request $request): JsonResponse
    {
        $result = $this->userService->getProfile($request->user()->id);
        return $this->success($result, 'User profile.');
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'bio' => 'nullable|string|max:500',
        ]);

        $user = $this->userService->updateProfile($request->user()->id, $data);
        return $this->success($user, 'Profile updated.');
    }

    public function pointHistory(Request $request): JsonResponse
    {
        $history = $this->userService->getPointHistory($request->user()->id);
        return $this->success($history, 'Point history.');
    }

    public function referrals(Request $request): JsonResponse
    {
        $referrals = $this->userService->getReferrals($request->user()->id);
        return $this->success($referrals, 'Referral list.');
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 5);
        $leaderboard = $this->userService->getLeaderboard((int)$limit);
        return $this->success($leaderboard, 'Leaderboard.');
    }

    // Addresses
    public function addresses(Request $request): JsonResponse
    {
        $addresses = $this->userService->getAddresses($request->user()->id);
        return $this->success($addresses, 'Address list.');
    }

    public function createAddress(AddressRequest $request): JsonResponse
    {
        $address = $this->userService->createAddress($request->user()->id, $request->validated());
        return $this->success($address, 'Address created.', 201);
    }

    public function updateAddress(AddressRequest $request, string $id): JsonResponse
    {
        $address = $this->userService->updateAddress($request->user()->id, $id, $request->validated());
        return $this->success($address, 'Address updated.');
    }

    public function deleteAddress(string $id): JsonResponse
    {
        $this->userService->deleteAddress($id);
        return $this->success(null, 'Address deleted.');
    }

    // Admin Endpoints
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $users = $this->userService->getAllUsers((int)$perPage, $search);
        return $this->success($users, 'User list.');
    }

    public function show(string $id): JsonResponse
    {
        $user = $this->userService->getDetailedProfile($id);
        return $this->success($user, 'User detail.');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|string|in:user,admin'
        ]);

        $user = $this->userService->updateProfile($id, $data);
        return $this->success($user, 'User profile updated.');
    }

    public function leaderboardOrders(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $leaderboard = $this->userService->getTopOrderers((int)$limit);
        return $this->success($leaderboard, 'Order leaderboard.');
    }

    public function updateRole(Request $request, string $id): JsonResponse
    {
        $request->validate(['role' => 'required|string|in:user,admin']);
        $user = $this->userService->updateRole($id, $request->input('role'));
        return $this->success($user, 'User role updated.');
    }

    public function adjustPoints(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'points' => 'required|integer',
            'reason' => 'required|string|max:200'
        ]);

        $this->userService->adjustPoints($id, $request->input('points'), $request->input('reason'));
        return $this->success(null, 'Points adjusted.');
    }
}

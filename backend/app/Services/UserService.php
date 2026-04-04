<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\Tier;
use Illuminate\Support\Facades\DB;

class UserService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getProfile(string $userId): array
    {
        $user = $this->userRepository->findWithRelations($userId);
        $totalPoints = $this->userRepository->getTotalPoints($userId);
        $membership = $this->userRepository->getCurrentMembership($userId);
        $globalRank = $this->userRepository->getGlobalRank($userId);

        return [
            'user' => $user,
            'total_points' => $totalPoints,
            'current_tier' => $membership?->tier,
            'global_rank' => $globalRank,
        ];
    }

    public function updateProfile(string $userId, array $data): \App\Models\User
    {
        return $this->userRepository->update($userId, $data);
    }

    public function getPointHistory(string $userId)
    {
        return $this->userRepository->getPointHistory($userId);
    }

    public function addPoints(string $userId, int $points, string $source): void
    {
        DB::transaction(function () use ($userId, $points, $source) {
            $this->userRepository->addPoints($userId, $points, $source);
            $this->checkAndUpgradeTier($userId);
        });
    }

    /**
     * Auto-upgrade tier based on total points.
     * Tiers: Bronze (0), Ranger (500), Elite (2000)
     */
    public function checkAndUpgradeTier(string $userId): void
    {
        $totalPoints = $this->userRepository->getTotalPoints($userId);
        $currentMembership = $this->userRepository->getCurrentMembership($userId);

        // Find the highest qualifying tier
        $qualifyingTier = Tier::where('min_points', '<=', $totalPoints)
            ->orderBy('min_points', 'desc')
            ->first();

        if (!$qualifyingTier) {
            return;
        }

        // Upgrade if current tier is different (or no tier)
        if (!$currentMembership || $currentMembership->tier_id !== $qualifyingTier->id) {
            $this->userRepository->createMembership($userId, $qualifyingTier->id);
        }
    }

    public function getReferrals(string $userId)
    {
        return $this->userRepository->getReferrals($userId);
    }

    // Address management
    public function getAddresses(string $userId)
    {
        return $this->userRepository->getAddresses($userId);
    }

    public function createAddress(string $userId, array $data): \App\Models\Address
    {
        $data['user_id'] = $userId;

        // If setting as default, reset others
        if (!empty($data['is_default'])) {
            $this->userRepository->resetDefaultAddress($userId);
        }

        return $this->userRepository->createAddress($data);
    }

    public function updateAddress(string $userId, string $addressId, array $data): \App\Models\Address
    {
        if (!empty($data['is_default'])) {
            $this->userRepository->resetDefaultAddress($userId);
        }

        return $this->userRepository->updateAddress($addressId, $data);
    }

    public function deleteAddress(string $addressId): bool
    {
        return $this->userRepository->deleteAddress($addressId);
    }

    public function getLeaderboard(int $limit = 5)
    {
        return $this->userRepository->getLeaderboard($limit);
    }

    public function getAllUsers(int $perPage = 15, ?string $search = null)
    {
        return $this->userRepository->getAllUsersPaginated($perPage, $search);
    }

    public function updateRole(string $userId, string $role): \App\Models\User
    {
        return $this->userRepository->updateRole($userId, $role);
    }

    public function adjustPoints(string $userId, int $points, string $reason): void
    {
        $this->addPoints($userId, $points, "Admin adjustment: " . $reason);
    }

    public function getTopOrderers(int $limit = 10)
    {
        return $this->userRepository->getTopOrderers($limit);
    }

    public function getDetailedProfile(string $userId)
    {
        return $this->userRepository->findWithDetailedStats($userId);
    }
}

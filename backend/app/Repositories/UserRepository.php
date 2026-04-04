<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserPoint;
use App\Models\UserMembership;
use App\Models\Referral;
use App\Models\Address;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository
{
    protected UserPoint $userPointModel;
    protected UserMembership $membershipModel;
    protected Referral $referralModel;
    protected Address $addressModel;

    public function __construct(
        User $model,
        UserPoint $userPointModel,
        UserMembership $membershipModel,
        Referral $referralModel,
        Address $addressModel
    ) {
        parent::__construct($model);
        $this->userPointModel = $userPointModel;
        $this->membershipModel = $membershipModel;
        $this->referralModel = $referralModel;
        $this->addressModel = $addressModel;
    }

    public function findWithRelations(string $id): ?User
    {
        return $this->model->with(['membership.tier', 'points', 'addresses.province', 'addresses.city'])->find($id);
    }

    public function getTotalPoints(string $userId): int
    {
        return $this->userPointModel->where('user_id', $userId)->sum('points');
    }

    public function addPoints(string $userId, int $points, string $source): UserPoint
    {
        return $this->userPointModel->create([
            'user_id' => $userId,
            'points' => $points,
            'source' => $source,
        ]);
    }

    public function getPointHistory(string $userId)
    {
        return $this->userPointModel->where('user_id', $userId)->orderBy('created_at', 'desc')->paginate(20);
    }

    public function getCurrentMembership(string $userId): ?UserMembership
    {
        return $this->membershipModel->where('user_id', $userId)->with('tier')->latest()->first();
    }

    public function createMembership(string $userId, string $tierId): UserMembership
    {
        return $this->membershipModel->create([
            'user_id' => $userId,
            'tier_id' => $tierId,
            'joined_at' => now(),
        ]);
    }

    public function createReferral(string $referrerId, string $referredId, string $code): Referral
    {
        return $this->referralModel->create([
            'referrer_user_id' => $referrerId,
            'referred_user_id' => $referredId,
            'referral_code' => $code,
        ]);
    }

    public function getReferrals(string $userId): Collection
    {
        return $this->referralModel->where('referrer_user_id', $userId)->with('referred')->get();
    }

    // Address methods
    public function getAddresses(string $userId): Collection
    {
        return $this->addressModel->where('user_id', $userId)->with(['province', 'city'])->get();
    }

    public function createAddress(array $data): Address
    {
        return $this->addressModel->create($data);
    }

    public function updateAddress(string $id, array $data): Address
    {
        $address = $this->addressModel->findOrFail($id);
        $address->update($data);
        return $address->fresh();
    }

    public function deleteAddress(string $id): bool
    {
        return $this->addressModel->findOrFail($id)->delete();
    }

    public function resetDefaultAddress(string $userId): void
    {
        $this->addressModel->where('user_id', $userId)->update(['is_default' => false]);
    }

    public function getLeaderboard(int $limit = 5): Collection
    {
        return $this->model->with(['membership.tier'])
            ->withSum('points as total_points', 'points')
            ->orderByDesc('total_points')
            ->limit($limit)
            ->get();
    }

    public function getGlobalRank(string $userId): int
    {
        $userPoints = $this->getTotalPoints($userId);
        
        return $this->model->withSum('points as total_points', 'points')
            ->whereHas('points')
            ->having('total_points', '>', $userPoints)
            ->count() + 1;
    }

    public function getAllUsersPaginated(int $perPage = 15, ?string $search = null)
    {
        $query = $this->model->with(['membership.tier'])
            ->withSum('points as total_points', 'points')
            ->withCount(['orders' => function ($q) {
                $q->where('status', 'completed');
            }]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function updateRole(string $userId, string $role): User
    {
        $user = $this->model->findOrFail($userId);
        $user->update(['role' => $role]);
        return $user->fresh();
    }

    public function getTopOrderers(int $limit = 10): Collection
    {
        return $this->model->with(['membership.tier'])
            ->withCount(['orders' => function($q) {
                $q->where('status', 'completed');
            }])
            ->orderByDesc('orders_count')
            ->limit($limit)
            ->get();
    }

    public function findWithDetailedStats(string $id): ?User
    {
        return $this->model->with([
            'membership.tier', 
            'points', 
            'orders.items.productVariant.product',
            'addresses.province',
            'addresses.city'
        ])
        ->withSum('points as total_points', 'points')
        ->withCount(['orders' => function($q) {
            $q->where('status', 'completed');
        }])
        ->find($id);
    }

    public function getAdminIds(): array
    {
        return $this->model->where('role', 'admin')->pluck('id')->toArray();
    }
}

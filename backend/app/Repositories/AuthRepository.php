<?php

namespace App\Repositories;

use App\Models\User;

class AuthRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function findByReferralCode(string $code): ?User
    {
        return $this->model->where('referral_code', $code)->first();
    }
}

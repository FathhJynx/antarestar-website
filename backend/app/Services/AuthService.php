<?php

namespace App\Services;

use App\Repositories\AuthRepository;
use App\Repositories\UserRepository;
use App\Models\Tier;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected AuthRepository $authRepository;
    protected UserRepository $userRepository;

    public function __construct(AuthRepository $authRepository, UserRepository $userRepository)
    {
        $this->authRepository = $authRepository;
        $this->userRepository = $userRepository;
    }

    public function register(array $data): array
    {
        // Check if email already exists
        if ($this->authRepository->findByEmail($data['email'])) {
            throw ValidationException::withMessages(['email' => 'Email already registered.']);
        }

        // Generate unique referral code
        $data['referral_code'] = $this->generateReferralCode();

        // Create user
        $user = $this->authRepository->create($data);

        // Handle referral if provided
        if (!empty($data['referred_by'])) {
            $referrer = $this->authRepository->findByReferralCode($data['referred_by']);
            if ($referrer) {
                $this->userRepository->createReferral($referrer->id, $user->id, $data['referred_by']);
                // Award referral bonus points to referrer
                $this->userRepository->addPoints($referrer->id, 100, 'referral_bonus');
                // Award welcome bonus to new user
                $this->userRepository->addPoints($user->id, 50, 'referral_welcome');
            }
        }

        // Assign default Bronze tier
        $bronzeTier = Tier::where('name', 'Bronze')->first();
        if ($bronzeTier) {
            $this->userRepository->createMembership($user->id, $bronzeTier->id);
        }

        // Create API token
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user->fresh(['membership.tier']),
            'token' => $token,
        ];
    }

    public function login(array $credentials): array
    {
        $user = $this->authRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'email atau password yang lo masukkin salah nih']);
        }

        // Revoke all existing tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user->load(['membership.tier']),
            'token' => $token,
        ];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function forgotPassword(array $data): string
    {
        $status = Password::sendResetLink($data);

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages(['email' => __($status)]);
        }

        return __($status);
    }

    public function resetPassword(array $data): string
    {
        $status = Password::reset($data, function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();
        });

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => __($status)]);
        }

        return __($status);
    }

    private function generateReferralCode(): string
    {
        do {
            $code = 'ANT-' . strtoupper(Str::random(8));
        } while ($this->authRepository->findByReferralCode($code));

        return $code;
    }
}

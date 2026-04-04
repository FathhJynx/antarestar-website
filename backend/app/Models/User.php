<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasUuid;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'birth_date',
        'bio',
        'referral_code',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birth_date' => 'date',
        ];
    }
    
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Relationships
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function points()
    {
        return $this->hasMany(UserPoint::class);
    }

    public function membership()
    {
        return $this->hasOne(UserMembership::class)->latest();
    }

    public function memberships()
    {
        return $this->hasMany(UserMembership::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function affiliate()
    {
        return $this->hasOne(Affiliate::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function referralsMade()
    {
        return $this->hasMany(Referral::class, 'referrer_user_id');
    }

    public function referredBy()
    {
        return $this->hasOne(Referral::class, 'referred_user_id');
    }

    public function birthdayRewards()
    {
        return $this->hasMany(BirthdayReward::class);
    }
}

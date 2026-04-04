<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Affiliate extends Model
{
    use HasUuid;

    protected $fillable = [
        'user_id',
        'code',
        'parent_affiliate_id',
        'commission_value',
        'balance',
        'total_earnings',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'commission_value' => 'decimal:2',
            'balance' => 'decimal:2',
            'total_earnings' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Affiliate::class, 'parent_affiliate_id');
    }

    public function children()
    {
        return $this->hasMany(Affiliate::class, 'parent_affiliate_id');
    }

    public function clicks()
    {
        return $this->hasMany(AffiliateClick::class);
    }

    public function conversions()
    {
        return $this->hasMany(AffiliateConversion::class);
    }

    public function payouts()
    {
        return $this->hasMany(AffiliatePayout::class);
    }
}

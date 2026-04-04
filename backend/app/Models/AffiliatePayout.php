<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class AffiliatePayout extends Model
{
    use HasUuid;

    protected $fillable = [
        'affiliate_id',
        'amount',
        'status',
        'bank_name',
        'account_number',
        'account_name',
        'requested_at',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'requested_at' => 'datetime',
            'processed_at' => 'datetime',
        ];
    }

    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class);
    }
}

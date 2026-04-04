<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class AffiliateConversion extends Model
{
    use HasUuid;

    protected $fillable = ['affiliate_id', 'user_id', 'order_id', 'commission_amount', 'status'];

    protected function casts(): array
    {
        return ['commission_amount' => 'decimal:2'];
    }

    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

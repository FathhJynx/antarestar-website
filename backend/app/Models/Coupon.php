<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasUuid;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_purchase',
        'max_discount',
        'usage_limit',
        'used_count',
        'valid_from',
        'valid_until',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'min_purchase' => 'decimal:2',
            'max_discount' => 'decimal:2',
            'usage_limit' => 'integer',
            'used_count' => 'integer',
            'valid_from' => 'datetime',
            'valid_until' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
    public function isValid(?float $orderAmount = null): bool
    {
        if (!$this->is_active) return false;
        
        $now = now();
        if ($this->valid_from && $this->valid_from->isFuture()) return false;
        if ($this->valid_until && $this->valid_until->isPast()) return false;
        
        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) return false;
        
        if ($orderAmount !== null && $this->min_purchase !== null && $orderAmount < $this->min_purchase) return false;
        
        return true;
    }

    public function calculateDiscount(float $subtotal, float $shippingCost = 0): float
    {
        $discount = 0;

        switch ($this->type) {
            case 'fixed':
                $discount = $this->value;
                break;
            case 'percentage':
                $discount = $subtotal * ($this->value / 100);
                if ($this->max_discount && $discount > $this->max_discount) {
                    $discount = $this->max_discount;
                }
                break;
            case 'shipping':
                $discount = $shippingCost;
                break;
        }

        return min($discount, $subtotal + $shippingCost);
    }
}

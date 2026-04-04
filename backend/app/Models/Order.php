<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasUuid;

    protected $fillable = [
        'user_id',
        'address_id',
        'affiliate_id',
        'coupon_id',
        'total_price',
        'discount_amount',
        'status',
        'payment_method',
        'shipping_courier',
        'shipping_service',
        'shipping_cost',
    ];

    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shipmentLogs()
    {
        return $this->hasMany(ShipmentLog::class);
    }

    public function affiliateConversion()
    {
        return $this->hasOne(AffiliateConversion::class);
    }

    /**
     * Get the reviews for the order.
     */
    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}

<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FlashSaleProduct extends Model
{
    use HasUuid;

    protected $fillable = ['flash_sale_id', 'product_id', 'discount_type', 'discount_value', 'sale_stock'];

    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'sale_stock' => 'integer',
        ];
    }

    public function flashSale()
    {
        return $this->belongsTo(FlashSale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

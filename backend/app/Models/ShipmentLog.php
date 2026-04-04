<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class ShipmentLog extends Model
{
    use HasUuid;

    protected $fillable = ['order_id', 'status', 'description', 'location'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

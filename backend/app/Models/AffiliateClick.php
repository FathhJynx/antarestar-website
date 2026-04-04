<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class AffiliateClick extends Model
{
    use HasUuid;

    protected $fillable = ['affiliate_id', 'ip_address', 'user_agent'];

    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class);
    }
}

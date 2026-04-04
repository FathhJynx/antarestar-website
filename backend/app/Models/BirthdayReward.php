<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class BirthdayReward extends Model
{
    use HasUuid;

    protected $fillable = ['user_id', 'year', 'reward_value', 'is_claimed'];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'reward_value' => 'decimal:2',
            'is_claimed' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

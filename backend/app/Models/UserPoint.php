<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class UserPoint extends Model
{
    use HasUuid;

    protected $fillable = ['user_id', 'points', 'source'];

    protected function casts(): array
    {
        return ['points' => 'integer'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

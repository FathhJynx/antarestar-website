<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Tier extends Model
{
    use HasUuid;

    protected $fillable = ['name', 'min_points', 'benefits'];

    protected function casts(): array
    {
        return [
            'min_points' => 'integer',
        ];
    }

    public function memberships()
    {
        return $this->hasMany(UserMembership::class);
    }
}

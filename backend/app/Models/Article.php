<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasUuid;

    protected $fillable = ['title', 'slug', 'content', 'image_url', 'is_published'];

    protected function casts(): array
    {
        return ['is_published' => 'boolean'];
    }
}

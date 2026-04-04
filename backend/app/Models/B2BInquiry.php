<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class B2BInquiry extends Model
{
    use HasUuid;

    protected $table = 'b2b_inquiries';

    protected $fillable = [
        'company_name',
        'contact_name',
        'email',
        'phone',
        'message',
        'status',
    ];
}

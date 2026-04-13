<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address_id' => 'required|string|exists:addresses,id',
            'affiliate_id' => 'nullable|string|exists:affiliates,id',
            'payment_method' => 'required|string|in:gopay,bca,mandiri,cc,ovo,shopeepay,cod',
            'shipping_courier' => 'required|string|max:50',
            'shipping_service' => 'required|string|max:50',
            'shipping_cost' => 'required|numeric|min:0',
            'coupon_code' => 'nullable|string|exists:coupons,code',
            'notes' => 'nullable|string|max:255',
        ];
    }
}

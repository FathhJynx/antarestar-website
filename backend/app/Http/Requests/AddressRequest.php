<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'province_id' => 'required|string|exists:provinces,id',
            'city_id' => 'required|string|exists:cities,id',
            'recipient_name' => 'required|string|min:3|max:100',
            'phone' => 'required|string|regex:/^08[0-9]{8,11}$/',
            'address' => 'required|string|min:10',
            'postal_code' => 'required|string|size:5',
            'is_default' => 'nullable|boolean',
        ];
    }
}

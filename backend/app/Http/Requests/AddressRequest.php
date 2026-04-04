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
            'recipient_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'postal_code' => 'required|string|max:10',
            'is_default' => 'nullable|boolean',
        ];
    }
}

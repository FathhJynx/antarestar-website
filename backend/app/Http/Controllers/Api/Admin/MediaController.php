<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends BaseController
{
    /**
     * Upload an image to the public product storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
        ]);

        if (!$request->hasFile('image')) {
            return $this->error('File not found.', 400);
        }

        $file = $request->file('image');
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Store in the 'public' disk under the 'products' directory
        $path = $file->storeAs('products', $fileName, 'public');
        
        if (!$path) {
            return $this->error('Failed to store file.', 500);
        }

        // Return the full URl (ensure storage:link is run)
        $url = asset('storage/' . $path);

        return $this->success([
            'url' => $url,
            'name' => $fileName,
            'path' => $path
        ], 'Media uploaded successfully.', 201);
    }
}

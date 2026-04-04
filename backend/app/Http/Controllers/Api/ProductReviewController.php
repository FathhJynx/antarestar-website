<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\ProductReview;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductReviewController extends BaseController
{
    /**
     * Store a new product review.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => 'required|uuid|exists:orders,id',
            'product_id' => 'required|uuid|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        // Optional: Check if the user owns the order and it is 'completed'
        $order = Order::find($data['order_id']);
        if ($order->user_id !== $request->user()->id) {
            return $this->error('Unauthorized to review this order.', 403);
        }

        if ($order->status !== 'completed') {
            return $this->error('Order must be completed before rating.', 422);
        }

        $review = ProductReview::create([
            'user_id' => $request->user()->id,
            'product_id' => $data['product_id'],
            'order_id' => $data['order_id'],
            'rating' => $data['rating'],
            'comment' => $data['comment']
        ]);

        return $this->success($review, 'Thank you for your rating!', 201);
    }
}

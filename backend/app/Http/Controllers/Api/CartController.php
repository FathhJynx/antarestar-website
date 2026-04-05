<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Member: Shopping Cart
 * 
 * Endpoints for managing the user's persistent shopping cart.
 */
class CartController extends BaseController
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getCart($request->user()->id);
        return $this->success($cart, 'Cart details.');
    }

    public function addItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_variant_id' => 'required|string|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = $this->cartService->addItem(
            $request->user()->id,
            $data['product_variant_id'],
            $data['quantity']
        );

        return $this->success($item, 'Item added to cart.', 201);
    }

    public function updateItem(Request $request, string $itemId): JsonResponse
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item = $this->cartService->updateItemQuantity($itemId, $data['quantity']);
        return $this->success($item, 'Cart item updated.');
    }

    public function removeItem(string $itemId): JsonResponse
    {
        $this->cartService->removeItem($itemId);
        return $this->success(null, 'Item removed from cart.');
    }
}

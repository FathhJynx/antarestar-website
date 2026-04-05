<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;

class CartRepository extends BaseRepository
{
    protected CartItem $cartItemModel;

    public function __construct(Cart $model, CartItem $cartItemModel)
    {
        parent::__construct($model);
        $this->cartItemModel = $cartItemModel;
    }

    public function getActiveCart(string $userId): ?Cart
    {
        return $this->model->where('user_id', $userId)
            ->with(['items.productVariant.product.images'])
            ->first();
    }

    public function getOrCreateCart(string $userId): Cart
    {
        return $this->model->firstOrCreate(['user_id' => $userId]);
    }

    public function findCartItem(string $cartId, string $productVariantId): ?CartItem
    {
        return $this->cartItemModel
            ->where('cart_id', $cartId)
            ->where('product_variant_id', $productVariantId)
            ->first();
    }

    public function addItem(array $data): CartItem
    {
        return $this->cartItemModel->create($data);
    }

    public function updateItemQuantity(string $itemId, int $quantity): CartItem
    {
        $item = $this->cartItemModel->findOrFail($itemId);
        $item->update(['quantity' => $quantity]);
        return $item->fresh();
    }

    public function removeItem(string $itemId): bool
    {
        return $this->cartItemModel->findOrFail($itemId)->delete();
    }

    public function clearCart(string $cartId): void
    {
        $this->cartItemModel->where('cart_id', $cartId)->delete();
    }

    public function getCartItems(string $cartId)
    {
        return $this->cartItemModel->where('cart_id', $cartId)
            ->with(['productVariant.product'])
            ->get();
    }
}

<?php

namespace App\Services;

use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CartService
{
    protected CartRepository $cartRepository;
    protected ProductRepository $productRepository;

    public function __construct(CartRepository $cartRepository, ProductRepository $productRepository)
    {
        $this->cartRepository = $cartRepository;
        $this->productRepository = $productRepository;
    }

    public function getCart(string $userId)
    {
        return $this->cartRepository->getActiveCart($userId);
    }

    public function addItem(string $userId, string $productVariantId, int $quantity): \App\Models\CartItem
    {
        // Validate variant exists and has stock
        $variant = $this->productRepository->findVariant($productVariantId);
        if (!$variant) {
            throw new BadRequestHttpException('Product variant not found.');
        }

        if ($variant->stock < $quantity) {
            throw new BadRequestHttpException('Insufficient stock. Available: ' . $variant->stock);
        }

        $cart = $this->cartRepository->getOrCreateCart($userId);

        // Check if item already exists in cart
        $existingItem = $this->cartRepository->findCartItem($cart->id, $productVariantId);

        if ($existingItem) {
            $newQty = $existingItem->quantity + $quantity;
            if ($variant->stock < $newQty) {
                throw new BadRequestHttpException('Insufficient stock for total quantity. Available: ' . $variant->stock);
            }
            return $this->cartRepository->updateItemQuantity($existingItem->id, $newQty);
        }

        return $this->cartRepository->addItem([
            'cart_id' => $cart->id,
            'product_variant_id' => $productVariantId,
            'quantity' => $quantity,
        ]);
    }

    public function updateItemQuantity(string $itemId, int $quantity): \App\Models\CartItem
    {
        if ($quantity <= 0) {
            throw new BadRequestHttpException('Quantity must be greater than 0.');
        }

        return $this->cartRepository->updateItemQuantity($itemId, $quantity);
    }

    public function removeItem(string $itemId): bool
    {
        return $this->cartRepository->removeItem($itemId);
    }
}

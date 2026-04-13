<?php

namespace App\Services;

use App\Repositories\OrderRepository;
use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use App\Repositories\AffiliateRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class OrderService
{
    protected OrderRepository $orderRepository;
    protected CartRepository $cartRepository;
    protected ProductRepository $productRepository;
    protected AffiliateRepository $affiliateRepository;
    protected UserRepository $userRepository;
    protected \App\Repositories\ContentRepository $contentRepository;
    protected ProductService $productService;

    public function __construct(
        OrderRepository $orderRepository,
        CartRepository $cartRepository,
        ProductRepository $productRepository,
        AffiliateRepository $affiliateRepository,
        UserRepository $userRepository,
        \App\Repositories\ContentRepository $contentRepository,
        ProductService $productService
    ) {
        $this->orderRepository = $orderRepository;
        $this->cartRepository = $cartRepository;
        $this->productRepository = $productRepository;
        $this->affiliateRepository = $affiliateRepository;
        $this->userRepository = $userRepository;
        $this->contentRepository = $contentRepository;
        $this->productService = $productService;
    }

    /**
     * CRITICAL ORDER FLOW
     *
     * 1. Get cart items
     * 2. Validate stock
     * 3. Calculate total price
     * 4. Create order
     * 5. Insert order_items (snapshot price)
     * 6. Handle affiliate commission (if applicable)
     * 7. Decrement stock
     * 8. Award loyalty points
     * 9. Clear cart
     */
    public function createOrder(string $userId, array $data): \App\Models\Order
    {
        return DB::transaction(function () use ($userId, $data) {
            // 1. Get cart items
            $cart = $this->cartRepository->getActiveCart($userId);
            if (!$cart || $cart->items->isEmpty()) {
                throw new BadRequestHttpException('Cart is empty.');
            }

            $cartItems = $this->cartRepository->getCartItems($cart->id);

            // 2. Validate stock for each item
            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($cartItems as $item) {
                $variant = $this->productRepository->findVariant($item->product_variant_id);

                if (!$variant) {
                    throw new BadRequestHttpException("Product variant not found: {$item->product_variant_id}");
                }

                if ($variant->stock < $item->quantity) {
                    throw new BadRequestHttpException(
                        "Insufficient stock for '{$variant->name}'. Available: {$variant->stock}, Requested: {$item->quantity}"
                    );
                }

                // 3. Calculate total price (snapshot the current price)
                // Use ProductService to transform product and get effective flash sale price
                $transformedProduct = $this->productService->transformProductForFlashSale($variant->product);
                $effectiveVariant = collect($transformedProduct->variants)->firstWhere('id', $variant->id);
                
                $priceAtOrder = $effectiveVariant && isset($effectiveVariant->is_on_flash_sale) && $effectiveVariant->is_on_flash_sale
                    ? (float) $effectiveVariant->flash_sale_price 
                    : (float) $variant->price;

                $itemTotal = $priceAtOrder * $item->quantity;
                $totalPrice += $itemTotal;

                $orderItemsData[] = [
                    'product_variant_id' => $variant->id,
                    'quantity' => $item->quantity,
                    'price' => $priceAtOrder, // snapshot effective price (with flash sale discount if active)
                ];
            }

            // 4. Create order
            $shippingCost = $data['shipping_cost'] ?? 0;
            $discountAmount = 0;
            $couponId = null;

            if (!empty($data['coupon_code'])) {
                $coupon = \App\Models\Coupon::where('code', $data['coupon_code'])->first();
                if ($coupon && $coupon->isValid($totalPrice)) {
                    $couponId = $coupon->id;
                    $discountAmount = $coupon->calculateDiscount($totalPrice, $shippingCost);
                }
            }

            $finalTotalPrice = ($totalPrice + $shippingCost) - $discountAmount;

            $order = $this->orderRepository->createOrder([
                'user_id' => $userId,
                'address_id' => $data['address_id'],
                'affiliate_id' => $data['affiliate_id'] ?? null,
                'coupon_id' => $couponId,
                'total_price' => $finalTotalPrice,
                'discount_amount' => $discountAmount,
                'status' => 'unpaid',
                'payment_method' => $data['payment_method'] ?? null,
                'shipping_courier' => $data['shipping_courier'] ?? null,
                'shipping_service' => $data['shipping_service'] ?? null,
                'shipping_cost' => $shippingCost,
            ]);

            // 5. Insert order items
            foreach ($orderItemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                $this->orderRepository->createOrderItem($itemData);
            }

            // 6. Handle affiliate commission
            if (!empty($data['affiliate_id'])) {
                $this->handleAffiliateCommission($order, $data['affiliate_id'], $userId);
            }

            // 7. Decrement stock
            foreach ($orderItemsData as $itemData) {
                $updatedVariant = $this->productRepository->decrementStock($itemData['product_variant_id'], $itemData['quantity']);
                
                // If stock is low (<= 5), notify admins
                if ($updatedVariant->stock <= 5) {
                    $adminIds = $this->userRepository->getAdminIds();
                    foreach ($adminIds as $adminId) {
                        $this->contentRepository->createNotification([
                            'user_id' => $adminId,
                            'title' => '⚠️ Stok Produk Hampir Habis',
                            'message' => "Stok untuk varian '{$updatedVariant->name}' dari produk '{$updatedVariant->product->name}' tersisa {$updatedVariant->stock} unit.",
                        ]);
                    }
                }
            }

            // 8. Award loyalty points (1 point per 10,000 IDR spent)
            $pointsEarned = (int) floor($totalPrice / 10000);
            if ($pointsEarned > 0) {
                $this->userRepository->addPoints($userId, $pointsEarned, 'order_' . $order->id);
            }

            // 9. Clear cart
            $this->cartRepository->clearCart($cart->id);

            // Create initial shipment log
            $this->orderRepository->createShipmentLog([
                'order_id' => $order->id,
                'status' => 'order_created',
                'description' => 'Order has been created and awaiting payment.',
            ]);

            // Notify Admins about the new order
            $adminIds = $this->userRepository->getAdminIds();
            $customerName = \App\Models\User::find($userId)->name ?? 'Seseorang';
            foreach ($adminIds as $adminId) {
                $this->contentRepository->createNotification([
                    'user_id' => $adminId,
                    'title' => '📦 Ada Pesanan Baru',
                    'message' => "Pesanan #{$order->id} senilai Rp " . number_format($order->total_price, 0, ',', '.') . " baru saja dibuat oleh {$customerName}.",
                ]);
            }

            return $this->orderRepository->findWithRelations($order->id);
        });
    }

    private function handleAffiliateCommission(\App\Models\Order $order, string $affiliateId, string $userId): void
    {
        $affiliate = $this->affiliateRepository->find($affiliateId);
        if (!$affiliate || !$affiliate->is_active) {
            return;
        }

        // Calculate commission (using affiliate's commission_value as percentage)
        $commissionRate = $affiliate->commission_value / 100;
        $commissionAmount = $order->total_price * $commissionRate;

        // Create conversion record
        $this->affiliateRepository->createConversion([
            'affiliate_id' => $affiliateId,
            'user_id' => $userId,
            'order_id' => $order->id,
            'commission_amount' => $commissionAmount,
            'status' => 'pending',
        ]);

        // Update affiliate balance
        $this->affiliateRepository->updateBalance($affiliateId, $commissionAmount);

        // Handle parent affiliate commission (multi-tier: 50% of child commission)
        if ($affiliate->parent_affiliate_id) {
            $parentCommission = $commissionAmount * 0.5;
            $this->affiliateRepository->createConversion([
                'affiliate_id' => $affiliate->parent_affiliate_id,
                'user_id' => $userId,
                'order_id' => $order->id,
                'commission_amount' => $parentCommission,
                'status' => 'pending',
            ]);
            $this->affiliateRepository->updateBalance($affiliate->parent_affiliate_id, $parentCommission);
        }
    }

    public function getUserOrders(string $userId, int $perPage = 15)
    {
        return $this->orderRepository->getUserOrders($userId, $perPage);
    }

    public function getOrder(string $orderId)
    {
        return $this->orderRepository->findWithRelations($orderId);
    }

    public function updateOrderStatus(string $orderId, string $status)
    {
        $order = $this->orderRepository->findWithRelations($orderId);
        
        if ($status === 'cancelled' && $order->status !== 'cancelled') {
            // 1. Restore product stock (qty)
            foreach ($order->items as $item) {
                $this->productRepository->incrementStock($item->product_variant_id, $item->quantity);
            }
            
            // 2. Remove items completely so it's not recorded
            \App\Models\OrderItem::where('order_id', $orderId)->delete();

            // 3. Deduct points that were given during checkout
            $pointsEarned = (int) floor($order->total_price / 10000);
            if ($pointsEarned > 0) {
                $this->userRepository->addPoints($order->user_id, -$pointsEarned, 'Pembatalan Pesanan: ' . $order->id);
            }

            // 4. Void affiliate conversions
            $conversions = \App\Models\AffiliateConversion::where('order_id', $orderId)->where('status', 'pending')->get();
            foreach ($conversions as $conversion) {
                $this->affiliateRepository->deductBalance($conversion->affiliate_id, $conversion->commission_amount);
                $this->affiliateRepository->deductTotalEarnings($conversion->affiliate_id, $conversion->commission_amount);
                $conversion->update(['status' => 'rejected']);
            }
        }

        $updatedOrder = $this->orderRepository->updateOrderStatus($orderId, $status);

        // Create shipment log
        $descriptions = [
            'processing' => 'Payment confirmed. Order is being processed.',
            'shipping' => 'Order has been shipped.',
            'completed' => 'Order has been delivered and completed.',
            'cancelled' => 'Order has been cancelled.',
        ];

        if (isset($descriptions[$status])) {
            $this->orderRepository->createShipmentLog([
                'order_id' => $orderId,
                'status' => $status,
                'description' => $descriptions[$status],
            ]);
        }

        return $updatedOrder;
    }

    public function getShipmentLogs(string $orderId)
    {
        return $this->orderRepository->getShipmentLogs($orderId);
    }

    public function getAllOrders(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->orderRepository->getAllOrders($perPage, $search, $status);
    }

    public function getSoldItemHistory(int $perPage = 15, ?string $search = null)
    {
        return $this->orderRepository->getSoldItemHistory($perPage, $search);
    }
}

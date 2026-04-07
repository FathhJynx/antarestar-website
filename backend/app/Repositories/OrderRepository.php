<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShipmentLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository extends BaseRepository
{
    protected OrderItem $orderItemModel;
    protected ShipmentLog $shipmentLogModel;

    public function __construct(Order $model, OrderItem $orderItemModel, ShipmentLog $shipmentLogModel)
    {
        parent::__construct($model);
        $this->orderItemModel = $orderItemModel;
        $this->shipmentLogModel = $shipmentLogModel;
    }

    public function getUserOrders(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)
            ->with(['items.productVariant.product.primaryImage', 'address', 'shipmentLogs', 'reviews'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findWithRelations(string $id): ?Order
    {
        return $this->model->with([
            'items.productVariant.product.primaryImage',
            'address.province',
            'address.city',
            'shipmentLogs',
            'affiliate',
            'user',
            'reviews',
        ])->find($id);
    }

    public function createOrder(array $data): Order
    {
        return $this->model->create($data);
    }

    public function createOrderItem(array $data): OrderItem
    {
        return $this->orderItemModel->create($data);
    }

    public function updateOrderStatus(string $orderId, string $status): Order
    {
        $order = $this->model->findOrFail($orderId);
        $order->update(['status' => $status]);
        
        // Auto-create shipment log with location
        $location = ($status === 'processing' || $status === 'unpaid') ? 'Antarestar HQ (Tangerang)' : 'Transit Hub';
        
        $this->createShipmentLog([
            'order_id' => $orderId,
            'status' => $status,
            'description' => 'Admin updated order status to ' . strtoupper($status) . '.',
            'location' => $location
        ]);

        return $order->fresh();
    }

    // Shipment logs
    public function createShipmentLog(array $data): ShipmentLog
    {
        return $this->shipmentLogModel->create($data);
    }

    public function getShipmentLogs(string $orderId): Collection
    {
        return $this->shipmentLogModel->where('order_id', $orderId)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function getAllOrders(int $perPage = 15, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = $this->model->with(['user', 'items.productVariant.product.primaryImage', 'address.city']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getSoldItemHistory(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = $this->orderItemModel->with([
            'order.user', 
            'productVariant.product.primaryImage'
        ]);

        // Only show items from orders that are NOT cancelled
        $query->whereHas('order', function($q) {
            $q->where('status', '!=', 'cancelled');
        });

        if ($search) {
            $query->whereHas('productVariant.product', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}

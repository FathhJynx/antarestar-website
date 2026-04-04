<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends BaseController
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->getUserOrders($request->user()->id);
        return $this->success($orders, 'Order list.');
    }

    public function store(CreateOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->createOrder($request->user()->id, $request->validated());
        return $this->success($order, 'Order created successfully.', 201);
    }

    public function show(string $id): JsonResponse
    {
        $order = $this->orderService->getOrder($id);
        if (!$order) {
            return $this->error('Order not found.', 404);
        }
        return $this->success($order, 'Order detail.');
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $data = $request->validate(['status' => 'required|string']);
        $order = $this->orderService->updateOrderStatus($id, $data['status']);
        return $this->success($order, 'Order status updated.');
    }

    public function shipmentLogs(string $orderId): JsonResponse
    {
        $logs = $this->orderService->getShipmentLogs($orderId);
        return $this->success($logs, 'Shipment logs.');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $status = $request->input('status');
        $orders = $this->orderService->getAllOrders((int)$perPage, $search, $status);
        return $this->success($orders, 'Admin order list.');
    }

    public function soldProducts(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $items = $this->orderService->getSoldItemHistory((int)$perPage, $search);
        return $this->success($items, 'Sold products list.');
    }
}

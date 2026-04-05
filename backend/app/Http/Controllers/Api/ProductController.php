<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Product Catalog
 * 
 * Public endpoints for browsing categories and products with filtering support.
 */
class ProductController extends BaseController
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    // Categories
    public function categories(): JsonResponse
    {
        return $this->success($this->productService->getAllCategories(), 'Categories list.');
    }

    public function createCategory(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'image_url' => 'nullable|string|max:255',
        ]);
        
        $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
        
        return $this->success($this->productService->createCategory($data), 'Category created.', 201);
    }

    public function updateCategory(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'image_url' => 'nullable|string|max:255',
        ]);
        
        if (isset($data['name'])) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
        }
        
        return $this->success($this->productService->updateCategory($id, $data), 'Category updated.');
    }

    public function deleteCategory(string $id): JsonResponse
    {
        $this->productService->deleteCategory($id);
        return $this->success(null, 'Category deleted.');
    }

    // Products
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category_id', 'search', 'min_price', 'max_price', 'sort_by', 'sort_dir', 'per_page']);
        return $this->success($this->productService->getProducts($filters), 'Products list.');
    }

    public function show(string $id): JsonResponse
    {
        $product = $this->productService->getProduct($id);
        if (!$product) {
            return $this->error('Product not found.', 404);
        }
        return $this->success($product, 'Product detail.');
    }

    public function showBySlug(string $slug): JsonResponse
    {
        $product = $this->productService->getProductBySlug($slug);
        if (!$product) {
            return $this->error('Product not found.', 404);
        }
        return $this->success($product, 'Product detail.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|string|exists:categories,id',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required_with:variants|string|max:150',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.color_name' => 'nullable|string|max:50',
            'variants.*.color_code' => 'nullable|string|max:20',
            'variants.*.size' => 'nullable|string|max:20',
            'images' => 'nullable|array',
            'images.*.image_url' => 'required_with:images|string|max:255',
            'images.*.is_primary' => 'nullable|boolean',
        ]);

        return $this->success($this->productService->createProduct($data), 'Product created with variants.', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|string|exists:categories,id',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|string|exists:product_variants,id',
            'variants.*.name' => 'required_with:variants|string|max:150',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.color_name' => 'nullable|string|max:50',
            'variants.*.color_code' => 'nullable|string|max:20',
            'variants.*.size' => 'nullable|string|max:20',
            'images' => 'nullable|array',
            'images.*.id' => 'nullable|string|exists:product_images,id',
            'images.*.image_url' => 'required_with:images|string|max:255',
            'images.*.is_primary' => 'nullable|boolean',
        ]);

        return $this->success($this->productService->updateProduct($id, $data), 'Product updated.');
    }

    public function destroy(string $id): JsonResponse
    {
        $this->productService->deleteProduct($id);
        return $this->success(null, 'Product deleted.');
    }

    // Variants
    public function createVariant(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => 'required|string|exists:products,id',
            'name' => 'required|string|max:150',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        return $this->success($this->productService->createVariant($data), 'Variant created.', 201);
    }

    public function updateVariant(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:150',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
        ]);

        return $this->success($this->productService->updateVariant($id, $data), 'Variant updated.');
    }

    public function deleteVariant(string $id): JsonResponse
    {
        $this->productService->deleteVariant($id);
        return $this->success(null, 'Variant deleted.');
    }

    // Images
    public function addImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => 'required|string|exists:products,id',
            'image_url' => 'required|string|max:255',
            'is_primary' => 'nullable|boolean',
        ]);

        return $this->success($this->productService->addProductImage($data), 'Image added.', 201);
    }

    public function deleteImage(string $id): JsonResponse
    {
        $this->productService->deleteProductImage($id);
        return $this->success(null, 'Image deleted.');
    }

    public function similar(string $id): JsonResponse
    {
        return $this->success($this->productService->getSimilarProducts($id), 'Similar products list.');
    }
}

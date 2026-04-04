<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository
{
    protected Category $categoryModel;
    protected ProductVariant $variantModel;
    protected ProductImage $imageModel;

    public function __construct(
        Product $model,
        Category $categoryModel,
        ProductVariant $variantModel,
        ProductImage $imageModel
    ) {
        parent::__construct($model);
        $this->categoryModel = $categoryModel;
        $this->variantModel = $variantModel;
        $this->imageModel = $imageModel;
    }

    // Category methods
    public function allCategories(): Collection
    {
        return $this->categoryModel->withCount('products')->get();
    }

    public function findCategory(string $id): ?Category
    {
        return $this->categoryModel->find($id);
    }

    public function createCategory(array $data): Category
    {
        return $this->categoryModel->create($data);
    }

    public function updateCategory(string $id, array $data): Category
    {
        $cat = $this->categoryModel->findOrFail($id);
        $cat->update($data);
        return $cat->fresh();
    }

    public function deleteCategory(string $id): bool
    {
        return $this->categoryModel->findOrFail($id)->delete();
    }

    // Product methods
    public function getProductsFiltered(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with([
            'category', 
            'flashSaleProducts.flashSale' => function($q) {
                $q->where('is_active', true)
                  ->where('end_date', '>=', now());
            },
            'variants',
            'images',
            'reviews'
        ])
        ->withSum('orderItems as sold_count', 'quantity');

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['min_price']) || !empty($filters['max_price'])) {
            $query->whereHas('variants', function ($q) use ($filters) {
                if (!empty($filters['min_price'])) {
                    $q->where('price', '>=', $filters['min_price']);
                }
                if (!empty($filters['max_price'])) {
                    $q->where('price', '<=', $filters['max_price']);
                }
            });
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';

        if ($sortBy === 'popular') {
            $query->leftJoin('product_variants', 'products.id', '=', 'product_variants.product_id')
                  ->leftJoin('order_items', 'product_variants.id', '=', 'order_items.product_variant_id')
                  ->selectRaw('products.*, SUM(order_items.quantity) as total_sold')
                  ->groupBy('products.id')
                  ->orderBy('total_sold', 'desc');
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        return $query->paginate($perPage);
    }

    public function findProductWithRelations(string $id): ?Product
    {
        return $this->model->with([
            'category', 
            'flashSaleProducts.flashSale' => function($q) {
                $q->where('is_active', true)
                  ->where('end_date', '>=', now());
            },
            'variants',
            'images', 
            'reviews.user', 
            'reviews.order.items.productVariant'
        ])
        ->withSum('orderItems as sold_count', 'quantity')
        ->find($id);
    }

    public function findProductBySlug(string $slug): ?Product
    {
        return $this->model->with([
            'category', 
            'flashSaleProducts.flashSale' => function($q) {
                $q->where('is_active', true)
                  ->where('end_date', '>=', now());
            },
            'variants',
            'images', 
            'reviews.user', 
            'reviews.order.items.productVariant'
        ])
        ->withSum('orderItems as sold_count', 'quantity')
        ->where('slug', $slug)->first();
    }

    public function getSimilarProducts(string $productId, int $limit = 6): Collection
    {
        $product = $this->model->find($productId);
        if (!$product) {
            return new Collection();
        }

        return $this->model->with(['category', 'variants', 'images', 'reviews'])
            ->withSum('orderItems as sold_count', 'quantity')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $productId)
            ->limit($limit)
            ->get();
    }

    // Variant methods
    public function findVariant(string $id): ?ProductVariant
    {
        return $this->variantModel->with('product')->find($id);
    }

    public function createVariant(array $data): ProductVariant
    {
        return $this->variantModel->create($data);
    }

    public function updateVariant(string $id, array $data): ProductVariant
    {
        $variant = $this->variantModel->findOrFail($id);
        $variant->update($data);
        return $variant->fresh();
    }

    public function deleteVariant(string $id): bool
    {
        return $this->variantModel->findOrFail($id)->delete();
    }

    public function decrementStock(string $variantId, int $quantity): ProductVariant
    {
        $variant = $this->variantModel->findOrFail($variantId);
        $variant->decrement('stock', $quantity);
        return $variant->fresh(['product']);
    }

    public function incrementStock(string $variantId, int $quantity): ProductVariant
    {
        $variant = $this->variantModel->findOrFail($variantId);
        $variant->increment('stock', $quantity);
        return $variant->fresh(['product']);
    }

    // Image methods
    public function createImage(array $data): ProductImage
    {
        return $this->imageModel->create($data);
    }

    public function deleteImage(string $id): bool
    {
        return $this->imageModel->findOrFail($id)->delete();
    }

    public function resetPrimaryImage(string $productId): void
    {
        $this->imageModel->where('product_id', $productId)->update(['is_primary' => false]);
    }
}

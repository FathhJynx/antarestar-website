<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Support\Str;

class ProductService
{
    protected ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    // Categories
    public function getAllCategories()
    {
        return $this->productRepository->allCategories();
    }

    public function createCategory(array $data)
    {
        $data['slug'] = Str::slug($data['name']);
        return $this->productRepository->createCategory($data);
    }

    public function updateCategory(string $id, array $data)
    {
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        return $this->productRepository->updateCategory($id, $data);
    }

    public function deleteCategory(string $id)
    {
        return $this->productRepository->deleteCategory($id);
    }

    // Products
    public function getProducts(array $filters)
    {
        $perPage = $filters['per_page'] ?? 15;
        $products = $this->productRepository->getProductsFiltered($filters, $perPage);
        
        $products->getCollection()->transform(function($product) {
            return $this->transformProductForFlashSale($product);
        });
        
        return $products;
    }

    public function getProduct(string $id)
    {
        $product = $this->productRepository->findProductWithRelations($id);
        if ($product) {
            return $this->transformProductForFlashSale($product);
        }
        return null;
    }

    public function getProductBySlug(string $slug)
    {
        $product = $this->productRepository->findProductBySlug($slug);
        if ($product) {
            return $this->transformProductForFlashSale($product);
        }
        return null;
    }

    public function transformProductForFlashSale($product)
    {
        $activeFlashSaleProduct = $product->flashSaleProducts->first(function($fsp) {
            return $fsp->flashSale && $fsp->flashSale->is_active && new \DateTime($fsp->flashSale->end_date) >= new \DateTime();
        });

        foreach ($product->variants as $variant) {
            if ($activeFlashSaleProduct) {
                $variant->is_on_flash_sale = true;
                
                // Calculate discounted price based on type
                if ($activeFlashSaleProduct->discount_type === 'percentage') {
                    $discountValue = (float) $activeFlashSaleProduct->discount_value;
                    $variant->flash_sale_price = $variant->price * (1 - $discountValue / 100);
                } else {
                    $variant->flash_sale_price = max(0, $variant->price - (float) $activeFlashSaleProduct->discount_value);
                }

                $variant->flash_sale_details = [
                    'id' => $activeFlashSaleProduct->flashSale->id,
                    'name' => $activeFlashSaleProduct->flashSale->name,
                    'end_date' => $activeFlashSaleProduct->flashSale->end_date,
                    'start_date' => $activeFlashSaleProduct->flashSale->start_date,
                    'discount_type' => $activeFlashSaleProduct->discount_type,
                    'discount_value' => $activeFlashSaleProduct->discount_value,
                ];
            } else {
                $variant->is_on_flash_sale = false;
                $variant->flash_sale_price = null;
            }
        }
        return $product;
    }

    public function createProduct(array $data)
    {
        $variants = $data['variants'] ?? [];
        $images = $data['images'] ?? [];
        unset($data['variants'], $data['images']);

        $data['slug'] = Str::slug($data['name']);
        $product = $this->productRepository->create($data);

        // Handle variants
        foreach ($variants as $variant) {
            $variant['product_id'] = $product->id;
            $this->productRepository->createVariant($variant);
        }

        // Handle images
        foreach ($images as $image) {
            $image['product_id'] = $product->id;
            $this->productRepository->createImage($image);
        }

        return $product->fresh(['category', 'variants', 'images']);
    }

    public function updateProduct(string $id, array $data)
    {
        $variants = $data['variants'] ?? null;
        $images = $data['images'] ?? null;
        unset($data['variants'], $data['images']);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $product = $this->productRepository->update($id, $data);

        // Handle variants if provided
        if ($variants !== null) {
            $existingVariantIds = $product->variants->pluck('id')->toArray();
            $newVariantIds = array_filter(array_map(fn($v) => $v['id'] ?? null, $variants));
            
            // Delete variants removed in UI
            $toDelete = array_diff($existingVariantIds, $newVariantIds);
            foreach ($toDelete as $vId) {
                $this->productRepository->deleteVariant($vId);
            }

            foreach ($variants as $vData) {
                if (isset($vData['id'])) {
                    $vId = $vData['id'];
                    unset($vData['id']);
                    $this->productRepository->updateVariant($vId, $vData);
                } else {
                    $vData['product_id'] = $id;
                    $this->productRepository->createVariant($vData);
                }
            }
        }

        // Handle images if provided
        if ($images !== null) {
            $existingImageIds = $product->images->pluck('id')->toArray();
            $newImageIds = array_filter(array_map(fn($img) => $img['id'] ?? null, $images));

            // Delete images removed in UI
            $toDeleteImg = array_diff($existingImageIds, $newImageIds);
            foreach ($toDeleteImg as $imgId) {
                $this->productRepository->deleteImage($imgId);
            }

            foreach ($images as $imgData) {
                if (isset($imgData['id'])) {
                    $imgId = $imgData['id'];
                    unset($imgData['id']);
                } else {
                    $imgData['product_id'] = $id;
                    if (!empty($imgData['is_primary'])) {
                        $this->productRepository->resetPrimaryImage($id);
                    }
                    $this->productRepository->createImage($imgData);
                }
            }
        }

        return $product->fresh(['category', 'variants', 'images']);
    }

    public function deleteProduct(string $id)
    {
        return $this->productRepository->delete($id);
    }

    // Variants
    public function createVariant(array $data)
    {
        return $this->productRepository->createVariant($data);
    }

    public function updateVariant(string $id, array $data)
    {
        return $this->productRepository->updateVariant($id, $data);
    }

    public function deleteVariant(string $id)
    {
        return $this->productRepository->deleteVariant($id);
    }

    // Images
    public function addProductImage(array $data)
    {
        if (!empty($data['is_primary'])) {
            $this->productRepository->resetPrimaryImage($data['product_id']);
        }
        return $this->productRepository->createImage($data);
    }

    public function deleteProductImage(string $id)
    {
        return $this->productRepository->deleteImage($id);
    }
}

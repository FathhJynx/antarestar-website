<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Truncate table to avoid foreign key violations with existing inconsistent data
        DB::table('flash_sale_products')->truncate();

        Schema::table('flash_sale_products', function (Blueprint $table) {
            // Drop foreign key first
            if (Schema::hasColumn('flash_sale_products', 'product_variant_id')) {
                $table->dropForeign(['product_variant_id']);
                $table->dropColumn('product_variant_id');
            }
            if (Schema::hasColumn('flash_sale_products', 'sale_price')) {
                $table->dropColumn('sale_price');
            }

            // Add new columns
            $table->uuid('product_id')->after('flash_sale_id');
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage')->after('product_id');
            $table->decimal('discount_value', 15, 2)->after('discount_type');

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn(['product_id', 'discount_type', 'discount_value']);
            
            $table->uuid('product_variant_id')->after('flash_sale_id');
            $table->decimal('sale_price', 15, 2)->after('product_variant_id');
            $table->foreign('product_variant_id')->references('id')->on('product_variants')->onDelete('cascade');
        });
    }
};

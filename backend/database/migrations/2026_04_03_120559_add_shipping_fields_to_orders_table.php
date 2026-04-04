<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_courier', 50)->nullable()->after('payment_method');
            $table->string('shipping_service', 50)->nullable()->after('shipping_courier');
            $table->decimal('shipping_cost', 10, 2)->default(0)->after('shipping_service');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['shipping_courier', 'shipping_service', 'shipping_cost']);
        });
    }
};

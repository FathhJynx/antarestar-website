<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliate_clicks', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('affiliate_id', 36);
            $table->string('ip_address', 50)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->foreign('affiliate_id')->references('id')->on('affiliates')->onDelete('cascade');
            $table->index('affiliate_id');
        });

        Schema::create('affiliate_conversions', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('affiliate_id', 36);
            $table->char('user_id', 36);
            $table->char('order_id', 36);
            $table->decimal('commission_amount', 10, 2);
            $table->string('status', 50)->default('pending');
            $table->timestamps();

            $table->foreign('affiliate_id')->references('id')->on('affiliates')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->index('affiliate_id');
            $table->index('user_id');
            $table->index('order_id');
        });

        Schema::create('affiliate_payouts', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('affiliate_id', 36);
            $table->decimal('amount', 10, 2);
            $table->string('status', 50)->default('pending');
            $table->string('bank_name', 100)->nullable();
            $table->string('account_number', 50)->nullable();
            $table->string('account_name', 100)->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->foreign('affiliate_id')->references('id')->on('affiliates')->onDelete('cascade');
            $table->index('affiliate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliate_payouts');
        Schema::dropIfExists('affiliate_conversions');
        Schema::dropIfExists('affiliate_clicks');
    }
};

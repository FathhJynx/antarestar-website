<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliates', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('user_id', 36);
            $table->string('code', 50)->unique();
            $table->char('parent_affiliate_id', 36)->nullable();
            $table->decimal('commission_value', 10, 2)->default(0);
            $table->decimal('balance', 10, 2)->default(0);
            $table->decimal('total_earnings', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('parent_affiliate_id')->references('id')->on('affiliates')->onDelete('set null');
            $table->index('user_id');
            $table->index('parent_affiliate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliates');
    }
};

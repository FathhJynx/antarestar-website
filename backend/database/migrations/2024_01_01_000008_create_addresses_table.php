<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('user_id', 36);
            $table->char('province_id', 36);
            $table->char('city_id', 36);
            $table->string('recipient_name', 100);
            $table->string('phone', 20);
            $table->text('address');
            $table->string('postal_code', 10);
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('province_id')->references('id')->on('provinces')->onDelete('cascade');
            $table->foreign('city_id')->references('id')->on('cities')->onDelete('cascade');
            $table->index('user_id');
            $table->index('province_id');
            $table->index('city_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};

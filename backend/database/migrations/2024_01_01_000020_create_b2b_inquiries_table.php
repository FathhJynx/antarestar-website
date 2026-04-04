<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('b2b_inquiries', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('company_name', 150);
            $table->string('contact_name', 100);
            $table->string('email', 100);
            $table->string('phone', 20)->nullable();
            $table->text('message');
            $table->string('status', 50)->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('b2b_inquiries');
    }
};

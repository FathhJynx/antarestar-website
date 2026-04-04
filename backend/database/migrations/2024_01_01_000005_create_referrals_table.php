<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referrals', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('referrer_user_id', 36);
            $table->char('referred_user_id', 36);
            $table->string('referral_code', 50);
            $table->timestamps();

            $table->foreign('referrer_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('referred_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('referrer_user_id');
            $table->index('referred_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};

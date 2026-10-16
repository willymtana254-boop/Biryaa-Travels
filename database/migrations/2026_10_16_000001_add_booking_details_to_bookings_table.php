<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->time('pickup_time')->nullable();
            $table->string('pickup_address')->nullable();
            $table->string('flight_or_train_number', 30)->nullable();
            $table->boolean('with_driver')->default(false);
            $table->json('extras')->nullable();
            $table->json('price_breakdown')->nullable();
            $table->decimal('exchange_rate', 10, 4)->nullable(); // rate at booking time, for M-Pesa later
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['pickup_time', 'pickup_address', 'flight_or_train_number', 'with_driver', 'extras', 'price_breakdown', 'exchange_rate']);
        });
    }
};
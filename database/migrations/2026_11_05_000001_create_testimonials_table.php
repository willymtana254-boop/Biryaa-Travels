<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80);
            $table->string('location', 80)->nullable();      // e.g. "Nairobi" or "London, UK"
            $table->string('service', 20)->nullable();       // car_hire | transfer | accommodation | experience
            $table->unsignedTinyInteger('rating');           // 1-5
            $table->text('message');
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('verified')->default(false);     // true when the booking reference + email matched
            $table->string('source', 12)->default('website'); // website | manual (added by admin with the guest's permission)
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_featured')->default(false);  // shown on the home page
            $table->timestamps();

            $table->index(['is_approved', 'is_featured']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};

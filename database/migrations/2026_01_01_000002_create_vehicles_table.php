<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('category', ['economy', 'midsize', 'suv', 'executive', 'van', 'bus']);
            $table->unsignedTinyInteger('seats');
            $table->enum('transmission', ['manual', 'automatic'])->default('manual');
            $table->decimal('price_per_day', 10, 2);
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};

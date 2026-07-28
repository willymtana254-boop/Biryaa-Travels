<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('villas', function (Blueprint $table) {
            $table->string('contact_name')->nullable()->after('description');
            $table->string('contact_phone')->nullable()->after('contact_name');
            $table->decimal('commission_rate', 5, 2)->default(15.00)->after('contact_phone');
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->morphs('notifiable'); // Driver or Villa
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('purpose', ['driver_job_assigned', 'villa_commission_due']);
            $table->string('phone');
            $table->text('message');
            $table->enum('status', ['pending', 'sent'])->default('pending');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::table('villas', function (Blueprint $table) {
            $table->dropColumn(['contact_name', 'contact_phone', 'commission_rate']);
        });
    }
};
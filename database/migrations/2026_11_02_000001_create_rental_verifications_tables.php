<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained()->cascadeOnDelete();

            // incomplete | pending | approved | rejected
            $table->string('status', 20)->default('incomplete');

            // Sensitive text, stored encrypted (so these are text columns).
            $table->string('full_name')->nullable();
            $table->string('id_type', 20)->nullable(); // national_id | passport
            $table->text('id_number')->nullable();
            $table->text('address_line')->nullable();
            $table->string('town')->nullable();
            $table->string('country')->nullable();
            $table->text('licence_number')->nullable();
            $table->date('licence_expiry')->nullable();

            // Contact verification
            $table->string('phone', 30)->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('phone_verified_by', 10)->nullable(); // sms | staff
            $table->string('otp_hash')->nullable();
            $table->timestamp('otp_sent_at')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->unsignedTinyInteger('otp_attempts')->default(0);

            // Consent, selfie and review trail
            $table->timestamp('consent_at')->nullable();
            $table->string('consent_ip', 45)->nullable();
            $table->timestamp('selfie_taken_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->text('reviewer_note')->nullable();

            // Documents are deleted automatically after this date.
            $table->date('purge_after')->nullable();

            $table->timestamps();
        });

        Schema::create('verification_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_verification_id')->constrained()->cascadeOnDelete();
            // id_front | id_back | licence_front | licence_back | selfie
            $table->string('kind', 20);
            $table->string('mime', 40)->default('image/jpeg');
            $table->longText('data'); // encrypted base64 JPEG
            $table->timestamps();

            $table->unique(['rental_verification_id', 'kind']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_documents');
        Schema::dropIfExists('rental_verifications');
    }
};

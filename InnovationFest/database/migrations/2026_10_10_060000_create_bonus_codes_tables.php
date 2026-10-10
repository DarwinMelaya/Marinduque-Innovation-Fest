<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bonus_code_batches', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->unsignedInteger('points');
            $table->timestamps();
        });

        Schema::create('bonus_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bonus_code_batch_id')->constrained()->cascadeOnDelete();
            $table->string('code', 32)->unique();
            $table->foreignId('participant_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('redeemed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bonus_codes');
        Schema::dropIfExists('bonus_code_batches');
    }
};

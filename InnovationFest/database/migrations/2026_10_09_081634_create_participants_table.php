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
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->unsignedTinyInteger('age');
            $table->string('sex', 10);
            $table->boolean('is_pwd')->default(false);
            $table->boolean('is_indigenous')->default(false);
            $table->boolean('is_senior_citizen')->default(false);
            $table->boolean('is_4ps_member')->default(false);
            $table->string('agency')->nullable();
            $table->string('organization')->nullable();
            $table->string('contact_number', 20);
            $table->string('email')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};

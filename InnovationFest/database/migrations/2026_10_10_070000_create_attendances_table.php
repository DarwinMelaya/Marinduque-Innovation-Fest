<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->cascadeOnDelete();
            $table->date('attended_on');
            $table->timestamps();

            $table->unique(['participant_id', 'attended_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

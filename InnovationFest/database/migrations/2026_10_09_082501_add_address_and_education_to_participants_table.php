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
        Schema::table('participants', function (Blueprint $table) {
            $table->string('municipality')->after('is_4ps_member');
            $table->string('barangay')->after('municipality');
            $table->string('education_level')->nullable()->after('barangay');
            $table->string('school')->nullable()->after('education_level');
            $table->string('course')->nullable()->after('school');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropColumn(['municipality', 'barangay', 'education_level', 'school', 'course']);
        });
    }
};

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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedSmallInteger('scan_points')->default(0)->after('booth_name');
        });

        Schema::table('booth_visits', function (Blueprint $table) {
            $table->unsignedSmallInteger('points')->default(0)->after('visited_on');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booth_visits', function (Blueprint $table) {
            $table->dropColumn('points');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('scan_points');
        });
    }
};

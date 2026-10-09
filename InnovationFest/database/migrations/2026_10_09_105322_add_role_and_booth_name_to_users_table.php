<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('booth_name', 100)->nullable()->unique()->after('name');
            $table->string('email')->nullable()->change();
            $table->string('role')->nullable()->after('password');
        });

        DB::table('users')->where('is_admin', true)->update(['role' => 'admin']);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('password');
        });

        DB::table('users')->where('role', 'admin')->update(['is_admin' => true]);
        DB::table('users')->whereNull('email')->delete();

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['booth_name']);
            $table->dropColumn(['booth_name', 'role']);
            $table->string('email')->nullable(false)->change();
        });
    }
};

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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url', 2048);
            $table->string('location', 20)->default('header');
            $table->foreignId('parent_id')->nullable()->constrained('menu_items')->nullOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            $table->index(['location', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};

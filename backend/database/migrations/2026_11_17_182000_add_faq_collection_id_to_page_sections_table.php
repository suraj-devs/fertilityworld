<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('page_sections', function (Blueprint $table) {
            $table->foreignId('faq_collection_id')
                ->nullable()
                ->constrained()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('page_sections', function (Blueprint $table) {
            $table->dropConstrainedForeignId('faq_collection_id');
        });
    }
};

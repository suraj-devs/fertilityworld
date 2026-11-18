<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('slug', 180)->unique();
            $table->string('category', 120)->nullable();
            $table->text('excerpt')->nullable();
            $table->string('cover_image', 2048)->nullable();
            $table->string('cover_image_alt', 255)->nullable();
            $table->string('author', 120)->default('Nius We Care');
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 500)->nullable();
            $table->longText('content');
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['is_published', 'published_at']);
        });

        $successPage = DB::table('pages')->where('slug', 'success')->first();
        if ($successPage) {
            DB::table('page_sections')->where('page_id', $successPage->id)->delete();
            DB::table('pages')->where('id', $successPage->id)->delete();
        }

        $successMenu = DB::table('menu_items')
            ->where('location', 'header')
            ->where(function ($query): void {
                $query->where('url', '/success')
                    ->orWhere('url', '/success.html')
                    ->orWhere('label', 'Success');
            })
            ->orderBy('id')
            ->first();

        if ($successMenu) {
            DB::table('menu_items')->where('parent_id', $successMenu->id)->delete();
            DB::table('menu_items')->where('id', $successMenu->id)->update([
                'label' => 'Blog',
                'url' => '/blog',
                'updated_at' => now(),
            ]);
        }

        $homePage = DB::table('pages')->where('slug', 'home')->first();
        if ($homePage) {
            $homeSection = DB::table('page_sections')
                ->where('page_id', $homePage->id)
                ->where('heading', 'Welcome to your circle of care.')
                ->first();

            if ($homeSection) {
                DB::table('page_sections')->where('id', $homeSection->id)->update([
                    'heading' => 'Latest from our blog',
                    'type' => 'blog_posts',
                    'content' => json_encode([
                        'eyebrow' => 'Helpful advice and clinic news',
                        'title' => 'Latest from our blog',
                        'intro' => 'Explore clear, supportive guidance from our fertility care team.',
                        'post_count' => 3,
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicBlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:12'],
            'category' => ['sometimes', 'string', 'max:120'],
            'search' => ['sometimes', 'string', 'max:120'],
        ]);

        $query = BlogPost::query()
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->orderByDesc('id');

        if (! empty($validated['category'])) {
            $query->where('category', $validated['category']);
        }

        if (! empty($validated['search'])) {
            $search = trim($validated['search']);
            $query->where(function ($posts) use ($search): void {
                $posts->where('title', 'like', '%'.$search.'%')
                    ->orWhere('excerpt', 'like', '%'.$search.'%');
            });
        }

        $posts = $query
            ->select(['id', 'title', 'slug', 'category', 'excerpt', 'cover_image', 'cover_image_alt', 'author', 'published_at'])
            ->paginate($validated['per_page'] ?? 9);

        return response()->json([
            'posts' => $posts,
            'categories' => BlogPost::query()
                ->where('is_published', true)
                ->whereNotNull('category')
                ->where('category', '<>', '')
                ->distinct()
                ->orderBy('category')
                ->pluck('category'),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $recentPosts = BlogPost::query()
            ->where('is_published', true)
            ->where('id', '<>', $post->id)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'category', 'cover_image', 'cover_image_alt', 'published_at']);

        return response()->json([
            'post' => $post,
            'recent_posts' => $recentPosts,
        ]);
    }
}

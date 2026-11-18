<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class BlogPostController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'posts' => BlogPost::query()->orderByDesc('updated_at')->paginate(20),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePost($request);
        $post = BlogPost::create($this->publishedData($validated));

        return response()->json(['post' => $post], 201);
    }

    public function show(BlogPost $blogPost): JsonResponse
    {
        return response()->json(['post' => $blogPost]);
    }

    public function update(Request $request, BlogPost $blogPost): JsonResponse
    {
        $validated = $this->validatePost($request, $blogPost);
        $blogPost->update($this->publishedData($validated, $blogPost));

        return response()->json(['post' => $blogPost->refresh()]);
    }

    public function destroy(BlogPost $blogPost): JsonResponse
    {
        $blogPost->delete();

        return response()->json(['message' => 'Blog post deleted.']);
    }

    private function validatePost(Request $request, ?BlogPost $post = null): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'slug' => [
                'required',
                'string',
                'max:180',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('blog_posts', 'slug')->ignore($post?->id),
            ],
            'category' => ['nullable', 'string', 'max:120'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'cover_image' => ['nullable', 'string', 'max:2048', 'regex:/^(\/(?!\/)|https?:\/\/)/i'],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:120'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'array', 'min:1', 'max:100'],
            'content.*.type' => ['required', 'in:paragraph,heading,list,quote,image,faq'],
            'content.*.text' => ['nullable', 'string', 'max:10000'],
            'content.*.items' => ['nullable', 'array', 'max:100'],
            'content.*.items.*' => ['string', 'max:1000'],
            'content.*.url' => ['nullable', 'string', 'max:2048', 'regex:/^(\/(?!\/)|https?:\/\/)/i'],
            'content.*.alt' => ['nullable', 'string', 'max:255'],
            'content.*.caption' => ['nullable', 'string', 'max:500'],
            'content.*.title' => ['nullable', 'string', 'max:180'],
            'content.*.faqs' => ['nullable', 'array', 'max:30'],
            'content.*.faqs.*.question' => ['nullable', 'string', 'max:255'],
            'content.*.faqs.*.answer' => ['nullable', 'string', 'max:3000'],
            'is_published' => ['required', 'boolean'],
        ]);

        foreach ($validated['content'] as $index => $block) {
            if ($block['type'] === 'image' && blank($block['url'] ?? null)) {
                throw ValidationException::withMessages([
                    "content.{$index}.url" => ['Add an image before saving this block.'],
                ]);
            }

            if ($block['type'] === 'list' && empty(array_filter($block['items'] ?? []))) {
                throw ValidationException::withMessages([
                    "content.{$index}.items" => ['Add at least one list item.'],
                ]);
            }

            if ($block['type'] === 'faq') {
                if (empty($block['faqs'])) {
                    throw ValidationException::withMessages([
                        "content.{$index}.faqs" => ['Add at least one FAQ question and answer.'],
                    ]);
                }

                foreach ($block['faqs'] as $faqIndex => $faq) {
                    if (blank($faq['question'] ?? null) || blank($faq['answer'] ?? null)) {
                        throw ValidationException::withMessages([
                            "content.{$index}.faqs.{$faqIndex}" => ['Each FAQ needs both a question and an answer.'],
                        ]);
                    }
                }

                continue;
            }

            if (! in_array($block['type'], ['image', 'list'], true) && blank($block['text'] ?? null)) {
                throw ValidationException::withMessages([
                    "content.{$index}.text" => ['Add text to this content block.'],
                ]);
            }
        }

        return $validated;
    }

    private function publishedData(array $validated, ?BlogPost $post = null): array
    {
        $validated['category'] = blank($validated['category'] ?? null) ? null : trim($validated['category']);
        $validated['published_at'] = $validated['is_published']
            ? ($post?->published_at ?? now())
            : null;

        return $validated;
    }
}

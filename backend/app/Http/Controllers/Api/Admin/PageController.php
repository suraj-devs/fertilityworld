<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'pages' => Page::with('sections')->orderBy('title')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePage($request);

        $page = DB::transaction(function () use ($validated): Page {
            $page = Page::create(Arr::only($validated, [
                'title',
                'slug',
                'seo_title',
                'seo_description',
                'custom_head_code',
                'custom_footer_code',
                'custom_css',
                'is_published',
            ]));

            $this->syncSections($page, $validated['sections'] ?? []);

            return $page->load('sections');
        });

        return response()->json(['page' => $page], 201);
    }

    public function show(Page $page): JsonResponse
    {
        return response()->json(['page' => $page->load('sections')]);
    }

    public function update(Request $request, Page $page): JsonResponse
    {
        $validated = $this->validatePage($request, $page);

        $page = DB::transaction(function () use ($page, $validated): Page {
            $page->update(Arr::only($validated, [
                'title',
                'slug',
                'seo_title',
                'seo_description',
                'custom_head_code',
                'custom_footer_code',
                'custom_css',
                'is_published',
            ]));

            if (array_key_exists('sections', $validated)) {
                $this->syncSections($page, $validated['sections']);
            }

            return $page->load('sections');
        });

        return response()->json(['page' => $page]);
    }

    public function destroy(Page $page): JsonResponse
    {
        $page->delete();

        return response()->json(['message' => 'Page deleted.']);
    }

    private function validatePage(Request $request, ?Page $page = null): array
    {
        $slugRule = 'unique:pages,slug';
        if ($page) {
            $slugRule .= ','.$page->id;
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'slug' => [
                'required',
                'string',
                'max:160',
                'regex:/^[a-z0-9]+(?:[\/-][a-z0-9]+)*$/',
                $slugRule,
                function (string $attribute, string $value, \Closure $fail): void {
                    if (preg_match('/^(blog|success)(?:\/|$)/', $value)) {
                        $fail('This URL is reserved for the blog and its legacy redirects.');
                    }
                },
            ],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'custom_head_code' => ['nullable', 'string', 'max:500000'],
            'custom_footer_code' => ['nullable', 'string', 'max:500000'],
            'custom_css' => ['nullable', 'string', 'max:500000'],
            'is_published' => ['required', 'boolean'],
            'sections' => ['sometimes', 'array', 'max:100'],
            'sections.*.id' => ['nullable', 'integer'],
            'sections.*.heading' => ['nullable', 'string', 'max:180'],
            'sections.*.type' => ['required', 'in:html,hero,service_pages,text,image_text,cards,faq,faq_collection,cta,contact_profile,lead_form,blog_posts'],
            'sections.*.faq_collection_id' => ['nullable', 'integer', 'exists:faq_collections,id'],
            'sections.*.content' => [
                'required',
                'string',
                'max:500000',
                function (string $attribute, string $value, \Closure $fail) use ($request): void {
                    $parts = explode('.', $attribute);
                    $index = $parts[1] ?? null;
                    $type = $index === null ? 'html' : $request->input("sections.{$index}.type");

                    if ($type === 'html') {
                        return;
                    }

                    $content = json_decode($value, true);
                    if (json_last_error() !== JSON_ERROR_NONE || ! is_array($content) || array_is_list($content)) {
                        $fail('Structured section content must be a JSON object.');
                    }
                },
            ],
            'sections.*.is_visible' => ['required', 'boolean'],
        ]);

        $faqCollectionIds = [];
        foreach ($validated['sections'] ?? [] as $index => $section) {
            if ($section['type'] === 'faq_collection' && empty($section['faq_collection_id'])) {
                throw ValidationException::withMessages([
                    "sections.{$index}.faq_collection_id" => ['Choose an FAQ module for this page section.'],
                ]);
            }

            if ($section['type'] === 'faq_collection' && in_array($section['faq_collection_id'], $faqCollectionIds, true)) {
                throw ValidationException::withMessages([
                    "sections.{$index}.faq_collection_id" => ['An FAQ module can only be added once to a page.'],
                ]);
            }

            if ($section['type'] === 'faq_collection') {
                $faqCollectionIds[] = $section['faq_collection_id'];
            }
        }

        return $validated;
    }

    private function syncSections(Page $page, array $sections): void
    {
        $keptIds = [];

        foreach ($sections as $position => $data) {
            if (! empty($data['id'])) {
                $section = $page->sections()->whereKey($data['id'])->firstOrFail();
            } else {
                $section = $page->sections()->make();
            }

            $section->fill(Arr::only($data, ['heading', 'type', 'content', 'faq_collection_id', 'is_visible']));
            if ($data['type'] !== 'faq_collection') {
                $section->faq_collection_id = null;
            }
            $section->position = $position;
            $section->save();
            $keptIds[] = $section->id;
        }

        $page->sections()->whereNotIn('id', $keptIds)->delete();
    }
}

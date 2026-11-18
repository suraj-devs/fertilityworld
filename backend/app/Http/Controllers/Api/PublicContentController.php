<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactLead;
use App\Models\MenuItem;
use App\Models\NewsletterSubscriber;
use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicContentController extends Controller
{
    public function page(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:160'],
        ]);

        $page = Page::query()
            ->where('slug', $validated['slug'])
            ->where('is_published', true)
            ->with([
                'sections' => fn ($query) => $query->where('is_visible', true),
                'sections.faqCollection' => fn ($query) => $query
                    ->where('is_published', true)
                    ->select(['id', 'title', 'intro', 'items']),
            ])
            ->firstOrFail();

        return response()->json(['page' => $page]);
    }

    public function services(): JsonResponse
    {
        $services = Page::query()
            ->where('slug', 'like', 'services/%')
            ->where('is_published', true)
            ->with([
                'sections' => fn ($query) => $query
                    ->where('is_visible', true)
                    ->whereIn('type', ['hero', 'image_text']),
            ])
            ->orderBy('title')
            ->get(['id', 'title', 'slug', 'seo_description'])
            ->map(function (Page $page): array {
                $heroData = [];
                $imageData = [];

                foreach ($page->sections as $section) {
                    $data = json_decode($section->content, true);
                    if (! is_array($data)) {
                        continue;
                    }

                    if ($section->type === 'hero' && $heroData === []) {
                        $heroData = $data;
                    }
                    if (! empty($data['image_url']) && $imageData === []) {
                        $imageData = $data;
                    }
                }

                $imageUrl = $imageData['image_url'] ?? null;
                if (! is_string($imageUrl) || ! preg_match('/^(https?:\/\/|\/(?!\/))/i', $imageUrl)) {
                    $imageUrl = null;
                }
                $title = $heroData['title'] ?? null;
                $description = $heroData['body'] ?? null;
                $imageAlt = $imageData['image_alt'] ?? null;

                return [
                    'id' => $page->id,
                    'title' => (is_string($title) ? trim($title) : '') ?: $page->title,
                    'slug' => $page->slug,
                    'description' => (is_string($description) ? trim($description) : '') ?: ($page->seo_description ?? ''),
                    'image_url' => $imageUrl,
                    'image_alt' => is_string($imageAlt) ? $imageAlt : $page->title,
                ];
            })
            ->values();

        return response()->json(['services' => $services]);
    }

    public function menu(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'location' => ['required', 'in:header,footer'],
        ]);

        $items = MenuItem::query()
            ->where('location', $validated['location'])
            ->where('is_visible', true)
            ->orderBy('position')
            ->orderBy('id')
            ->get();

        return response()->json(['items' => $items]);
    }

    public function settings(): JsonResponse
    {
        return response()->json([
            'settings' => SiteSetting::query()
                ->whereIn('key', [
                    'site_name',
                    'logo_url',
                    'topbar_text',
                    'phone_number',
                    'phone_link',
                    'appointment_label',
                    'appointment_url',
                    'footer_description',
                    'contact_email',
                    'clinic_address',
                    'working_hours',
                    'directions_url',
                    'whatsapp_number',
                    'newsletter_eyebrow',
                    'newsletter_title',
                    'newsletter_description',
                    'global_cta',
                    'global_head_code',
                    'global_footer_code',
                    'global_custom_css',
                ])
                ->pluck('value', 'key'),
        ]);
    }

    public function storeLead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', 'in:contact,appointment'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        if (blank($validated['email'] ?? null) && blank($validated['phone'] ?? null)) {
            return response()->json([
                'message' => 'Please provide an email address or phone number.',
                'errors' => ['email' => ['An email address or phone number is required.']],
            ], 422);
        }

        $lead = ContactLead::create([
            ...$validated,
            'type' => $validated['type'] ?? 'contact',
        ]);

        return response()->json([
            'message' => 'Thank you. Your request has been received.',
            'lead_id' => $lead->id,
        ], 201);
    }

    public function storeSubscriber(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate([
            'email' => mb_strtolower(trim($validated['email'])),
        ]);

        return response()->json([
            'message' => 'Thanks for subscribing.',
        ], $subscriber->wasRecentlyCreated ? 201 : 200);
    }
}

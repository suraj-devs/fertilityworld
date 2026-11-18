<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSettingsController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:120'],
            'logo_url' => [
                'nullable',
                'string',
                'max:2048',
                function (string $attribute, string $value, \Closure $fail): void {
                    if ($value === '') {
                        return;
                    }

                    $isInternal = str_starts_with($value, '/')
                        && ! str_starts_with($value, '//')
                        && ! str_contains($value, '\\')
                        && preg_match('/[\x00-\x20]/', $value) !== 1;
                    $isWebUrl = preg_match('/^https?:\/\/[^\\\\\s]+$/i', $value) === 1;

                    if (! $isInternal && ! $isWebUrl) {
                        $fail('Use a site path or HTTP(S) URL for the logo.');
                    }
                },
            ],
            'topbar_text' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:80'],
            'phone_link' => ['nullable', 'regex:/^tel:\+?[0-9().\-\s]{6,40}$/'],
            'appointment_label' => ['required', 'string', 'max:80'],
            'appointment_url' => [
                'required',
                'string',
                'max:2048',
                function (string $attribute, string $value, \Closure $fail): void {
                    $isInternal = str_starts_with($value, '/')
                        && ! str_starts_with($value, '//')
                        && ! str_contains($value, '\\')
                        && preg_match('/[\x00-\x20]/', $value) !== 1;
                    $isWebUrl = preg_match('/^https?:\/\/[^\\\\\s]+$/i', $value) === 1;

                    if (! $isInternal && ! $isWebUrl) {
                        $fail('Use a site path or HTTP(S) URL for the appointment link.');
                    }
                },
            ],
            'footer_description' => ['nullable', 'string', 'max:1000'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'clinic_address' => ['nullable', 'string', 'max:1000'],
            'working_hours' => ['nullable', 'string', 'max:1000'],
            'directions_url' => ['nullable', 'url:http,https', 'max:2048'],
            'whatsapp_number' => ['nullable', 'string', 'regex:/^\+?[0-9()\-\s]{6,40}$/'],
            'newsletter_eyebrow' => ['nullable', 'string', 'max:180'],
            'newsletter_title' => ['required', 'string', 'max:180'],
            'newsletter_description' => ['nullable', 'string', 'max:1000'],
            'global_cta' => ['nullable', 'string', 'max:500000'],
        ]);

        foreach ([
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
        ] as $key) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $validated[$key] ?? ''],
            );
        }

        return response()->json(['message' => 'Site settings saved.']);
    }
}

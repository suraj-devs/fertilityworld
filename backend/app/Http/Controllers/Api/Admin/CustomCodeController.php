<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomCodeController extends Controller
{
    private const FIELDS = [
        'global_head_code',
        'global_footer_code',
        'global_custom_css',
    ];

    public function show(): JsonResponse
    {
        return response()->json([
            'custom_code' => SiteSetting::query()
                ->whereIn('key', self::FIELDS)
                ->pluck('value', 'key'),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'global_head_code' => ['nullable', 'string', 'max:500000'],
            'global_footer_code' => ['nullable', 'string', 'max:500000'],
            'global_custom_css' => ['nullable', 'string', 'max:500000'],
        ]);

        DB::transaction(function () use ($validated): void {
            foreach (self::FIELDS as $field) {
                SiteSetting::updateOrCreate(
                    ['key' => $field],
                    ['value' => $validated[$field] ?? ''],
                );
            }
        });

        return response()->json(['message' => 'Global custom code saved.']);
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqCollectionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'collections' => FaqCollection::query()
                ->withCount('pageSections')
                ->orderBy('title')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $collection = FaqCollection::create($this->validateCollection($request));

        return response()->json(['collection' => $collection->loadCount('pageSections')], 201);
    }

    public function show(FaqCollection $faqCollection): JsonResponse
    {
        return response()->json(['collection' => $faqCollection]);
    }

    public function update(Request $request, FaqCollection $faqCollection): JsonResponse
    {
        $faqCollection->update($this->validateCollection($request));

        return response()->json(['collection' => $faqCollection->refresh()->loadCount('pageSections')]);
    }

    public function destroy(FaqCollection $faqCollection): JsonResponse
    {
        if ($faqCollection->pageSections()->exists()) {
            return response()->json([
                'message' => 'This FAQ module is used on one or more pages. Remove it from those pages before deleting it.',
            ], 409);
        }

        $faqCollection->delete();

        return response()->json(['message' => 'FAQ module deleted.']);
    }

    private function validateCollection(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'intro' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1', 'max:100'],
            'items.*.question' => ['required', 'string', 'max:255'],
            'items.*.answer' => ['required', 'string', 'max:5000'],
            'is_published' => ['required', 'boolean'],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MenuItemController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'items' => MenuItem::orderBy('location')->orderBy('position')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateItem($request);
        $this->validateParent($validated);

        return response()->json(['item' => MenuItem::create($validated)], 201);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $validated = $this->validateItem($request);
        $this->validateParent($validated, $menuItem);
        $menuItem->update($validated);

        return response()->json(['item' => $menuItem->refresh()]);
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();

        return response()->json(['message' => 'Menu item deleted.']);
    }

    private function validateItem(Request $request): array
    {
        return $request->validate([
            'label' => ['required', 'string', 'max:120'],
            'url' => [
                'required',
                'string',
                'max:2048',
                function (string $attribute, string $value, \Closure $fail): void {
                    $isInternal = (str_starts_with($value, '/') && ! str_starts_with($value, '//'))
                        || str_starts_with($value, '#');
                    $isExternal = preg_match('/^(https?:\/\/|mailto:|tel:)/i', $value) === 1;

                    if (! $isInternal && ! $isExternal) {
                        $fail('Use a site path, HTTP(S), email, or telephone URL.');
                    }
                },
            ],
            'location' => ['required', 'in:header,footer'],
            'parent_id' => ['nullable', 'integer', 'exists:menu_items,id'],
            'position' => ['required', 'integer', 'min:0'],
            'is_visible' => ['required', 'boolean'],
        ]);
    }

    private function validateParent(array $data, ?MenuItem $item = null): void
    {
        if (empty($data['parent_id'])) {
            return;
        }

        $parent = MenuItem::findOrFail($data['parent_id']);
        if (
            $parent->location !== $data['location']
            || $parent->parent_id !== null
            || ($item && $parent->is($item))
        ) {
            throw ValidationException::withMessages([
                'parent_id' => ['Choose a top-level item in the same menu.'],
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactLeadController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'leads' => ContactLead::latest()->paginate(25),
        ]);
    }

    public function update(Request $request, ContactLead $contactLead): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:new,in_progress,contacted,archived'],
        ]);
        $contactLead->update($validated);

        return response()->json(['lead' => $contactLead]);
    }
}

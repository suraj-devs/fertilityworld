<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;

class NewsletterSubscriberController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'subscribers' => NewsletterSubscriber::latest()->paginate(25),
        ]);
    }

    public function destroy(NewsletterSubscriber $subscriber): JsonResponse
    {
        $subscriber->delete();

        return response()->json(['message' => 'Subscriber removed.']);
    }
}

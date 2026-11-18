<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\BlogImageController;
use App\Http\Controllers\Api\Admin\BlogPostController;
use App\Http\Controllers\Api\Admin\ContactLeadController;
use App\Http\Controllers\Api\Admin\CustomCodeController;
use App\Http\Controllers\Api\Admin\FaqCollectionController;
use App\Http\Controllers\Api\Admin\MenuItemController;
use App\Http\Controllers\Api\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Api\Admin\PageController;
use App\Http\Controllers\Api\PublicBlogController;
use App\Http\Controllers\Api\PublicContentController;

Route::get('/page', [PublicContentController::class, 'page']);
Route::get('/services', [PublicContentController::class, 'services']);
Route::get('/menu', [PublicContentController::class, 'menu']);
Route::get('/settings', [PublicContentController::class, 'settings']);
Route::get('/blog', [PublicBlogController::class, 'index']);
Route::get('/blog/{slug}', [PublicBlogController::class, 'show']);
Route::post('/leads', [PublicContentController::class, 'storeLead'])->middleware('throttle:10,1');
Route::post('/subscribers', [PublicContentController::class, 'storeSubscriber'])->middleware('throttle:10,1');

Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->prefix('admin')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/pages', PageController::class);
    Route::apiResource('/blog-posts', BlogPostController::class)->except(['create', 'edit']);
    Route::apiResource('/faq-collections', FaqCollectionController::class)->except(['create', 'edit']);
    Route::post('/uploads/blog-image', [BlogImageController::class, 'store']);
    Route::post('/uploads/logo', [BlogImageController::class, 'storeLogo']);
    Route::post('/uploads/content-image', [BlogImageController::class, 'storeContentImage']);
    Route::apiResource('/menu-items', MenuItemController::class)->except(['show']);
    Route::put('/settings', [\App\Http\Controllers\Api\Admin\SiteSettingsController::class, 'update']);
    Route::get('/custom-code', [CustomCodeController::class, 'show']);
    Route::put('/custom-code', [CustomCodeController::class, 'update']);
    Route::get('/leads', [ContactLeadController::class, 'index']);
    Route::patch('/leads/{contactLead}', [ContactLeadController::class, 'update']);
    Route::get('/subscribers', [NewsletterSubscriberController::class, 'index']);
    Route::delete('/subscribers/{subscriber}', [NewsletterSubscriberController::class, 'destroy']);
});

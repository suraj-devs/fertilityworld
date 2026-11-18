<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BlogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_blog_only_lists_and_displays_published_posts(): void
    {
        BlogPost::create([
            'title' => 'Preparing for your first consultation',
            'slug' => 'first-consultation',
            'category' => 'Fertility guidance',
            'excerpt' => 'What to expect at your first visit.',
            'author' => 'Nius We Care',
            'content' => [['type' => 'paragraph', 'text' => 'Bring your questions.']],
            'is_published' => true,
            'published_at' => now(),
        ]);
        BlogPost::create([
            'title' => 'A draft article',
            'slug' => 'draft-article',
            'author' => 'Nius We Care',
            'content' => [['type' => 'paragraph', 'text' => 'Not public yet.']],
            'is_published' => false,
        ]);

        $this->getJson('/api/blog?category=Fertility%20guidance')
            ->assertOk()
            ->assertJsonCount(1, 'posts.data')
            ->assertJsonPath('posts.data.0.slug', 'first-consultation')
            ->assertJsonPath('categories.0', 'Fertility guidance');

        $this->getJson('/api/blog/first-consultation')
            ->assertOk()
            ->assertJsonPath('post.content.0.text', 'Bring your questions.');

        $this->getJson('/api/blog/draft-article')->assertNotFound();
    }

    public function test_article_response_includes_recent_published_posts_without_current_article(): void
    {
        $current = BlogPost::create([
            'title' => 'Current article',
            'slug' => 'current-article',
            'author' => 'Nius We Care',
            'content' => [['type' => 'paragraph', 'text' => 'Article body.']],
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);
        BlogPost::create([
            'title' => 'Recent article',
            'slug' => 'recent-article',
            'category' => 'Fertility guidance',
            'cover_image' => '/storage/blog/recent.jpg',
            'author' => 'Nius We Care',
            'content' => [],
            'is_published' => true,
            'published_at' => now(),
        ]);
        BlogPost::create([
            'title' => 'Draft article',
            'slug' => 'draft-article',
            'author' => 'Nius We Care',
            'content' => [],
            'is_published' => false,
        ]);

        $this->getJson('/api/blog/'.$current->slug)
            ->assertOk()
            ->assertJsonPath('post.slug', 'current-article')
            ->assertJsonCount(1, 'recent_posts')
            ->assertJsonPath('recent_posts.0.slug', 'recent-article')
            ->assertJsonPath('recent_posts.0.cover_image', '/storage/blog/recent.jpg');
    }

    public function test_admin_can_create_update_delete_posts_and_upload_safe_images(): void
    {
        $this->getJson('/api/admin/blog-posts')->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $postData = [
            'title' => 'Understanding fertility care',
            'slug' => 'understanding-fertility-care',
            'category' => 'Fertility guidance',
            'excerpt' => 'An introduction to personalized fertility care.',
            'cover_image' => '',
            'cover_image_alt' => '',
            'author' => 'Nius We Care',
            'seo_title' => '',
            'seo_description' => '',
            'content' => [
                ['type' => 'heading', 'text' => 'Start with a conversation'],
                ['type' => 'paragraph', 'text' => 'Every care plan begins with listening.'],
                ['type' => 'list', 'items' => ['Share your health history']],
                ['type' => 'image', 'url' => '/storage/blog/consultation.jpg', 'alt' => 'A consultation'],
                ['type' => 'faq', 'title' => 'Common questions', 'faqs' => [
                    ['question' => 'What should I bring?', 'answer' => 'Bring your medical history.'],
                ]],
            ],
            'is_published' => true,
        ];

        $created = $this->postJson('/api/admin/blog-posts', $postData)
            ->assertCreated()
            ->assertJsonPath('post.is_published', true)
            ->assertJsonPath('post.content.0.text', 'Start with a conversation')
            ->assertJsonPath('post.content.3.url', '/storage/blog/consultation.jpg')
            ->assertJsonPath('post.content.4.faqs.0.question', 'What should I bring?');

        $postId = $created->json('post.id');
        $this->getJson('/api/blog/understanding-fertility-care')
            ->assertOk()
            ->assertJsonPath('post.content.3.url', '/storage/blog/consultation.jpg')
            ->assertJsonPath('post.content.4.type', 'faq')
            ->assertJsonPath('post.content.4.faqs.0.answer', 'Bring your medical history.');

        $postData['title'] = 'Understanding your fertility care';
        $postData['slug'] = 'understanding-your-fertility-care';
        $this->putJson('/api/admin/blog-posts/'.$postId, $postData)
            ->assertOk()
            ->assertJsonPath('post.title', 'Understanding your fertility care');

        $postData['content'][4]['faqs'][0]['answer'] = '';
        $this->putJson('/api/admin/blog-posts/'.$postId, $postData)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('content.4.faqs.0');

        Storage::fake('public');
        $this->post('/api/admin/uploads/blog-image', [
            'image' => UploadedFile::fake()->image('cover.webp'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonStructure(['url']);
        $this->assertCount(1, Storage::disk('public')->allFiles('blog'));

        $this->deleteJson('/api/admin/blog-posts/'.$postId)
            ->assertOk()
            ->assertJsonPath('message', 'Blog post deleted.');
        $this->assertDatabaseMissing('blog_posts', ['id' => $postId]);
    }
}

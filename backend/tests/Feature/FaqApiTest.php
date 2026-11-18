<?php

namespace Tests\Feature;

use App\Models\FaqCollection;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FaqApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_reusable_faq_modules_and_assign_them_to_pages(): void
    {
        $this->getJson('/api/admin/faq-collections')->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/admin/faq-collections', [
            'title' => 'IVF treatment questions',
            'intro' => 'Helpful answers about IVF.',
            'items' => [['question' => 'What is IVF?', 'answer' => 'It is a fertility treatment.']],
            'is_published' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('collection.page_sections_count', 0);

        $collection = FaqCollection::firstOrFail();
        $this->postJson('/api/admin/pages', [
            'title' => 'IVF treatment',
            'slug' => 'services/ivf',
            'is_published' => true,
            'sections' => [[
                'heading' => 'FAQ module',
                'type' => 'faq_collection',
                'content' => json_encode(['title' => 'Frequently asked questions']),
                'is_visible' => true,
            ]],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('sections.0.faq_collection_id');

        $pageResponse = $this->postJson('/api/admin/pages', [
            'title' => 'IVF treatment',
            'slug' => 'services/ivf',
            'is_published' => true,
            'sections' => [[
                'heading' => 'FAQ module',
                'type' => 'faq_collection',
                'content' => json_encode(['title' => 'Frequently asked questions']),
                'faq_collection_id' => $collection->id,
                'is_visible' => true,
            ]],
        ])
            ->assertCreated()
            ->assertJsonPath('page.sections.0.faq_collection_id', $collection->id);

        $pageId = $pageResponse->json('page.id');
        $duplicateSection = [
            'heading' => 'FAQ module',
            'type' => 'faq_collection',
            'content' => json_encode(['title' => 'Frequently asked questions']),
            'faq_collection_id' => $collection->id,
            'is_visible' => true,
        ];
        $this->putJson('/api/admin/pages/'.$pageId, [
            'title' => 'IVF treatment',
            'slug' => 'services/ivf',
            'is_published' => true,
            'sections' => [$duplicateSection, $duplicateSection],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('sections.1.faq_collection_id');

        $this->getJson('/api/page?slug=services/ivf')
            ->assertOk()
            ->assertJsonPath('page.sections.0.faq_collection.title', 'IVF treatment questions')
            ->assertJsonPath('page.sections.0.faq_collection.items.0.question', 'What is IVF?');

        $this->deleteJson('/api/admin/faq-collections/'.$collection->id)
            ->assertStatus(409)
            ->assertJsonPath('message', 'This FAQ module is used on one or more pages. Remove it from those pages before deleting it.');

        $this->putJson('/api/admin/pages/'.$pageId, [
            'title' => 'IVF treatment',
            'slug' => 'services/ivf',
            'is_published' => true,
            'sections' => [],
        ])->assertOk();

        $this->deleteJson('/api/admin/faq-collections/'.$collection->id)
            ->assertOk()
            ->assertJsonPath('message', 'FAQ module deleted.');
        $this->assertDatabaseMissing('faq_collections', ['id' => $collection->id]);
    }

    public function test_unpublished_faq_modules_are_not_included_in_public_pages(): void
    {
        $collection = FaqCollection::create([
            'title' => 'Draft FAQs',
            'items' => [['question' => 'Question?', 'answer' => 'Answer.']],
            'is_published' => false,
        ]);
        $page = Page::create([
            'title' => 'Home',
            'slug' => 'home',
            'is_published' => true,
        ]);
        $page->sections()->create([
            'heading' => 'FAQ module',
            'type' => 'faq_collection',
            'content' => json_encode(['title' => 'Frequently asked questions']),
            'faq_collection_id' => $collection->id,
            'is_visible' => true,
        ]);

        $this->getJson('/api/page?slug=home')
            ->assertOk()
            ->assertJsonPath('page.sections.0.faq_collection', null);
    }
}

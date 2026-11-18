<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\NewsletterSubscriber;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_page_and_menu_only_return_published_visible_content(): void
    {
        $page = Page::create([
            'title' => 'About',
            'slug' => 'about',
            'custom_head_code' => '<meta name="robots" content="index,follow">',
            'custom_footer_code' => '<script type="application/ld+json">{}</script>',
            'custom_css' => '.custom-page { color: green; }',
            'is_published' => true,
        ]);
        $page->sections()->create([
            'heading' => 'Visible section',
            'type' => 'html',
            'content' => '<section>Visible</section>',
            'position' => 0,
            'is_visible' => true,
        ]);
        $page->sections()->create([
            'heading' => 'Hidden section',
            'type' => 'html',
            'content' => '<section>Hidden</section>',
            'position' => 1,
            'is_visible' => false,
        ]);
        Page::create([
            'title' => 'Draft',
            'slug' => 'draft',
            'is_published' => false,
        ]);
        MenuItem::create([
            'label' => 'About',
            'url' => '/about',
            'location' => 'header',
            'position' => 0,
            'is_visible' => true,
        ]);
        MenuItem::create([
            'label' => 'Hidden link',
            'url' => '/hidden',
            'location' => 'header',
            'position' => 1,
            'is_visible' => false,
        ]);
        SiteSetting::create([
            'key' => 'global_cta',
            'value' => '<section class="cta-band">Contact us</section>',
        ]);

        $this->getJson('/api/page?slug=about')
            ->assertOk()
            ->assertJsonCount(1, 'page.sections')
            ->assertJsonPath('page.sections.0.heading', 'Visible section')
            ->assertJsonPath('page.custom_head_code', '<meta name="robots" content="index,follow">')
            ->assertJsonPath('page.custom_footer_code', '<script type="application/ld+json">{}</script>')
            ->assertJsonPath('page.custom_css', '.custom-page { color: green; }');

        $this->getJson('/api/page?slug=draft')->assertNotFound();

        $this->getJson('/api/menu?location=header')
            ->assertOk()
            ->assertJsonCount(1, 'items')
            ->assertJsonPath('items.0.label', 'About');

        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('settings.global_cta', '<section class="cta-band">Contact us</section>');
    }

    public function test_admin_can_manage_global_custom_code_and_public_settings_include_it(): void
    {
        $this->getJson('/api/admin/custom-code')->assertUnauthorized();
        $this->putJson('/api/admin/custom-code', [
            'global_head_code' => '<meta name="robots" content="index,follow">',
            'global_footer_code' => '<script>window.siteReady = true;</script>',
            'global_custom_css' => 'body { scroll-behavior: smooth; }',
        ])->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $this->putJson('/api/admin/custom-code', [
            'global_head_code' => '<meta name="robots" content="index,follow">',
            'global_footer_code' => '<script>window.siteReady = true;</script>',
            'global_custom_css' => 'body { scroll-behavior: smooth; }',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Global custom code saved.');

        $this->assertDatabaseHas('site_settings', [
            'key' => 'global_custom_css',
            'value' => 'body { scroll-behavior: smooth; }',
        ]);
        $this->getJson('/api/admin/custom-code')
            ->assertOk()
            ->assertJsonPath('custom_code.global_head_code', '<meta name="robots" content="index,follow">');
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('settings.global_footer_code', '<script>window.siteReady = true;</script>')
            ->assertJsonPath('settings.global_custom_css', 'body { scroll-behavior: smooth; }');
    }

    public function test_public_services_feed_uses_published_service_pages_and_safe_images(): void
    {
        $withHero = Page::create([
            'title' => 'IVF Treatment',
            'slug' => 'services/ivf',
            'seo_description' => 'IVF care at our clinic.',
            'is_published' => true,
        ]);
        $withHero->sections()->create([
            'heading' => 'IVF introduction',
            'type' => 'hero',
            'content' => json_encode([
                'title' => 'Personalized IVF',
                'body' => 'Thoughtful support at every step.',
                'image_url' => '/media/ivf.jpg',
                'image_alt' => 'A family together',
            ]),
            'position' => 0,
            'is_visible' => true,
        ]);
        $withHero->sections()->create([
            'heading' => 'Hidden image',
            'type' => 'image_text',
            'content' => json_encode(['image_url' => '/media/hidden.jpg']),
            'position' => 1,
            'is_visible' => false,
        ]);
        Page::create([
            'title' => 'IUI Care',
            'slug' => 'services/iui',
            'seo_description' => 'IUI care for your journey.',
            'is_published' => true,
        ]);
        Page::create([
            'title' => 'Draft service',
            'slug' => 'services/draft',
            'is_published' => false,
        ]);
        Page::create([
            'title' => 'About',
            'slug' => 'about',
            'is_published' => true,
        ]);

        $this->getJson('/api/services')
            ->assertOk()
            ->assertJsonCount(2, 'services')
            ->assertJsonPath('services.1.title', 'Personalized IVF')
            ->assertJsonPath('services.1.description', 'Thoughtful support at every step.')
            ->assertJsonPath('services.1.image_url', '/media/ivf.jpg')
            ->assertJsonPath('services.1.image_alt', 'A family together');

        $withHero->sections()->where('type', 'hero')->update([
            'content' => json_encode(['title' => 'Unsafe image', 'image_url' => 'javascript:alert(1)']),
        ]);

        $this->getJson('/api/services')
            ->assertOk()
            ->assertJsonPath('services.1.image_url', null);
    }

    public function test_contact_requests_require_a_contact_method_and_are_saved(): void
    {
        $this->postJson('/api/leads', ['name' => 'A Patient'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->postJson('/api/leads', [
            'type' => 'appointment',
            'name' => 'A Patient',
            'phone' => '+911234567890',
            'message' => 'Please call me.',
        ])
            ->assertCreated()
            ->assertJsonPath('message', 'Thank you. Your request has been received.');

        $this->assertDatabaseHas('contact_leads', [
            'name' => 'A Patient',
            'type' => 'appointment',
            'status' => 'new',
        ]);
    }

    public function test_newsletter_subscriptions_are_saved_once_and_admin_managed(): void
    {
        $this->postJson('/api/subscribers', ['email' => 'not-an-email'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->postJson('/api/subscribers', ['email' => 'Patient@Example.com'])
            ->assertCreated()
            ->assertJsonPath('message', 'Thanks for subscribing.');

        $this->postJson('/api/subscribers', ['email' => 'patient@example.com'])
            ->assertOk();

        $this->assertDatabaseHas('newsletter_subscribers', ['email' => 'patient@example.com']);
        $this->assertSame(1, NewsletterSubscriber::count());
        $this->getJson('/api/admin/subscribers')->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $response = $this->getJson('/api/admin/subscribers')
            ->assertOk()
            ->assertJsonPath('subscribers.data.0.email', 'patient@example.com');

        $subscriberId = $response->json('subscribers.data.0.id');
        $this->deleteJson('/api/admin/subscribers/'.$subscriberId)
            ->assertOk()
            ->assertJsonPath('message', 'Subscriber removed.');
        $this->assertDatabaseMissing('newsletter_subscribers', ['email' => 'patient@example.com']);
    }

    public function test_admin_can_upload_logo_image_for_shared_site_settings(): void
    {
        Storage::fake('public');

        $this->post('/api/admin/uploads/logo', [
            'image' => UploadedFile::fake()->image('logo.png'),
        ], ['Accept' => 'application/json'])
            ->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $this->post('/api/admin/uploads/logo', [
            'image' => UploadedFile::fake()->image('logo.png'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonStructure(['url']);

        $files = Storage::disk('public')->allFiles('branding');
        $this->assertCount(1, $files);
        $this->assertStringStartsWith('branding/', $files[0]);
    }

    public function test_admin_can_upload_images_for_page_sections(): void
    {
        Storage::fake('public');

        $this->post('/api/admin/uploads/content-image', [
            'image' => UploadedFile::fake()->image('doctor.png'),
        ], ['Accept' => 'application/json'])
            ->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $this->post('/api/admin/uploads/content-image', [
            'image' => UploadedFile::fake()->image('doctor.png'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonStructure(['url']);

        $files = Storage::disk('public')->allFiles('content');
        $this->assertCount(1, $files);
        $this->assertStringStartsWith('content/', $files[0]);

        $this->post('/api/admin/uploads/content-image', [
            'image' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');
    }

    public function test_legacy_homepage_doctor_section_migrates_to_an_editable_image_section(): void
    {
        $home = Page::create([
            'title' => 'Home',
            'slug' => 'home',
            'is_published' => true,
        ]);
        $section = $home->sections()->create([
            'heading' => 'A doctor who understands. A partner who cares.',
            'type' => 'html',
            'content' => '<section><img src="/doctor.jpg" alt="Fertility specialist"><div class="eyebrow">Expertise with empathy</div><h2>A doctor who understands.<br>A partner who cares.</h2><p class="section-copy">A personal approach.</p><div class="doctor-caption"><h3>Dr Example</h3><p>Fertility Specialist</p></div><ul class="check-list"><li>Experienced care</li></ul><button>Meet your specialist</button></section>',
            'position' => 0,
            'is_visible' => true,
        ]);

        $this->assertSame(0, Artisan::call('app:import-legacy-content'));

        $section->refresh();
        $data = json_decode($section->content, true);
        $this->assertSame('image_text', $section->type);
        $this->assertSame('doctor', $data['variant']);
        $this->assertSame('/doctor.jpg', $data['image_url']);
        $this->assertSame('Experienced care', $data['features'][0]);
    }

    public function test_admin_page_edits_require_authentication_and_save_sections(): void
    {
        $this->getJson('/api/admin/pages')->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/admin/pages', [
            'title' => 'Reserved URL',
            'slug' => 'blog',
            'is_published' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors('slug');

        $this->postJson('/api/admin/pages', [
            'title' => 'New service',
            'slug' => 'services/new-service',
            'seo_title' => 'New service',
            'seo_description' => 'A dynamic page.',
            'custom_head_code' => '<link rel="canonical" href="https://example.com/services/new-service">',
            'custom_footer_code' => '<script>window.pageReady = true;</script>',
            'custom_css' => '.service-page { color: green; }',
            'is_published' => true,
            'sections' => [[
                'heading' => 'Overview',
                'type' => 'html',
                'content' => '<section><h2>Overview</h2></section>',
                'is_visible' => true,
            ], [
                'heading' => 'Highlights',
                'type' => 'cards',
                'content' => json_encode(['title' => 'Highlights', 'items' => [['title' => 'Care', 'body' => 'Personalized care.']]]),
                'is_visible' => true,
            ], [
                'heading' => 'Latest blog posts',
                'type' => 'blog_posts',
                'content' => json_encode(['title' => 'Latest from our blog', 'post_count' => 3]),
                'is_visible' => true,
            ], [
                'heading' => 'Dynamic services',
                'type' => 'service_pages',
                'content' => json_encode(['title' => 'Explore treatments']),
                'is_visible' => true,
            ]],
        ])
            ->assertCreated()
            ->assertJsonPath('page.slug', 'services/new-service')
            ->assertJsonPath('page.sections.0.heading', 'Overview')
            ->assertJsonPath('page.sections.1.type', 'cards')
            ->assertJsonPath('page.sections.2.type', 'blog_posts')
            ->assertJsonPath('page.sections.3.type', 'service_pages')
            ->assertJsonPath('page.custom_head_code', '<link rel="canonical" href="https://example.com/services/new-service">')
            ->assertJsonPath('page.custom_footer_code', '<script>window.pageReady = true;</script>')
            ->assertJsonPath('page.custom_css', '.service-page { color: green; }');

        $this->assertDatabaseHas('page_sections', [
            'heading' => 'Overview',
            'position' => 0,
        ]);

        $this->postJson('/api/admin/pages', [
            'title' => 'Invalid block',
            'slug' => 'invalid-block',
            'is_published' => true,
            'sections' => [[
                'heading' => 'FAQ',
                'type' => 'faq',
                'content' => 'not-json',
                'is_visible' => true,
            ]],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('sections.0.content');

        $this->postJson('/api/admin/menu-items', [
            'label' => 'New link',
            'url' => 'javascript:alert(1)',
            'location' => 'header',
            'parent_id' => null,
            'position' => 0,
            'is_visible' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors('url');

        $this->postJson('/api/admin/menu-items', [
            'label' => 'New link',
            'url' => '/new',
            'location' => 'header',
            'parent_id' => null,
            'position' => 0,
            'is_visible' => true,
        ])->assertCreated();
    }

    public function test_admin_login_issues_a_token_without_requiring_a_session_table(): void
    {
        config(['session.driver' => 'database']);
        User::factory()->create([
            'name' => 'Site Admin',
            'email' => 'admin@example.com',
            'password' => 'a-secure-password',
        ]);

        $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'a-secure-password',
        ])
            ->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);

        $this->putJson('/api/admin/settings', [
            'site_name' => 'We Care Fertility',
            'logo_url' => 'javascript:alert(1)',
            'topbar_text' => 'Care in Jaipur',
            'phone_number' => '+91 12345 67890',
            'phone_link' => 'tel:+911234567890',
            'appointment_label' => 'Book appointment',
            'appointment_url' => 'javascript:alert(1)',
            'footer_description' => 'Personal fertility care.',
            'contact_email' => 'contact@example.com',
            'clinic_address' => 'Jaipur, Rajasthan',
            'working_hours' => 'Monday to Saturday',
            'directions_url' => 'https://maps.google.com/example',
            'whatsapp_number' => '+91 91234 12345',
            'newsletter_eyebrow' => 'Stay connected',
            'newsletter_title' => 'Subscribe for updates',
            'newsletter_description' => 'Clinic news and updates.',
            'global_cta' => '<section class="cta-band">Updated</section>',
        ])->assertUnprocessable()->assertJsonValidationErrors(['logo_url', 'appointment_url']);

        $this->putJson('/api/admin/settings', [
            'site_name' => 'We Care Fertility',
            'logo_url' => '/media/logo.png',
            'topbar_text' => 'Care in Jaipur',
            'phone_number' => '+91 12345 67890',
            'phone_link' => 'tel:+911234567890',
            'appointment_label' => 'Book appointment',
            'appointment_url' => '/contact-us?type=appointment',
            'footer_description' => 'Personal fertility care.',
            'contact_email' => 'contact@example.com',
            'clinic_address' => 'Jaipur, Rajasthan',
            'working_hours' => 'Monday to Saturday',
            'directions_url' => 'https://maps.google.com/example',
            'whatsapp_number' => '+91 91234 12345',
            'newsletter_eyebrow' => 'Stay connected',
            'newsletter_title' => 'Subscribe for updates',
            'newsletter_description' => 'Clinic news and updates.',
            'global_cta' => '<section class="cta-band">Updated</section>',
        ])->assertOk();

        $this->assertDatabaseHas('site_settings', [
            'key' => 'global_cta',
            'value' => '<section class="cta-band">Updated</section>',
        ]);
        $this->assertDatabaseHas('site_settings', [
            'key' => 'site_name',
            'value' => 'We Care Fertility',
        ]);
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('settings.site_name', 'We Care Fertility')
            ->assertJsonPath('settings.appointment_url', '/contact-us?type=appointment')
            ->assertJsonPath('settings.phone_link', 'tel:+911234567890')
            ->assertJsonPath('settings.contact_email', 'contact@example.com')
            ->assertJsonPath('settings.clinic_address', 'Jaipur, Rajasthan')
            ->assertJsonPath('settings.newsletter_title', 'Subscribe for updates');
    }
}

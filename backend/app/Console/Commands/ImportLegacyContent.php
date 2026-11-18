<?php

namespace App\Console\Commands;

use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\SiteSetting;
use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;
use DOMXPath;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportLegacyContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-legacy-content';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import the existing static pages and navigation into the CMS';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $projectRoot = dirname(base_path());
        $files = array_merge(
            glob($projectRoot.DIRECTORY_SEPARATOR.'*.html') ?: [],
            glob($projectRoot.DIRECTORY_SEPARATOR.'services'.DIRECTORY_SEPARATOR.'*.html') ?: [],
        );

        if ($files === []) {
            $this->error('No legacy HTML pages were found next to the backend directory.');

            return self::FAILURE;
        }

        if (Page::query()->exists() || MenuItem::query()->exists()) {
            DB::transaction(function () use ($files): void {
                $this->importSiteSettings($files);
                $this->upgradeContactProfileSection();
                $this->upgradeHomepageSections();
                $this->moveHomeNewsletterSectionToFooter();
            });
            $this->warn('Existing pages and menus were preserved; missing profile settings and legacy contact/newsletter content were migrated when applicable.');

            return self::SUCCESS;
        }

        DB::transaction(function () use ($files): void {
            foreach ($files as $file) {
                $this->importPage($file);
            }

            $this->importHeaderMenu($files);
            $this->importFooterMenu($files);
            $this->importSiteSettings($files);
            $this->upgradeContactProfileSection();
            $this->moveHomeNewsletterSectionToFooter();
        });

        $this->info(sprintf(
            'Imported %d pages, %d sections and %d navigation items.',
            Page::count(),
            PageSection::count(),
            MenuItem::count(),
        ));

        return self::SUCCESS;
    }

    private function importPage(string $file): void
    {
        $document = $this->loadDocument($file);
        $xpath = new DOMXPath($document);
        $main = $xpath->query('//main')->item(0);

        if (! $main) {
            $this->warn('Skipped page without a main element: '.basename($file));

            return;
        }

        $relativePath = str_replace('\\', '/', substr($file, strlen(dirname(base_path())) + 1));
        $path = preg_replace('/\.html?$/i', '', $relativePath);
        $slug = $path === 'index' ? 'home' : $path;
        if ($slug === 'success') {
            return;
        }

        $titleNode = $xpath->query('.//h1[1]', $main)->item(0);
        $title = $titleNode ? trim($titleNode->textContent) : Str::headline(basename($path));
        $seoTitle = trim($xpath->query('//title')->item(0)?->textContent ?? '');
        $descriptionNode = $xpath->query('//meta[translate(@name, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="description"]')->item(0);

        $page = Page::create([
            'title' => $title,
            'slug' => $slug,
            'seo_title' => $seoTitle !== '' ? $seoTitle : $title,
            'seo_description' => $descriptionNode instanceof DOMElement
                ? $descriptionNode->getAttribute('content')
                : null,
            'is_published' => true,
        ]);

        $position = 0;
        foreach ($main->childNodes as $node) {
            if ($node instanceof DOMElement) {
                $this->storeSection($page, $node, $document, $position++);
            }
        }

    }

    private function storeSection(Page $page, DOMElement $node, DOMDocument $document, int $position): void
    {
        $this->normalizeMarkup($node);
        $headingNode = (new DOMXPath($document))->query('.//h1[1] | .//h2[1] | .//h3[1]', $node)->item(0);
        $heading = $headingNode ? trim($headingNode->textContent) : 'Section '.($position + 1);
        $isHomeBlogSection = $page->slug === 'home'
            && Str::lower($heading) === 'welcome to your circle of care.';
        $isHomeHero = $page->slug === 'home'
            && preg_match('/(?:^|\s)hero(?:\s|$)/', $node->getAttribute('class')) === 1;
        $isHomeServicePages = $page->slug === 'home'
            && Str::startsWith(Str::lower($heading), 'different paths');
        $isHomeDoctor = $page->slug === 'home'
            && Str::startsWith(Str::lower($heading), 'a doctor who understands');

        $page->sections()->create([
            'heading' => match (true) {
                $isHomeBlogSection => 'Latest from our blog',
                $isHomeHero => 'Homepage hero banner',
                $isHomeServicePages => 'Dynamic service pages',
                $isHomeDoctor => $heading,
                default => Str::limit($heading, 180, ''),
            },
            'type' => match (true) {
                $isHomeBlogSection => 'blog_posts',
                $isHomeHero => 'hero',
                $isHomeServicePages => 'service_pages',
                $isHomeDoctor => 'image_text',
                default => 'html',
            },
            'content' => match (true) {
                $isHomeBlogSection => json_encode([
                    'eyebrow' => 'Helpful advice and clinic news',
                    'title' => 'Latest from our blog',
                    'intro' => 'Explore clear, supportive guidance from our fertility care team.',
                    'post_count' => 3,
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
                $isHomeHero => json_encode(
                    $this->homepageHeroData($node, $document),
                    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
                ),
                $isHomeServicePages => json_encode(
                    $this->servicePagesData($node, $document),
                    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
                ),
                $isHomeDoctor => json_encode(
                    $this->homepageDoctorData($node, $document),
                    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
                ),
                default => $document->saveHTML($node),
            },
            'position' => $position,
            'is_visible' => true,
        ]);
    }

    private function upgradeHomepageSections(): void
    {
        $home = Page::query()->where('slug', 'home')->first();
        if (! $home) {
            return;
        }

        $hero = $home->sections()
            ->where('type', 'html')
            ->where('content', 'like', '%hero-content%')
            ->first();

        if ($hero) {
            $document = $this->loadFragment($hero->content);
            $node = (new DOMXPath($document))
                ->query('//*[contains(concat(" ", normalize-space(@class), " "), " hero ")]')
                ->item(0);

            if ($node instanceof DOMElement) {
                $hero->update([
                    'heading' => 'Homepage hero banner',
                    'type' => 'hero',
                    'content' => json_encode(
                        $this->homepageHeroData($node, $document),
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
                    ),
                ]);
            }
        }

        $services = $home->sections()
            ->where('type', 'html')
            ->where('heading', 'like', 'Different paths%')
            ->first();

        if ($services) {
            $document = $this->loadFragment($services->content);
            $node = (new DOMXPath($document))->query('//section[1]')->item(0);

            if ($node instanceof DOMElement) {
                $services->update([
                    'heading' => 'Dynamic service pages',
                    'type' => 'service_pages',
                    'content' => json_encode(
                        $this->servicePagesData($node, $document),
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
                    ),
                ]);
            }
        }

        $doctor = $home->sections()
            ->where('type', 'html')
            ->where('heading', 'like', 'A doctor who understands%')
            ->first();

        if ($doctor) {
            $document = $this->loadFragment($doctor->content);
            $node = (new DOMXPath($document))->query('//section[1]')->item(0);

            if ($node instanceof DOMElement) {
                $doctor->update([
                    'type' => 'image_text',
                    'content' => json_encode(
                        $this->homepageDoctorData($node, $document),
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
                    ),
                ]);
            }
        }
    }

    private function homepageDoctorData(DOMElement $node, DOMDocument $document): array
    {
        $xpath = new DOMXPath($document);
        $eyebrow = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " eyebrow ")]', $node)->item(0);
        $title = $xpath->query('.//h2[1]', $node)->item(0);
        $body = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " section-copy ")]', $node)->item(0);
        $image = $xpath->query('.//img[1]', $node)->item(0);
        $captionTitle = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " doctor-caption ")]//h3[1]', $node)->item(0);
        $captionSubtitle = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " doctor-caption ")]//p[1]', $node)->item(0);
        $features = [];

        foreach ($xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " check-list ")]/li', $node) as $feature) {
            $text = trim($feature->textContent);
            if ($text !== '') {
                $features[] = $text;
            }
        }

        $button = $xpath->query('.//button[1]', $node)->item(0);

        return [
            'variant' => 'doctor',
            'eyebrow' => $eyebrow ? trim($eyebrow->textContent) : '',
            'title' => $title ? trim(preg_replace('/\s+/', ' ', $this->textWithLineBreaks($title)) ?? '') : '',
            'body' => $body ? trim($body->textContent) : '',
            'image_url' => $image instanceof DOMElement ? $this->normalizeAssetUrl($image->getAttribute('src')) : '',
            'image_alt' => $image instanceof DOMElement ? $image->getAttribute('alt') : '',
            'image_side' => 'left',
            'caption_title' => $captionTitle ? trim($captionTitle->textContent) : '',
            'caption_subtitle' => $captionSubtitle ? trim($captionSubtitle->textContent) : '',
            'features' => $features,
            'button_label' => $button ? trim($button->textContent) : '',
            'button_url' => '/contact-us?type=appointment',
        ];
    }

    private function homepageHeroData(DOMElement $node, DOMDocument $document): array
    {
        $xpath = new DOMXPath($document);
        $eyebrow = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " eyebrow ")]', $node)->item(0);
        $titleNode = $xpath->query('.//h1[1]', $node)->item(0);
        $copy = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " hero-copy ")]', $node)->item(0);
        $image = $xpath->query('.//img[1]', $node)->item(0);
        $actions = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " hero-actions ")]', $node)->item(0);
        $primary = $actions ? $xpath->query('.//button[1]', $actions)->item(0) : null;
        $secondary = $actions ? $xpath->query('.//a[1]', $actions)->item(0) : null;
        $lines = $titleNode instanceof DOMNode
            ? array_values(array_filter(array_map('trim', explode("\n", $this->textWithLineBreaks($titleNode)))))
            : [];
        $mainTitle = count($lines) > 1 ? $lines[count($lines) - 2] : ($lines[0] ?? 'Your hope.');
        $highlight = count($lines) > 1 ? $lines[count($lines) - 1] : '';

        return [
            'layout' => 'cover',
            'eyebrow' => $eyebrow ? trim($eyebrow->textContent) : '',
            'title' => $mainTitle,
            'highlight' => $highlight,
            'body' => $copy ? trim($copy->textContent) : '',
            'image_url' => $image instanceof DOMElement ? $this->normalizeAssetUrl($image->getAttribute('src')) : '',
            'image_alt' => $image instanceof DOMElement ? $image->getAttribute('alt') : '',
            'button_label' => $primary ? trim($primary->textContent) : '',
            'button_url' => $primary ? '/contact-us?type=appointment' : '',
            'secondary_button_label' => $secondary ? trim($secondary->textContent) : '',
            'secondary_button_url' => $secondary instanceof DOMElement ? $this->normalizeUrl($secondary->getAttribute('href')) : '',
        ];
    }

    private function servicePagesData(DOMElement $node, DOMDocument $document): array
    {
        $xpath = new DOMXPath($document);
        $eyebrow = $xpath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " eyebrow ")]', $node)->item(0);
        $title = $xpath->query('.//h2[1]', $node)->item(0);
        $intro = $xpath->query('.//p[1]', $node)->item(0);
        $link = $xpath->query('.//a[@href][1]', $node)->item(0);

        return [
            'eyebrow' => $eyebrow ? trim($eyebrow->textContent) : 'Care designed around you',
            'title' => $title ? trim($title->textContent) : 'Different paths. One beautiful possibility.',
            'intro' => $intro ? trim($intro->textContent) : '',
            'button_label' => $link ? trim($link->textContent) : 'Explore all treatments',
            'button_url' => $link instanceof DOMElement ? $this->normalizeUrl($link->getAttribute('href')) : '/treatments',
        ];
    }

    private function importHeaderMenu(array $files): void
    {
        $document = $this->loadDocument($files[0]);
        $xpath = new DOMXPath($document);
        $nav = $xpath->query('//header//nav')->item(0);

        if (! $nav) {
            return;
        }

        foreach ($nav->childNodes as $node) {
            if (! $node instanceof DOMElement) {
                continue;
            }

            if ($node->tagName === 'a') {
                $this->createMenuItem($node, 'header');
                continue;
            }

            $trigger = (new DOMXPath($document))->query('./a[1]', $node)->item(0);
            if (! $trigger instanceof DOMElement) {
                continue;
            }

            if (Str::lower(trim($trigger->textContent)) === 'success') {
                $trigger->textContent = 'Blog';
                $trigger->setAttribute('href', '/blog');
                $this->createMenuItem($trigger, 'header');
                continue;
            }

            $parent = $this->createMenuItem($trigger, 'header');
            $children = (new DOMXPath($document))->query('./div[contains(concat(" ", normalize-space(@class), " "), " nav-dropdown ")]/a', $node);
            foreach ($children as $child) {
                if ($child instanceof DOMElement) {
                    $this->createMenuItem($child, 'header', $parent->id);
                }
            }
        }
    }

    private function importFooterMenu(array $files): void
    {
        $document = $this->loadDocument($files[0]);
        $xpath = new DOMXPath($document);

        foreach ($xpath->query('//footer//div[contains(concat(" ", normalize-space(@class), " "), " footer-links ")]') as $group) {
            if (! $group instanceof DOMElement) {
                continue;
            }

            $heading = (new DOMXPath($document))->query('./preceding-sibling::h3[1]', $group)->item(0);
            $container = $group->parentNode;
            if (! $heading && $container instanceof DOMElement) {
                $heading = (new DOMXPath($document))->query('./h3[1]', $container)->item(0);
            }
            $label = $heading ? trim($heading->textContent) : 'Explore';
            $parent = MenuItem::create([
                'label' => $label,
                'url' => '#',
                'location' => 'footer',
                'position' => MenuItem::where('location', 'footer')->whereNull('parent_id')->count(),
                'is_visible' => true,
            ]);

            foreach ((new DOMXPath($document))->query('./a', $group) as $link) {
                if ($link instanceof DOMElement) {
                    $this->createMenuItem($link, 'footer', $parent->id);
                }
            }
        }
    }

    private function importSiteSettings(array $files): void
    {
        $document = $this->loadDocument($files[0]);
        $xpath = new DOMXPath($document);
        $callToAction = $xpath->query('//*[contains(concat(" ", normalize-space(@class), " "), " cta-band ")]')->item(0);
        $logo = $xpath->query('//header//a[contains(concat(" ", normalize-space(@class), " "), " brand ")]/img[1]')->item(0);
        $location = $xpath->query('//a[contains(concat(" ", normalize-space(@class), " "), " topbar-location ")]')->item(0);
        $phone = $xpath->query('//div[contains(concat(" ", normalize-space(@class), " "), " topbar ")]//a[starts-with(@href, "tel:")]')->item(0);
        $footerDescription = $xpath->query('//footer//div[contains(concat(" ", normalize-space(@class), " "), " footer-grid ")]/div[1]/p[1]')->item(0);
        $appointment = $xpath->query('//header//button[contains(concat(" ", normalize-space(@class), " "), " header-cta ")]')->item(0);
        $siteName = $xpath->query('//meta[@property="og:site_name"]')->item(0)?->getAttribute('content') ?? '';

        $values = [
            'site_name' => trim($siteName),
            'logo_url' => $logo instanceof DOMElement ? $this->normalizeAssetUrl($logo->getAttribute('src')) : '',
            'topbar_text' => $location ? trim($location->textContent) : '',
            'phone_number' => $phone ? trim($phone->textContent) : '',
            'phone_link' => $phone instanceof DOMElement ? $phone->getAttribute('href') : '',
            'appointment_label' => $appointment ? trim($appointment->textContent) : 'Book Appointment',
            'appointment_url' => '/contact-us?type=appointment',
            'footer_description' => $footerDescription ? trim($footerDescription->textContent) : '',
            'newsletter_eyebrow' => 'Stay connected',
            'newsletter_title' => 'Subscribe for updates',
            'newsletter_description' => 'Get helpful news and updates from our clinic.',
        ];

        foreach ($values as $key => $value) {
            if ($value !== '') {
                SiteSetting::firstOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        if ($callToAction instanceof DOMElement) {
            $this->normalizeMarkup($callToAction);
            SiteSetting::firstOrCreate(
                ['key' => 'global_cta'],
                ['value' => $document->saveHTML($callToAction)],
            );
        }

        $contactFile = null;
        foreach ($files as $candidate) {
            if (strtolower(basename($candidate)) === 'contact-us.html') {
                $contactFile = $candidate;
                break;
            }
        }

        if ($contactFile === null) {
            return;
        }

        $contactDocument = $this->loadDocument($contactFile);
        $contactXPath = new DOMXPath($contactDocument);
        $rows = $contactXPath->query('//*[contains(concat(" ", normalize-space(@class), " "), " contact-row ")]');
        $addressRow = $rows->item(0);
        $hoursRow = $rows->item(1);
        $phoneRow = $rows->item(2);
        $emailRow = $rows->item(3);

        if ($addressRow instanceof DOMElement) {
            $address = trim(str_replace('Get directions', '', $this->textWithLineBreaks($addressRow)));
            if ($address !== '') {
                SiteSetting::firstOrCreate(['key' => 'clinic_address'], ['value' => $address]);
            }
            $directions = (new DOMXPath($contactDocument))->query('.//a[@href]', $addressRow)->item(0);
            if ($directions instanceof DOMElement && $directions->getAttribute('href') !== '') {
                SiteSetting::firstOrCreate(['key' => 'directions_url'], ['value' => $directions->getAttribute('href')]);
            }
        }

        if ($hoursRow instanceof DOMElement) {
            $hoursText = $this->textWithLineBreaks($hoursRow);
            $privacyNote = $contactXPath->query('.//*[contains(concat(" ", normalize-space(@class), " "), " privacy-note ")]', $hoursRow)->item(0);
            if ($privacyNote instanceof DOMNode) {
                $hoursText = str_replace($this->textWithLineBreaks($privacyNote), '', $hoursText);
            }
            $hoursText = trim(preg_replace('/^Clinic hours\s*/i', '', $hoursText) ?? '');
            if ($hoursText !== '') {
                SiteSetting::firstOrCreate(['key' => 'working_hours'], ['value' => $hoursText]);
            }
        }

        foreach ([
            'phone_number' => $phoneRow,
            'contact_email' => $emailRow,
        ] as $key => $row) {
            $link = $row instanceof DOMElement
                ? (new DOMXPath($contactDocument))->query('.//a[1]', $row)->item(0)
                : null;
            if ($link instanceof DOMElement) {
                SiteSetting::firstOrCreate(['key' => $key], ['value' => trim($link->textContent)]);
            }
        }

        $whatsapp = $contactXPath->query('//a[contains(@href, "wa.me")]')->item(0);
        if ($whatsapp instanceof DOMElement) {
            $number = preg_replace('/\D+/', '', parse_url($whatsapp->getAttribute('href'), PHP_URL_PATH) ?? '');
            if ($number !== '') {
                SiteSetting::firstOrCreate(['key' => 'whatsapp_number'], ['value' => $number]);
            }
        }
    }

    private function upgradeContactProfileSection(): void
    {
        $page = Page::query()->where('slug', 'contact-us')->first();
        if (! $page) {
            return;
        }

        $section = $page->sections()
            ->where('type', 'html')
            ->where('heading', 'like', 'Visit%')
            ->where('content', 'like', '%contact-row%')
            ->first();

        if (! $section) {
            return;
        }

        $document = $this->loadFragment($section->content);
        $xpath = new DOMXPath($document);
        $title = $xpath->query('//div[contains(concat(" ", normalize-space(@class), " "), " content-grid ")]/div[1]/h2[1]')->item(0);
        $aside = $xpath->query('//aside')->item(0);
        $intro = $aside instanceof DOMElement ? $xpath->query('.//p[1]', $aside)->item(0) : null;
        $privacyNote = $aside instanceof DOMElement
            ? $xpath->query('.//p[contains(concat(" ", normalize-space(@class), " "), " privacy-note ")]', $aside)->item(0)
            : null;

        $section->update([
            'type' => 'contact_profile',
            'content' => json_encode([
                'title' => $title ? trim($title->textContent) : 'Visit our clinic',
                'intro' => $intro ? trim($intro->textContent) : '',
                'privacy_note' => $privacyNote ? trim($privacyNote->textContent) : '',
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
        ]);
    }

    private function moveHomeNewsletterSectionToFooter(): void
    {
        $marker = SiteSetting::query()->where('key', 'home_newsletter_section_initialized')->value('value');
        if ($marker !== '1') {
            return;
        }

        $homePage = Page::query()->where('slug', 'home')->first();
        if (! $homePage) {
            return;
        }

        $section = $homePage->sections()->where('type', 'newsletter_signup')->first();
        if ($section) {
            $data = json_decode($section->content, true);
            $data = is_array($data) ? $data : [];
            foreach ([
                'newsletter_eyebrow' => $data['eyebrow'] ?? 'Stay connected',
                'newsletter_title' => $data['title'] ?? 'Subscribe for updates',
                'newsletter_description' => $data['body'] ?? 'Get helpful news and updates from our clinic.',
            ] as $key => $value) {
                SiteSetting::updateOrCreate(['key' => $key], ['value' => is_string($value) ? $value : '']);
            }

            $position = $section->position;
            $section->delete();
            PageSection::query()
                ->where('page_id', $homePage->id)
                ->where('position', '>', $position)
                ->decrement('position');
        }

        SiteSetting::updateOrCreate(
            ['key' => 'home_newsletter_section_initialized'],
            ['value' => '2'],
        );
    }

    private function textWithLineBreaks(DOMNode $node): string
    {
        if ($node instanceof DOMText) {
            return $node->nodeValue ?? '';
        }

        if ($node instanceof DOMElement && strtolower($node->tagName) === 'br') {
            return "\n";
        }

        $text = '';
        foreach ($node->childNodes as $child) {
            $text .= $this->textWithLineBreaks($child);
        }

        return $text;
    }

    private function createMenuItem(DOMElement $link, string $location, ?int $parentId = null): MenuItem
    {
        $label = trim($link->textContent);
        $url = $this->normalizeUrl($link->getAttribute('href'));
        $existing = MenuItem::query()
            ->where('location', $location)
            ->where('label', $label)
            ->where('url', $url)
            ->where('parent_id', $parentId)
            ->first();

        if ($existing) {
            return $existing;
        }

        return MenuItem::create([
            'label' => Str::limit($label !== '' ? $label : 'Link', 120, ''),
            'url' => $url !== '' ? $url : '/',
            'location' => $location,
            'parent_id' => $parentId,
            'position' => MenuItem::where('location', $location)->where('parent_id', $parentId)->count(),
            'is_visible' => true,
        ]);
    }

    private function loadDocument(string $file): DOMDocument
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8">'.file_get_contents($file), LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return $document;
    }

    private function loadFragment(string $html): DOMDocument
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8">'.$html, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return $document;
    }

    private function normalizeMarkup(DOMElement $node): void
    {
        if ($node->tagName === 'img' && $node->hasAttribute('src')) {
            $node->setAttribute('src', $this->normalizeAssetUrl($node->getAttribute('src')));
        }

        if ($node->tagName === 'a' && $node->hasAttribute('href')) {
            $node->setAttribute('href', $this->normalizeUrl($node->getAttribute('href')));
        }

        foreach ($node->childNodes as $child) {
            if ($child instanceof DOMElement) {
                $this->normalizeMarkup($child);
            }
        }
    }

    private function normalizeAssetUrl(string $url): string
    {
        $path = ltrim($url, '/');
        if (str_starts_with($path, 'assets/') || str_starts_with($path, 'media/')) {
            return '/legacy/'.$path;
        }

        return $url;
    }

    private function normalizeUrl(string $url): string
    {
        if ($url === '' || str_starts_with($url, '#') || preg_match('/^[a-z][a-z0-9+.-]*:/i', $url)) {
            return $url;
        }

        $parts = parse_url($url);
        $path = ltrim($parts['path'] ?? '', '/');
        $path = preg_replace('/\.html?$/i', '', $path);
        $path = $path === 'index' ? '' : $path;
        $normalized = $path === '' ? '/' : '/'.$path;

        if (isset($parts['query'])) {
            $normalized .= '?'.$parts['query'];
        }
        if (isset($parts['fragment'])) {
            $normalized .= '#'.$parts['fragment'];
        }

        return $normalized;
    }

}

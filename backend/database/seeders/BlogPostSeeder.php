<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Sample: Preparing for Your First Clinic Visit',
                'slug' => 'sample-preparing-for-your-first-clinic-visit',
                'category' => 'Clinic guide',
                'excerpt' => 'A simple checklist to help you feel prepared for a first conversation with your care team.',
                'content' => [
                    ['type' => 'heading', 'text' => 'A welcoming first visit'],
                    ['type' => 'paragraph', 'text' => 'This sample article demonstrates how clinic updates and educational posts appear on the website. Your appointment confirmation is the best place to check what to bring.'],
                    ['type' => 'list', 'items' => ['Write down questions you would like to ask.', 'Bring any records the clinic has requested.', 'Let the care team know what would help you feel comfortable.']],
                    ['type' => 'quote', 'text' => 'Every question is welcome, and your care team is there to listen.'],
                    ['type' => 'paragraph', 'text' => 'Sample content only; this post does not provide medical advice.'],
                ],
            ],
            [
                'title' => 'Sample: Questions to Bring to a Consultation',
                'slug' => 'sample-questions-to-bring-to-a-consultation',
                'category' => 'Fertility guidance',
                'excerpt' => 'Use these example prompts to start a clear conversation with your clinic team.',
                'content' => [
                    ['type' => 'heading', 'text' => 'Make space for your questions'],
                    ['type' => 'paragraph', 'text' => 'A consultation is a chance to share what matters to you and hear information about your individual situation. It can help to write down questions ahead of time.'],
                    ['type' => 'list', 'items' => ['Who should I contact if I have a question later?', 'What information will we discuss at the next visit?', 'Can you explain any unfamiliar terms in a different way?']],
                    ['type' => 'paragraph', 'text' => 'These are general sample prompts, not clinical recommendations. Your clinician can answer questions about your care.'],
                ],
            ],
            [
                'title' => 'Sample: Understanding Your Personal Care Plan',
                'slug' => 'sample-understanding-your-personal-care-plan',
                'category' => 'Care planning',
                'excerpt' => 'A sample guide to asking for clear explanations and knowing what to expect next.',
                'content' => [
                    ['type' => 'heading', 'text' => 'Ask for the next steps'],
                    ['type' => 'paragraph', 'text' => 'Care plans are personal. If something is unclear, ask your clinic team to explain the purpose of each step, the expected timing, and who to contact for help.'],
                    ['type' => 'quote', 'text' => 'You deserve information that feels clear and relevant to you.'],
                    ['type' => 'paragraph', 'text' => 'This demonstration post is for layout purposes only and is not medical advice. Follow guidance from your own care team.'],
                ],
            ],
            [
                'title' => 'Sample: Finding Support Along the Way',
                'slug' => 'sample-finding-support-along-the-way',
                'category' => 'Wellbeing',
                'excerpt' => 'A gentle reminder to ask for the kind of practical and emotional support that works for you.',
                'content' => [
                    ['type' => 'heading', 'text' => 'Support can look different for everyone'],
                    ['type' => 'paragraph', 'text' => 'People find support in different ways. You might choose to talk with someone you trust, ask your clinic about available support, or take time to consider what feels comfortable.'],
                    ['type' => 'list', 'items' => ['Choose who you want to share updates with.', 'Tell your care team if you would like extra time for questions.', 'Ask which support options are available at your clinic.']],
                    ['type' => 'paragraph', 'text' => 'This is sample educational content, not a substitute for professional care.'],
                ],
            ],
            [
                'title' => 'Sample: Making Sense of Fertility Information',
                'slug' => 'sample-making-sense-of-fertility-information',
                'category' => 'Patient education',
                'excerpt' => 'A sample note on checking sources and discussing online information with your clinician.',
                'content' => [
                    ['type' => 'heading', 'text' => 'Bring questions about what you read'],
                    ['type' => 'paragraph', 'text' => 'Online articles can use unfamiliar terms or describe experiences that may not match your own. If you find information that raises questions, share it with your care team and ask how it applies to you.'],
                    ['type' => 'list', 'items' => ['Check who published the information.', 'Note when it was last reviewed.', 'Ask your clinician to explain how it relates to your situation.']],
                    ['type' => 'paragraph', 'text' => 'This demonstration article is not medical advice. Your clinician is the right person to discuss your individual care.'],
                ],
            ],
        ];

        foreach ($posts as $index => $post) {
            BlogPost::firstOrCreate(
                ['slug' => $post['slug']],
                [
                    ...$post,
                    'author' => 'Nius We Care',
                    'seo_title' => $post['title'],
                    'seo_description' => $post['excerpt'],
                    'is_published' => true,
                    'published_at' => now()->subDays(4 - $index),
                ],
            );
        }
    }
}

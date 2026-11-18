<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    protected $fillable = [
        'heading',
        'type',
        'content',
        'faq_collection_id',
        'position',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'position' => 'integer',
            'faq_collection_id' => 'integer',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function faqCollection(): BelongsTo
    {
        return $this->belongsTo(FaqCollection::class);
    }
}

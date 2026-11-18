<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FaqCollection extends Model
{
    protected $fillable = [
        'title',
        'intro',
        'items',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function pageSections(): HasMany
    {
        return $this->hasMany(PageSection::class);
    }
}

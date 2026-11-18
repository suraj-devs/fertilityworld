<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'excerpt',
        'cover_image',
        'cover_image_alt',
        'author',
        'seo_title',
        'seo_description',
        'content',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}

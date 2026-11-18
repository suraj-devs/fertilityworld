<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactLead extends Model
{
    protected $fillable = [
        'type',
        'name',
        'email',
        'phone',
        'message',
        'status',
    ];
}

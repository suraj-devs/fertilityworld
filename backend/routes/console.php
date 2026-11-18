<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:create-admin', function () {
    $name = $this->ask('Admin name');
    $email = $this->ask('Admin email');
    $password = $this->secret('Admin password (minimum 12 characters)');
    $confirmation = $this->secret('Confirm admin password');

    if ($password !== $confirmation) {
        $this->error('Passwords do not match.');

        return 1;
    }

    $validator = Validator::make(
        ['name' => $name, 'email' => $email, 'password' => $password],
        [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:12'],
        ],
    );

    if ($validator->fails()) {
        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }

        return 1;
    }

    User::updateOrCreate(
        ['email' => $email],
        ['name' => $name, 'password' => $password],
    );

    $this->info('Admin account saved.');

    return 0;
})->purpose('Create or update an admin account without exposing credentials in source code');

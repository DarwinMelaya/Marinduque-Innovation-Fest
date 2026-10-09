<?php

use App\Models\User;

$newAdmin = [
    'name' => 'Test Admin',
    'email' => 'admin@example.com',
    'password' => 'password',
    'password_confirmation' => 'password',
];

test('admin registration screen is open while no admin exists', function () {
    $this->get(route('admin.register'))->assertOk();
});

test('the first admin can register and is logged in', function () use ($newAdmin) {
    $response = $this->post(route('admin.register.store'), $newAdmin);

    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertAuthenticated();

    $admin = User::where('email', 'admin@example.com')->first();
    expect($admin->is_admin)->toBeTrue()
        ->and($admin->hasVerifiedEmail())->toBeTrue();
});

test('guests are sent to login once an admin exists', function () use ($newAdmin) {
    User::factory()->admin()->create();

    $this->get(route('admin.register'))->assertRedirect(route('login'));
    $this->post(route('admin.register.store'), $newAdmin)->assertRedirect(route('login'));

    expect(User::where('email', 'admin@example.com')->exists())->toBeFalse();
});

test('non admin users cannot register admins', function () use ($newAdmin) {
    User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.register'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.register.store'), $newAdmin)->assertForbidden();
});

test('admins can register other admins', function () use ($newAdmin) {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.register.store'), $newAdmin);

    $response->assertRedirect(route('admin.register', absolute: false));
    $this->assertAuthenticatedAs($admin);
    expect(User::where('email', 'admin@example.com')->first()->is_admin)->toBeTrue();
});

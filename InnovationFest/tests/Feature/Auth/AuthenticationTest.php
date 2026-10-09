<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('staff authenticate with their booth name and are sent to their booth', function () {
    $staff = User::factory()->staff('Robotics Den')->create();

    $response = $this->post(route('login.store'), [
        'email' => 'robotics den',
        'password' => 'RoboticsDen123',
    ]);

    $this->assertAuthenticatedAs($staff);
    $response->assertRedirect(route('booth.home', absolute: false));
});

test('staff ignore admin pages they were heading to before logging in', function () {
    User::factory()->staff('Robotics Den')->create();

    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));

    $this->post(route('login.store'), [
        'email' => 'Robotics Den',
        'password' => 'RoboticsDen123',
    ])->assertRedirect(route('booth.home', absolute: false));
});

test('staff can not authenticate with an invalid password', function () {
    User::factory()->staff('Robotics Den')->create();

    $this->post(route('login.store'), [
        'email' => 'Robotics Den',
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});

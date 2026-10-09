<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('booth.home'))->assertRedirect(route('login'));
});

test('staff can visit their booth pages', function () {
    $this->actingAs(User::factory()->staff()->create());

    $this->get(route('booth.home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('boothstaff/BoothHome'));

    $this->get(route('booth.visits'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('boothstaff/BoothListVisits'));
});

test('admins can not visit booth pages', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->get(route('booth.home'))
        ->assertForbidden();
});

test('staff can not visit admin pages', function () {
    $this->actingAs(User::factory()->staff()->create())
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

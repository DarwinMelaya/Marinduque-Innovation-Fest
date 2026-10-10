<?php

use App\Models\BoothVisit;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests and non admins can not see the visitors page', function () {
    $this->get(route('admin.visitors.index'))->assertRedirect(route('login'));

    $this->actingAs(User::factory()->staff()->create())
        ->get(route('admin.visitors.index'))
        ->assertForbidden();
});

test('admins see visit totals and participants ranked by points', function () {
    $booth = User::factory()->staff()->create();
    $juan = Participant::factory()->create(['first_name' => 'Juan', 'last_name' => 'Cruz']);
    $maria = Participant::factory()->create(['first_name' => 'Maria', 'last_name' => 'Santos']);
    Participant::factory()->create();

    BoothVisit::factory()->for($juan)->for($booth, 'booth')->create(['points' => 10]);
    BoothVisit::factory()->for($maria)->for($booth, 'booth')->create(['points' => 10]);
    BoothVisit::factory()->for($maria)->create(['points' => 15]);

    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.visitors.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/VisitorsList')
            ->where('stats', ['visits' => 3, 'visitors' => 2, 'points' => 35])
            ->has('leaderboard', 2)
            ->where('leaderboard.0.name', 'Maria Santos')
            ->where('leaderboard.0.points', 25)
            ->where('leaderboard.0.visits', 2)
            ->where('leaderboard.1.name', 'Juan Cruz')
            ->has('visits.data', 3)
            ->has('booths', 2)
        );
});

test('admins can filter visits by participant and booth', function () {
    $booth = User::factory()->staff('Robotics Den')->create();
    $juan = Participant::factory()->create(['first_name' => 'Juan']);

    BoothVisit::factory()->for($juan)->for($booth, 'booth')->create();
    BoothVisit::factory()->for($juan)->create();
    BoothVisit::factory()->create();

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.visitors.index', ['search' => $juan->fest_id]))
        ->assertInertia(fn (Assert $page) => $page->has('visits.data', 2));

    $this->actingAs($admin)
        ->get(route('admin.visitors.index', ['booth' => $booth->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('visits.data', 1)
            ->where('visits.data.0.boothName', 'Robotics Den')
            ->where('filters.booth', (string) $booth->id)
        );
});

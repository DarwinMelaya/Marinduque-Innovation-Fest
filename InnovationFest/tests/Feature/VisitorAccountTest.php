<?php

use App\Models\BoothVisit;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('participants sign in with their fest ID in any letter case', function () {
    $participant = Participant::factory()->create();

    $this->post(route('visitor.login'), ['fest_id' => ' '.strtolower($participant->fest_id).' '])
        ->assertRedirect(route('visitor.home'));

    $this->assertAuthenticatedAs($participant, 'participant');
});

test('unknown fest IDs are rejected', function () {
    $this->post(route('visitor.login'), ['fest_id' => 'MIF2026-99999'])
        ->assertSessionHasErrors(['fest_id' => 'No participant found for this Innovation Fest ID.']);

    $this->assertGuest('participant');
});

test('guests are sent to the registration page', function () {
    $this->get(route('visitor.home'))->assertRedirect(route('participants.register'));
});

test('participants see only their own visits and total points', function () {
    $participant = Participant::factory()->create(['first_name' => 'Juan']);
    $booth = User::factory()->staff('Robotics Den')->create();

    BoothVisit::factory()->for($participant)->for($booth, 'booth')->create(['points' => 10]);
    BoothVisit::factory()->for($participant)->for($booth, 'booth')->create(['points' => 10, 'visited_on' => '2026-01-01']);
    BoothVisit::factory()->for($participant)->create(['points' => 5]);
    BoothVisit::factory()->create(['points' => 100]);

    $this->actingAs($participant, 'participant')
        ->get(route('visitor.home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('visitors/VisitorsHome')
            ->where('participant.firstName', 'Juan')
            ->where('participant.festId', $participant->fest_id)
            ->where('participant.qrCode', fn (string $src) => str_starts_with($src, 'data:image/png;base64,'))
            ->where('participant.qrTicket', fn (string $src) => str_starts_with($src, 'data:image/png;base64,'))
            ->where('stats.points', 25)
            ->where('stats.visits', 3)
            ->where('stats.booths', 2)
            ->has('visits', 3)
        );
});

test('participants can log out without signing out staff in the same browser', function () {
    $staff = User::factory()->staff()->create();
    $participant = Participant::factory()->create();

    $this->actingAs($staff)
        ->actingAs($participant, 'participant')
        ->post(route('visitor.logout'))
        ->assertRedirect(route('participants.register'));

    $this->assertGuest('participant');
    $this->assertAuthenticatedAs($staff, 'web');
});

test('staff accounts can not open the visitor page', function () {
    $this->actingAs(User::factory()->staff()->create())
        ->get(route('visitor.home'))
        ->assertRedirect(route('participants.register'));
});

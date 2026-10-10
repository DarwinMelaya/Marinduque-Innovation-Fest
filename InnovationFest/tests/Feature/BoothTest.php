<?php

use App\Models\BoothVisit;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('booth.home'))->assertRedirect(route('login'));
});

test('staff can visit their booth pages', function () {
    $this->actingAs(User::factory()->staff()->create());

    $this->get(route('booth.home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('boothstaff/BoothHome'));

    $this->get(route('booth.visits.index'))
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

test('scanning a participant QR code records a visit', function () {
    $staff = User::factory()->staff()->create();
    $participant = Participant::factory()->create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);

    $this->actingAs($staff)
        ->post(route('booth.visits.store'), ['fest_id' => strtolower($participant->fest_id)])
        ->assertRedirect(route('booth.home'))
        ->assertInertiaFlash('visit.name', 'Juan Dela Cruz');

    $visit = BoothVisit::sole();
    expect($visit->user_id)->toBe($staff->id)
        ->and($visit->participant_id)->toBe($participant->id)
        ->and($visit->visited_on)->toBe(BoothVisit::today());
});

test('visits keep the points the booth gave at scan time', function () {
    $staff = User::factory()->staff()->create();
    $staff->forceFill(['scan_points' => 20])->save();

    $this->actingAs($staff)
        ->post(route('booth.visits.store'), ['fest_id' => Participant::factory()->create()->fest_id])
        ->assertInertiaFlash('visit.points', 20);

    $staff->forceFill(['scan_points' => 5])->save();

    expect(BoothVisit::sole()->points)->toBe(20);
});

test('a participant is counted once per booth per day', function () {
    $staff = User::factory()->staff()->create();
    $participant = Participant::factory()->create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);

    $this->actingAs($staff)->post(route('booth.visits.store'), ['fest_id' => $participant->fest_id]);

    $this->actingAs($staff)
        ->post(route('booth.visits.store'), ['fest_id' => $participant->fest_id])
        ->assertSessionHasErrors(['fest_id' => 'Juan Dela Cruz already visited your booth today.']);

    expect(BoothVisit::count())->toBe(1);
});

test('the same participant can visit again the next day and other booths the same day', function () {
    $staff = User::factory()->staff()->create();
    $participant = Participant::factory()->create();

    $this->actingAs($staff)->post(route('booth.visits.store'), ['fest_id' => $participant->fest_id]);

    $this->actingAs(User::factory()->staff()->create())
        ->post(route('booth.visits.store'), ['fest_id' => $participant->fest_id])
        ->assertSessionHasNoErrors();

    $this->travelTo(Carbon::tomorrow(BoothVisit::TIMEZONE)->addHours(9));

    $this->actingAs($staff)
        ->post(route('booth.visits.store'), ['fest_id' => $participant->fest_id])
        ->assertSessionHasNoErrors();

    expect(BoothVisit::count())->toBe(3);
});

test('unknown QR codes are rejected', function () {
    $this->actingAs(User::factory()->staff()->create())
        ->post(route('booth.visits.store'), ['fest_id' => 'MIF2026-99999'])
        ->assertSessionHasErrors(['fest_id' => 'No participant found for this QR code.']);

    expect(BoothVisit::count())->toBe(0);
});

test('admins can not record booth visits', function () {
    $participant = Participant::factory()->create();

    $this->actingAs(User::factory()->admin()->create())
        ->post(route('booth.visits.store'), ['fest_id' => $participant->fest_id])
        ->assertForbidden();
});

test('booth pages only show that booth\'s visits', function () {
    $staff = User::factory()->staff()->create();
    BoothVisit::factory()->for($staff, 'booth')->create();
    BoothVisit::factory()->for($staff, 'booth')->create(['visited_on' => '2026-01-01']);
    BoothVisit::factory()->create();

    $this->actingAs($staff)
        ->get(route('booth.home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.today', 1)
            ->where('stats.total', 2)
            ->has('recentVisits', 1)
        );

    $this->actingAs($staff)
        ->get(route('booth.visits.index'))
        ->assertInertia(fn (Assert $page) => $page->has('visits', 2));
});

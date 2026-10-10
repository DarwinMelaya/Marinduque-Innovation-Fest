<?php

use App\Models\BoothVisit;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    $this->get(route('admin.participants.index'))->assertRedirect(route('login'));
    $this->get(route('admin.staff.index'))->assertRedirect(route('login'));
});

test('non admin users cannot visit the admin pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.dashboard'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.participants.index'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.staff.index'))->assertForbidden();
});

test('admins can visit the registered staff page', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.staff.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/RegisteredStaff'));
});

test('admins can visit the dashboard', function () {
    Participant::factory()->count(2)->create(['municipality' => 'Gasan', 'barangay' => 'Bahi']);
    Participant::factory()->create(['is_pwd' => true]);

    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/AdminDashboard')
            ->where('stats.total', 3)
            ->where('stats.pwd', 1)
            ->where('municipalities.2', ['name' => 'Gasan', 'total' => 2, 'highSchool' => 0, 'college' => 0, 'others' => 2])
            ->has('recentParticipants', 3)
        );
});

test('the dashboard breaks down participants by registration details', function () {
    Participant::factory()->create([
        'age' => 16,
        'sex' => 'Female',
        'education_level' => 'High School',
        'school' => 'Boac National High School',
        'organization' => null,
    ]);
    Participant::factory()->count(2)->create([
        'age' => 20,
        'sex' => 'Male',
        'education_level' => 'College',
        'school' => 'Marinduque State University',
        'course' => 'BS Computer Science',
        'organization' => null,
        'municipality' => 'Gasan',
        'barangay' => 'Bahi',
    ]);
    Participant::factory()->create([
        'age' => 64,
        'sex' => 'Male',
        'agency' => 'DOST Marinduque',
        'organization' => null,
    ]);
    Participant::factory()->create([
        'age' => 40,
        'sex' => 'Female',
        'organization' => 'Provincial Office',
        'created_at' => now()->subDays(20),
    ]);

    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.total', 5)
            ->where('stats.students', 3)
            ->where('stats.lastSevenDays', 4)
            ->where('stats.averageAge', 32)
            ->where('sexes', [
                ['name' => 'Male', 'total' => 3],
                ['name' => 'Female', 'total' => 2],
            ])
            ->where('participantTypes.0', ['name' => 'High School', 'total' => 1])
            ->where('participantTypes.1', ['name' => 'College', 'total' => 2])
            ->where('participantTypes.2', ['name' => 'Professionals & others', 'total' => 2])
            ->where('ageGroups.0', ['name' => '17 & below', 'total' => 1, 'male' => 0, 'female' => 1])
            ->where('ageGroups.1', ['name' => '18-24', 'total' => 2, 'male' => 2, 'female' => 0])
            ->where('ageGroups.3', ['name' => '35-44', 'total' => 1, 'male' => 0, 'female' => 1])
            ->where('ageGroups.5', ['name' => '60 & above', 'total' => 1, 'male' => 1, 'female' => 0])
            ->where('municipalities.2', ['name' => 'Gasan', 'total' => 2, 'highSchool' => 0, 'college' => 2, 'others' => 0])
            ->has('dailyRegistrations', 14)
            ->where('dailyRegistrations.13', ['date' => today()->toDateString(), 'total' => 4])
            ->where('topBarangays', [
                ['name' => 'Malusak (Pob.), Boac', 'total' => 3],
                ['name' => 'Bahi, Gasan', 'total' => 2],
            ])
            ->where('topSchools.0', ['name' => 'Marinduque State University', 'total' => 2])
            ->where('topCourses', [['name' => 'BS Computer Science', 'total' => 2]])
            ->where('topAgencies.0', ['name' => 'DOST Marinduque', 'total' => 1])
        );
});

test('the dashboard charts the participants with the most points', function () {
    $juan = Participant::factory()->create(['first_name' => 'Juan', 'last_name' => 'Cruz']);
    $maria = Participant::factory()->create(['first_name' => 'Maria', 'last_name' => 'Santos']);
    Participant::factory()->create();

    BoothVisit::factory()->for($juan)->create(['points' => 10]);
    BoothVisit::factory()->for($maria)->create(['points' => 10]);
    BoothVisit::factory()->for($maria)->create(['points' => 20]);

    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('topEarners', [
            ['name' => 'Maria Santos', 'total' => 30],
            ['name' => 'Juan Cruz', 'total' => 10],
        ]));
});

test('admins can search registered participants', function () {
    Participant::factory()->create(['first_name' => 'Juan', 'municipality' => 'Gasan', 'barangay' => 'Bahi']);
    Participant::factory()->create(['first_name' => 'Maria']);

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.participants.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/RegisteredParticipants')
            ->has('participants.data', 2)
        );

    $this->actingAs($admin)
        ->get(route('admin.participants.index', ['search' => 'Juan']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('participants.data', 1)
            ->where('participants.data.0.name', fn (string $name) => str_starts_with($name, 'Juan'))
        );

    $this->actingAs($admin)
        ->get(route('admin.participants.index', ['municipality' => 'Boac']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('participants.data', 1)
            ->where('participants.data.0.municipality', 'Boac')
        );
});

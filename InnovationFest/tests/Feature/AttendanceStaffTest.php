<?php

use App\Enums\StaffCategory;
use App\Enums\UserRole;
use App\Models\Attendance;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admins can add attendance staff with zero scan points', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.staff.store'), [
            'booth_name' => 'Main Gate',
            'name' => 'Ana Reyes',
            'scan_points' => 50,
            'category' => 'attendance',
        ])
        ->assertRedirect(route('admin.staff.index'));

    $staff = User::where('role', UserRole::Staff)->sole();

    expect($staff->booth_name)->toBe('Main Gate')
        ->and($staff->category)->toBe(StaffCategory::Attendance)
        ->and($staff->scan_points)->toBe(0)
        ->and($staff->isAttendanceStaff())->toBeTrue()
        ->and($staff->isBoothStaff())->toBeFalse();
});

test('attendance staff land on the attendance home after login', function () {
    $staff = User::factory()->staff('Main Gate')->create([
        'category' => StaffCategory::Attendance,
    ]);

    $this->post(route('login.store'), [
        'email' => 'Main Gate',
        'password' => User::staffPassword('Main Gate'),
    ])->assertRedirect(route('attendance.home'));

    $this->actingAs($staff)
        ->get(route('attendance.home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('attendancestaff/AttendanceHome')
            ->where('stats.presentToday', 0)
        );
});

test('attendance staff can not open booth pages', function () {
    $staff = User::factory()->staff('Main Gate')->create([
        'category' => StaffCategory::Attendance,
    ]);

    $this->actingAs($staff)
        ->get(route('booth.home'))
        ->assertForbidden();
});

test('booth staff can not open attendance pages', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('attendance.home'))
        ->assertForbidden();
});

test('attendance staff can check a participant in', function () {
    $staff = User::factory()->staff('Main Gate')->create([
        'category' => StaffCategory::Attendance,
    ]);
    $participant = Participant::factory()->create();

    $this->actingAs($staff)
        ->post(route('attendance.check-in'), ['fest_id' => $participant->fest_id])
        ->assertRedirect();

    expect(Attendance::query()->where('participant_id', $participant->id)->exists())->toBeTrue();
});

test('attendance staff can not check the same participant in twice in one day', function () {
    $staff = User::factory()->staff('Main Gate')->create([
        'category' => StaffCategory::Attendance,
    ]);
    $participant = Participant::factory()->create();

    Attendance::query()->create([
        'participant_id' => $participant->id,
        'attended_on' => Attendance::today(),
    ]);

    $this->actingAs($staff)
        ->post(route('attendance.check-in'), ['fest_id' => $participant->fest_id])
        ->assertSessionHasErrors('fest_id');
});

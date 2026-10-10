<?php

use App\Enums\UserRole;
use App\Models\BoothVisit;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('admins can see the staff list with default passwords', function () {
    User::factory()->staff('DOST Booth')->create(['name' => 'Maria Santos']);

    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.staff.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/RegisteredStaff')
            ->has('staff', 1)
            ->where('staff.0.boothName', 'DOST Booth')
            ->where('staff.0.name', 'Maria Santos')
            ->where('staff.0.password', 'DOSTBooth123')
        );
});

test('admins can add staff as users with a password generated from the booth name', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.staff.store'), [
            'booth_name' => 'Robotics Den',
            'name' => 'Juan Dela Cruz',
            'scan_points' => 15,
        ])
        ->assertRedirect(route('admin.staff.index'));

    $staff = User::where('role', UserRole::Staff)->sole();
    expect($staff->booth_name)->toBe('Robotics Den')
        ->and($staff->name)->toBe('Juan Dela Cruz')
        ->and($staff->scan_points)->toBe(15)
        ->and($staff->email)->toBeNull()
        ->and($staff->hasVerifiedEmail())->toBeTrue()
        ->and(Hash::check('RoboticsDen123', $staff->password))->toBeTrue();
});

test('each booth can only have one staff account', function () {
    User::factory()->staff('Robotics Den')->create();

    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.staff.store'), [
            'booth_name' => 'Robotics Den',
            'name' => 'Juan Dela Cruz',
        ])
        ->assertSessionHasErrors('booth_name');
});

test('booth name and staff name are required', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.staff.store'), [])
        ->assertSessionHasErrors(['booth_name', 'name', 'scan_points']);
});

test('admins can edit a staff member without changing the password', function () {
    $staff = User::factory()->staff('DOST Booth')->create(['name' => 'Maria Santos']);

    $this->actingAs(User::factory()->admin()->create())
        ->patch(route('admin.staff.update', $staff), [
            'booth_name' => 'DOST Booth',
            'name' => 'Juan Dela Cruz',
            'scan_points' => 25,
        ])
        ->assertRedirect(route('admin.staff.index'));

    $staff->refresh();
    expect($staff->name)->toBe('Juan Dela Cruz')
        ->and($staff->scan_points)->toBe(25)
        ->and(Hash::check('DOSTBooth123', $staff->password))->toBeTrue();
});

test('renaming a booth resets the password to the new booth default', function () {
    $staff = User::factory()->staff('DOST Booth')->create();

    $this->actingAs(User::factory()->admin()->create())
        ->patch(route('admin.staff.update', $staff), [
            'booth_name' => 'Robotics Den',
            'name' => $staff->name,
            'scan_points' => 10,
        ])
        ->assertRedirect(route('admin.staff.index'));

    $staff->refresh();
    expect($staff->booth_name)->toBe('Robotics Den')
        ->and(Hash::check('RoboticsDen123', $staff->password))->toBeTrue();
});

test('a booth can not be renamed to another booth that already has staff', function () {
    User::factory()->staff('Robotics Den')->create();
    $staff = User::factory()->staff('DOST Booth')->create();

    $this->actingAs(User::factory()->admin()->create())
        ->patch(route('admin.staff.update', $staff), [
            'booth_name' => 'Robotics Den',
            'name' => $staff->name,
            'scan_points' => 10,
        ])
        ->assertSessionHasErrors('booth_name');
});

test('scan points must be a whole number within range', function (mixed $points) {
    $staff = User::factory()->staff('DOST Booth')->create();

    $this->actingAs(User::factory()->admin()->create())
        ->patch(route('admin.staff.update', $staff), [
            'booth_name' => 'DOST Booth',
            'name' => $staff->name,
            'scan_points' => $points,
        ])
        ->assertSessionHasErrors('scan_points');
})->with([-1, 1.5, User::MAX_SCAN_POINTS + 1, 'abc']);

test('only staff accounts can be edited or deleted', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch(route('admin.staff.update', $admin), [
            'booth_name' => 'DOST Booth',
            'name' => 'Admin',
            'scan_points' => 25,
        ])
        ->assertNotFound();

    $this->actingAs($admin)
        ->delete(route('admin.staff.destroy', $admin))
        ->assertNotFound();

    expect($admin->fresh())->not->toBeNull();
});

test('staff can not edit or delete staff accounts', function () {
    $staff = User::factory()->staff('DOST Booth')->create();

    $this->actingAs($staff)
        ->patch(route('admin.staff.update', $staff), [
            'booth_name' => 'DOST Booth',
            'name' => $staff->name,
            'scan_points' => 999,
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->delete(route('admin.staff.destroy', $staff))
        ->assertForbidden();

    expect($staff->fresh()->scan_points)->toBe(0);
});

test('admins can delete a staff member along with their booth visits', function () {
    $staff = User::factory()->staff()->create();
    $visit = BoothVisit::factory()->for($staff, 'booth')->create();

    $this->actingAs(User::factory()->admin()->create())
        ->delete(route('admin.staff.destroy', $staff))
        ->assertRedirect(route('admin.staff.index'));

    expect($staff->fresh())->toBeNull()
        ->and($visit->fresh())->toBeNull();
});

test('non admins cannot add staff', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.staff.store'), [
            'booth_name' => 'Robotics Den',
            'name' => 'Juan Dela Cruz',
        ])
        ->assertForbidden();

    expect(User::where('role', UserRole::Staff)->exists())->toBeFalse();
});

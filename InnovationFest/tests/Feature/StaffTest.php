<?php

use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('admins can see the staff list with default passwords', function () {
    Staff::factory()->create(['booth_name' => 'DOST Booth', 'name' => 'Maria Santos']);

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

test('admins can add staff with a password generated from the booth name', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.staff.store'), [
            'booth_name' => 'Robotics Den',
            'name' => 'Juan Dela Cruz',
        ])
        ->assertRedirect(route('admin.staff.index'));

    $staff = Staff::sole();
    expect($staff->booth_name)->toBe('Robotics Den')
        ->and($staff->name)->toBe('Juan Dela Cruz')
        ->and(Hash::check('RoboticsDen123', $staff->password))->toBeTrue();
});

test('each booth can only have one staff account', function () {
    Staff::factory()->create(['booth_name' => 'Robotics Den']);

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
        ->assertSessionHasErrors(['booth_name', 'name']);
});

test('non admins cannot add staff', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.staff.store'), [
            'booth_name' => 'Robotics Den',
            'name' => 'Juan Dela Cruz',
        ])
        ->assertForbidden();

    expect(Staff::count())->toBe(0);
});

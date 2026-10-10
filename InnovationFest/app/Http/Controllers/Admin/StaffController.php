<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    /**
     * List the booth staff accounts.
     */
    public function index(): Response
    {
        return Inertia::render('admin/RegisteredStaff', [
            'staff' => User::query()
                ->where('role', UserRole::Staff)
                ->latest()
                ->latest('id')
                ->get()
                ->map(fn (User $staff) => [
                    'id' => $staff->id,
                    'boothName' => $staff->booth_name,
                    'name' => $staff->name,
                    'password' => User::staffPassword($staff->booth_name),
                    'scanPoints' => $staff->scan_points,
                    'createdAt' => $staff->created_at?->toIso8601String(),
                ]),
        ]);
    }

    /**
     * Change how many points a participant earns when this booth scans them. Past visits keep the points they earned.
     */
    public function update(Request $request, User $staff): RedirectResponse
    {
        abort_unless($staff->isStaff(), 404);

        $validated = $request->validate([
            'scan_points' => ['required', 'integer', 'min:0', 'max:'.User::MAX_SCAN_POINTS],
        ]);

        $staff->forceFill($validated)->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$staff->booth_name} now gives {$staff->scan_points} points per scan.",
        ]);

        return to_route('admin.staff.index');
    }

    /**
     * Create a booth staff account with the booth's default password.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'booth_name' => ['required', 'string', 'max:100', Rule::unique(User::class)],
            'name' => ['required', 'string', 'max:255'],
            'scan_points' => ['required', 'integer', 'min:0', 'max:'.User::MAX_SCAN_POINTS],
        ], [
            'booth_name.unique' => 'This booth already has a staff account.',
        ]);

        $password = User::staffPassword($validated['booth_name']);

        User::forceCreate([
            ...$validated,
            'password' => $password,
            'role' => UserRole::Staff,
            'email_verified_at' => now(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Staff added. Password: {$password}",
        ]);

        return to_route('admin.staff.index');
    }
}

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
                    'createdAt' => $staff->created_at?->toIso8601String(),
                ]),
        ]);
    }

    /**
     * Create a booth staff account with the booth's default password.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'booth_name' => ['required', 'string', 'max:100', Rule::unique(User::class)],
            'name' => ['required', 'string', 'max:255'],
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

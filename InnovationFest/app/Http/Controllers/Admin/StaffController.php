<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Staff;
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
            'staff' => Staff::query()
                ->latest()
                ->latest('id')
                ->get()
                ->map(fn (Staff $staff) => [
                    'id' => $staff->id,
                    'boothName' => $staff->booth_name,
                    'name' => $staff->name,
                    'password' => Staff::defaultPassword($staff->booth_name),
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
            'booth_name' => ['required', 'string', 'max:100', Rule::unique(Staff::class)],
            'name' => ['required', 'string', 'max:255'],
        ], [
            'booth_name.unique' => 'This booth already has a staff account.',
        ]);

        $password = Staff::defaultPassword($validated['booth_name']);

        Staff::create([...$validated, 'password' => $password]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Staff added. Password: {$password}",
        ]);

        return to_route('admin.staff.index');
    }
}

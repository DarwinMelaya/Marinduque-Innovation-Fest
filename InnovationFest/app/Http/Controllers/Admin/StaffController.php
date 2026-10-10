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
                ->withCount('boothVisits')
                ->latest()
                ->latest('id')
                ->get()
                ->map(fn (User $staff) => [
                    'id' => $staff->id,
                    'boothName' => $staff->booth_name,
                    'name' => $staff->name,
                    'password' => User::staffPassword($staff->booth_name),
                    'scanPoints' => $staff->scan_points,
                    'visits' => $staff->booth_visits_count,
                    'createdAt' => $staff->created_at?->toIso8601String(),
                ]),
        ]);
    }

    /**
     * Create a booth staff account with the booth's default password.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules(), $this->messages());

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

    /**
     * Update a booth staff account. Renaming the booth resets the password to the new booth's default.
     * Past visits keep the points they earned.
     */
    public function update(Request $request, User $staff): RedirectResponse
    {
        abort_unless($staff->isStaff(), 404);

        $validated = $request->validate($this->rules($staff), $this->messages());

        $staff->forceFill($validated);

        $boothRenamed = $staff->isDirty('booth_name');

        if ($boothRenamed) {
            $staff->password = User::staffPassword($staff->booth_name);
        }

        $staff->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $boothRenamed
                ? "{$staff->booth_name} updated. New password: ".User::staffPassword($staff->booth_name)
                : "{$staff->booth_name} updated.",
        ]);

        return to_route('admin.staff.index');
    }

    /**
     * Delete a booth staff account along with the visits recorded at that booth.
     */
    public function destroy(User $staff): RedirectResponse
    {
        abort_unless($staff->isStaff(), 404);

        $staff->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$staff->booth_name} deleted.",
        ]);

        return to_route('admin.staff.index');
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function rules(?User $staff = null): array
    {
        return [
            'booth_name' => ['required', 'string', 'max:100', Rule::unique(User::class)->ignore($staff)],
            'name' => ['required', 'string', 'max:255'],
            'scan_points' => ['required', 'integer', 'min:0', 'max:'.User::MAX_SCAN_POINTS],
        ];
    }

    /**
     * @return array<string, string>
     */
    private function messages(): array
    {
        return [
            'booth_name.unique' => 'This booth already has a staff account.',
        ];
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminRegisterController extends Controller
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Show the admin registration page.
     */
    public function create(Request $request): Response
    {
        $this->ensureCanRegister($request);

        return Inertia::render('auth/admin-register', [
            'isFirstAdmin' => ! User::adminExists(),
        ]);
    }

    /**
     * Register a new admin account.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->ensureCanRegister($request);

        $validated = $request->validate([
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ]);

        $user = User::create($validated);
        $user->forceFill([
            'is_admin' => true,
            'email_verified_at' => now(),
        ])->save();

        if (! Auth::check()) {
            Auth::login($user);
            $request->session()->regenerate();

            return to_route('dashboard');
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Admin account created.')]);

        return to_route('admin.register');
    }

    /**
     * Anyone may create the first admin; after that, only admins may add more.
     */
    private function ensureCanRegister(Request $request): void
    {
        if (! User::adminExists()) {
            return;
        }

        if ($request->user() === null) {
            throw new AuthenticationException(redirectTo: route('login'));
        }

        abort_unless($request->user()->is_admin, 403);
    }
}

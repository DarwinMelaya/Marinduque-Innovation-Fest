<?php

use App\Http\Controllers\Auth\AdminRegisterController;
use App\Http\Controllers\ParticipantRegistrationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'public/LandingPage')->name('home');

Route::get('register', [ParticipantRegistrationController::class, 'create'])->name('participants.register');
Route::post('register', [ParticipantRegistrationController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('participants.register.store');

Route::get('admin/register', [AdminRegisterController::class, 'create'])->name('admin.register');
Route::post('admin/register', [AdminRegisterController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('admin.register.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ParticipantController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\VisitorController;
use App\Http\Controllers\Auth\AdminRegisterController;
use App\Http\Controllers\Booth\HomeController as BoothHomeController;
use App\Http\Controllers\Booth\VisitController;
use App\Http\Controllers\ParticipantRegistrationController;
use App\Http\Controllers\Visitor\AccountController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'public/LandingPage')->name('home');

Route::get('register', [ParticipantRegistrationController::class, 'create'])->name('participants.register');
Route::post('register', [ParticipantRegistrationController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('participants.register.store');

Route::post('visitor/login', [AccountController::class, 'store'])
    ->middleware('throttle:30,1')
    ->name('visitor.login');

Route::middleware('auth:participant')
    ->prefix('visitor')
    ->name('visitor.')
    ->group(function () {
        Route::get('/', [AccountController::class, 'show'])->name('home');
        Route::post('logout', [AccountController::class, 'destroy'])->name('logout');
    });

Route::get('admin/register', [AdminRegisterController::class, 'create'])->name('admin.register');
Route::post('admin/register', [AdminRegisterController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('admin.register.store');

Route::middleware(['auth', 'verified', 'can:access-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('participants', [ParticipantController::class, 'index'])->name('participants.index');
        Route::get('visitors', [VisitorController::class, 'index'])->name('visitors.index');
        Route::get('staff', [StaffController::class, 'index'])->name('staff.index');
        Route::post('staff', [StaffController::class, 'store'])->name('staff.store');
        Route::patch('staff/{staff}', [StaffController::class, 'update'])->name('staff.update');
        Route::delete('staff/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy');
    });

Route::middleware(['auth', 'can:access-booth'])
    ->prefix('booth')
    ->name('booth.')
    ->group(function () {
        Route::get('/', BoothHomeController::class)->name('home');
        Route::get('visits', [VisitController::class, 'index'])->name('visits.index');
        Route::post('visits', [VisitController::class, 'store'])
            ->middleware('throttle:60,1')
            ->name('visits.store');
    });

require __DIR__.'/settings.php';

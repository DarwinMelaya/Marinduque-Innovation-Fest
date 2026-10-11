<?php

use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\BonusCodeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EvaluationController;
use App\Http\Controllers\Admin\ParticipantController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\VisitorController;
use App\Http\Controllers\Auth\AdminRegisterController;
use App\Http\Controllers\Booth\HomeController as BoothHomeController;
use App\Http\Controllers\Booth\VisitController;
use App\Http\Controllers\ParticipantRegistrationController;
use App\Http\Controllers\Visitor\AccountController;
use App\Http\Controllers\Visitor\ActivityEvaluationController;
use App\Http\Controllers\Visitor\BonusCodeController as VisitorBonusCodeController;
use App\Http\Controllers\Visitor\EvaluationController as VisitorEvaluationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'public/LandingPage')->name('home');

foreach ([
    'ihub-launching' => 'IhubLaunching',
    'forums-panel-discussions' => 'ForumsPanelDiscussions',
    'hackathon' => 'Hackton',
    'idea-pitching' => 'IdeaPitching',
    'e-games' => 'Egames',
    'kuwentolohiya' => 'Kunwentolohiya',
    'exhibits' => 'Exhibits',
    'closing-awarding' => 'ClosingAwardings',
] as $slug => $page) {
    Route::inertia("events/{$slug}", "public/events/{$page}")->name("events.{$slug}");
}

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
        Route::post('bonus', [VisitorBonusCodeController::class, 'store'])
            ->middleware('throttle:20,1')
            ->name('bonus.store');
        Route::get('evaluation', [VisitorEvaluationController::class, 'show'])->name('evaluation.show');
        Route::post('evaluation', [VisitorEvaluationController::class, 'store'])
            ->middleware('throttle:10,1')
            ->name('evaluation.store');
        Route::get('forums/{visit}/evaluation', [ActivityEvaluationController::class, 'show'])->name('activity-evaluation.show');
        Route::post('forums/{visit}/evaluation', [ActivityEvaluationController::class, 'store'])
            ->middleware('throttle:10,1')
            ->name('activity-evaluation.store');
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
        Route::post('attendance', [AttendanceController::class, 'store'])
            ->middleware('throttle:60,1')
            ->name('attendance.store');
        Route::get('participants', [ParticipantController::class, 'index'])->name('participants.index');
        Route::get('participants/{participant}/qr', [ParticipantController::class, 'qr'])->name('participants.qr');
        Route::get('qr-codes', [BonusCodeController::class, 'index'])->name('qr-codes.index');
        Route::post('qr-codes', [BonusCodeController::class, 'store'])->name('qr-codes.store');
        Route::get('qr-codes/{batch}/print', [BonusCodeController::class, 'print'])->name('qr-codes.print');
        Route::delete('qr-codes/{batch}', [BonusCodeController::class, 'destroy'])->name('qr-codes.destroy');
        Route::get('visitors', [VisitorController::class, 'index'])->name('visitors.index');
        Route::get('evaluations', [EvaluationController::class, 'index'])->name('evaluations.index');
        Route::patch('evaluations', [EvaluationController::class, 'update'])->name('evaluations.update');
        Route::patch('evaluations/forums', [EvaluationController::class, 'updateForumPoints'])->name('evaluations.forums.update');
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

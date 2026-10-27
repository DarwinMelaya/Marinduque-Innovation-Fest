<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Attendance staff home: scan participant QR codes for daily check-in.
     */
    public function __invoke(): Response
    {
        return Inertia::render('attendancestaff/AttendanceHome', [
            'stats' => [
                'presentToday' => Attendance::query()
                    ->where('attended_on', Attendance::today())
                    ->count(),
            ],
        ]);
    }
}

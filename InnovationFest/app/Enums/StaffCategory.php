<?php

namespace App\Enums;

enum StaffCategory: string
{
    case Booth = 'booth';
    case Forum = 'forum';
    case Attendance = 'attendance';

    public function label(): string
    {
        return match ($this) {
            self::Booth => 'Booth',
            self::Forum => 'Forums',
            self::Attendance => 'Attendance',
        };
    }

    /** Booth and forum staff scan visitors for points; attendance staff only check people in. */
    public function scansVisits(): bool
    {
        return $this !== self::Attendance;
    }
}

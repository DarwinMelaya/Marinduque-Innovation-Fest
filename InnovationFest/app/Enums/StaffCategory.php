<?php

namespace App\Enums;

enum StaffCategory: string
{
    case Booth = 'booth';
    case Forum = 'forum';

    public function label(): string
    {
        return match ($this) {
            self::Booth => 'Booth',
            self::Forum => 'Forums',
        };
    }
}

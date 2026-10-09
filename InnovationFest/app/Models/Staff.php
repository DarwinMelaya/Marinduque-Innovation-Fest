<?php

namespace App\Models;

use Database\Factories\StaffFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Booth staff who man an exhibit booth during the festival.
 *
 * @property int $id
 * @property string $booth_name
 * @property string $name
 * @property string $password
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['booth_name', 'name', 'password'])]
#[Hidden(['password'])]
class Staff extends Model
{
    /** @use HasFactory<StaffFactory> */
    use HasFactory;

    /**
     * The default password for a booth: its name without spaces, followed by "123".
     */
    public static function defaultPassword(string $boothName): string
    {
        return preg_replace('/\s+/', '', $boothName).'123';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}

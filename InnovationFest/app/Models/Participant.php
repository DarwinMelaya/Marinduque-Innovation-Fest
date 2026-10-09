<?php

namespace App\Models;

use App\Support\FestQrCode;
use Database\Factories\ParticipantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $fest_id
 * @property string $first_name
 * @property string $last_name
 * @property int $age
 * @property string $sex
 * @property bool $is_pwd
 * @property bool $is_indigenous
 * @property bool $is_senior_citizen
 * @property bool $is_4ps_member
 * @property string $municipality
 * @property string $barangay
 * @property string|null $education_level
 * @property string|null $school
 * @property string|null $course
 * @property string|null $agency
 * @property string|null $organization
 * @property string $contact_number
 * @property string $email
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'first_name',
    'last_name',
    'age',
    'sex',
    'is_pwd',
    'is_indigenous',
    'is_senior_citizen',
    'is_4ps_member',
    'municipality',
    'barangay',
    'education_level',
    'school',
    'course',
    'agency',
    'organization',
    'contact_number',
    'email',
])]
class Participant extends Model
{
    /** @use HasFactory<ParticipantFactory> */
    use HasFactory;

    public const SEXES = ['Male', 'Female'];

    public const EDUCATION_LEVELS = ['High School', 'College'];

    protected static function booted(): void
    {
        static::created(function (Participant $participant) {
            $participant->forceFill([
                'fest_id' => 'MIF2026-'.str_pad((string) $participant->id, 5, '0', STR_PAD_LEFT),
            ])->saveQuietly();
        });
    }

    /**
     * Render the participant's Innovation Fest ID as a QR code PNG.
     */
    public function qrCodePng(int $size = 600): string
    {
        return FestQrCode::png($this->fest_id, $size);
    }

    /**
     * Render the downloadable pass: the QR code with the ID and name below it.
     */
    public function qrTicketPng(): string
    {
        return FestQrCode::ticketPng($this->fest_id, $this->fullName());
    }

    public function fullName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'is_pwd' => 'boolean',
            'is_indigenous' => 'boolean',
            'is_senior_citizen' => 'boolean',
            'is_4ps_member' => 'boolean',
        ];
    }
}

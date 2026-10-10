<?php

namespace App\Models;

use App\Support\FestQrCode;
use Database\Factories\ParticipantFactory;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

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
class Participant extends Model implements AuthenticatableContract
{
    /** @use HasFactory<ParticipantFactory> */
    use Authenticatable, HasFactory;

    /**
     * Participants have no password; they sign in with their fest ID only, so there is no "remember me" token either.
     */
    public function getRememberTokenName(): string
    {
        return '';
    }

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

    /**
     * Find a participant by the fest ID printed on, or encoded in, their QR code.
     */
    public static function findByFestId(string $festId): ?self
    {
        return static::query()->where('fest_id', Str::upper(trim($festId)))->first();
    }

    /**
     * Participants who earned any points, highest total first, with `points` (booth visits plus bonus codes)
     * and `visits` loaded.
     *
     * @param  Builder<Participant>  $query
     */
    #[Scope]
    protected function rankedByPoints(Builder $query): void
    {
        $visitPoints = BoothVisit::query()
            ->selectRaw('coalesce(sum(booth_visits.points), 0)')
            ->whereColumn('booth_visits.participant_id', 'participants.id');

        $bonusPoints = BonusCode::query()
            ->join('bonus_code_batches', 'bonus_code_batches.id', '=', 'bonus_codes.bonus_code_batch_id')
            ->selectRaw('coalesce(sum(bonus_code_batches.points), 0)')
            ->whereColumn('bonus_codes.participant_id', 'participants.id');

        $query->where(fn (Builder $query) => $query->has('boothVisits')->orHas('bonusCodes'))
            ->select('participants.*')
            ->selectRaw("({$visitPoints->toSql()}) + ({$bonusPoints->toSql()}) as points")
            ->withCount('boothVisits as visits')
            ->orderByDesc('points')
            ->orderByDesc('visits')
            ->orderBy('id');
    }

    /**
     * Booths that scanned this participant.
     *
     * @return HasMany<BoothVisit, $this>
     */
    public function boothVisits(): HasMany
    {
        return $this->hasMany(BoothVisit::class);
    }

    /**
     * @return HasMany<Attendance, $this>
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Bonus QR codes this participant scanned.
     *
     * @return HasMany<BonusCode, $this>
     */
    public function bonusCodes(): HasMany
    {
        return $this->hasMany(BonusCode::class);
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

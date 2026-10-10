<?php

namespace App\Models;

use Database\Factories\BoothVisitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $participant_id
 * @property string $visited_on Y-m-d in Philippine time; kept uncast so it matches the unique index exactly.
 * @property int $points Booth's scan points at the time of the visit, so later edits don't rewrite past earnings.
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'participant_id', 'visited_on', 'points'])]
class BoothVisit extends Model
{
    /** @use HasFactory<BoothVisitFactory> */
    use HasFactory;

    /**
     * The fest runs in Marinduque, so "once per day" follows Philippine time rather than the app's UTC clock.
     */
    public const TIMEZONE = 'Asia/Manila';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'points' => 'integer',
        ];
    }

    public static function today(): string
    {
        return now(self::TIMEZONE)->toDateString();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function booth(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}

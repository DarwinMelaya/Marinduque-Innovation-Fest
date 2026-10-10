<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Daily fest attendance; one row per participant per Philippine-time day.
 *
 * @property int $id
 * @property int $participant_id
 * @property string $attended_on Y-m-d in Philippine time.
 */
#[Fillable(['participant_id', 'attended_on'])]
class Attendance extends Model
{
    public static function today(): string
    {
        return BoothVisit::today();
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}

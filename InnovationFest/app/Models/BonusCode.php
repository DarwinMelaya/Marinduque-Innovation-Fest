<?php

namespace App\Models;

use Database\Factories\BonusCodeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * A single-use QR code that gives the first participant who scans it the batch's points.
 *
 * @property int $id
 * @property int $bonus_code_batch_id
 * @property string $code
 * @property int|null $participant_id
 * @property Carbon|null $redeemed_at Stays set even if the participant is deleted, so the code can never be reused.
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class BonusCode extends Model
{
    /** @use HasFactory<BonusCodeFactory> */
    use HasFactory;

    public const PREFIX = 'MIFB-';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'redeemed_at' => 'datetime',
        ];
    }

    /**
     * Normalize a typed or scanned code: trimmed, uppercase, and without any URL in front of it.
     */
    public static function normalize(string $code): string
    {
        return Str::upper(Str::afterLast(trim($code), '/'));
    }

    /**
     * Give the code to the participant. Returns false if someone already scanned it, even at the same instant.
     */
    public function redeemFor(Participant $participant): bool
    {
        $claimed = static::query()
            ->whereKey($this->id)
            ->whereNull('redeemed_at')
            ->update([
                'participant_id' => $participant->id,
                'redeemed_at' => now(),
            ]);

        if ($claimed === 1) {
            $this->refresh();
        }

        return $claimed === 1;
    }

    /**
     * @return BelongsTo<BonusCodeBatch, $this>
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(BonusCodeBatch::class, 'bonus_code_batch_id');
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}

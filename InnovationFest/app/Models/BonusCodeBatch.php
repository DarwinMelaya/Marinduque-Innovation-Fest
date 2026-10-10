<?php

namespace App\Models;

use Database\Factories\BonusCodeBatchFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A set of single-use bonus QR codes generated together, all worth the same points.
 *
 * @property int $id
 * @property string $label
 * @property int $points
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['label', 'points'])]
class BonusCodeBatch extends Model
{
    /** @use HasFactory<BonusCodeBatchFactory> */
    use HasFactory;

    public const MAX_QUANTITY = 500;

    /** Unambiguous characters only, so a code typed by hand is never misread (no 0/O or 1/I). */
    private const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    private const CODE_LENGTH = 10;

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

    /**
     * Add the given number of new, unredeemed codes to the batch.
     */
    public function generateCodes(int $quantity): void
    {
        $codes = [];

        while (count($codes) < $quantity) {
            $codes[self::randomCode()] = true;
        }

        $now = now();

        foreach (array_chunk(array_keys($codes), 100) as $chunk) {
            BonusCode::insert(array_map(fn (string $code) => [
                'bonus_code_batch_id' => $this->id,
                'code' => $code,
                'created_at' => $now,
                'updated_at' => $now,
            ], $chunk));
        }
    }

    /**
     * @return HasMany<BonusCode, $this>
     */
    public function codes(): HasMany
    {
        return $this->hasMany(BonusCode::class);
    }

    private static function randomCode(): string
    {
        $characters = '';

        for ($i = 0; $i < self::CODE_LENGTH; $i++) {
            $characters .= self::CODE_ALPHABET[random_int(0, strlen(self::CODE_ALPHABET) - 1)];
        }

        return BonusCode::PREFIX.$characters;
    }
}

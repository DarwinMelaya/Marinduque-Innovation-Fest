<?php

namespace Database\Factories;

use App\Models\BonusCode;
use App\Models\BonusCodeBatch;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BonusCode>
 */
class BonusCodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bonus_code_batch_id' => BonusCodeBatch::factory(),
            'code' => BonusCode::PREFIX.strtoupper(fake()->unique()->bothify('??????####')),
        ];
    }

    public function redeemedBy(Participant $participant): static
    {
        return $this->state([
            'participant_id' => $participant->id,
            'redeemed_at' => now(),
        ]);
    }
}

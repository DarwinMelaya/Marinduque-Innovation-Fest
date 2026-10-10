<?php

namespace Database\Factories;

use App\Models\BonusCodeBatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BonusCodeBatch>
 */
class BonusCodeBatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => fake()->words(2, true),
            'points' => 20,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\BoothVisit;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BoothVisit>
 */
class BoothVisitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->staff(),
            'participant_id' => Participant::factory(),
            'visited_on' => BoothVisit::today(),
            'points' => 10,
        ];
    }
}

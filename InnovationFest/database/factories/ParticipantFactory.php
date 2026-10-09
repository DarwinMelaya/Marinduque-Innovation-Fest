<?php

namespace Database\Factories;

use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Participant>
 */
class ParticipantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'age' => fake()->numberBetween(15, 70),
            'sex' => fake()->randomElement(Participant::SEXES),
            'is_pwd' => false,
            'is_indigenous' => false,
            'is_senior_citizen' => false,
            'is_4ps_member' => false,
            'municipality' => 'Boac',
            'barangay' => 'Malusak (Pob.)',
            'education_level' => null,
            'school' => null,
            'course' => null,
            'agency' => null,
            'organization' => fake()->company(),
            'contact_number' => '09'.fake()->numerify('#########'),
            'email' => fake()->unique()->safeEmail(),
        ];
    }
}

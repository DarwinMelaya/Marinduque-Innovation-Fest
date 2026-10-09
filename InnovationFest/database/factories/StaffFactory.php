<?php

namespace Database\Factories;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Staff>
 */
class StaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $boothName = fake()->unique()->company();

        return [
            'booth_name' => $boothName,
            'name' => fake()->name(),
            'password' => Staff::defaultPassword($boothName),
        ];
    }
}

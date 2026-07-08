<?php

namespace Database\Factories;

use App\Models\Township;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Township>
 */
class TownshipFactory extends Factory
{
    /**
     * @var list<string>
     */
    private static array $names = [
        'Aungmyethazan',
        'Chanayethazan',
        'Maha Aungmye',
        'Chanmyathazi',
        'Pyigyidagun',
        'Amarapura',
        'Patheingyi',
    ];

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(self::$names),
        ];
    }
}

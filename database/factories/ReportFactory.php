<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\Category;
use App\Models\Report;
use App\Models\Township;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'township_id' => fn (): int => Township::query()->inRandomOrder()->value('id')
                ?? Township::factory()->create()->id,
            'type' => fake()->randomElement(ReportType::cases()),
            'status' => ReportStatus::Open,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'ward' => fake()->optional()->bothify('Ward ##'),
            'photo' => null,
            'date_occurred' => fake()->dateTimeBetween('-30 days'),
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\Township;
use Illuminate\Database\Seeder;

class TownshipSeeder extends Seeder
{
    /**
     * @var list<string>
     */
    private array $townships = [
        'Aungmyethazan',
        'Chanayethazan',
        'Maha Aungmye',
        'Chanmyathazi',
        'Pyigyidagun',
        'Amarapura',
        'Patheingyi',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->townships as $name) {
            Township::query()->firstOrCreate(['name' => $name]);
        }
    }
}

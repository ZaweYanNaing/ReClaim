<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
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
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('townships', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        $now = now();

        DB::table('townships')->insert(
            collect($this->townships)
                ->map(fn (string $name): array => [
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
                ->all(),
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('townships');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @var array<string, string>
     */
    private array $legacyTownshipMap = [
        'aungmyethazan' => 'Aungmyethazan',
        'chanayethazan' => 'Chanayethazan',
        'maha_aungmye' => 'Maha Aungmye',
        'chanmyathazi' => 'Chanmyathazi',
        'pyigyidagun' => 'Pyigyidagun',
        'amarapura' => 'Amarapura',
        'patheingyi' => 'Patheingyi',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->foreignId('township_id')
                ->nullable()
                ->after('category_id')
                ->constrained()
                ->restrictOnDelete();
            $table->string('ward')->nullable()->after('township_id');
        });

        $townshipIdsByName = DB::table('townships')->pluck('id', 'name');

        DB::table('reports')
            ->select(['id', 'township'])
            ->orderBy('id')
            ->chunkById(100, function ($reports) use ($townshipIdsByName): void {
                foreach ($reports as $report) {
                    $townshipName = $this->legacyTownshipMap[$report->township] ?? null;

                    if ($townshipName === null) {
                        continue;
                    }

                    DB::table('reports')
                        ->where('id', $report->id)
                        ->update(['township_id' => $townshipIdsByName[$townshipName]]);
                }
            });

        DB::table('reports')
            ->whereNull('township_id')
            ->update(['township_id' => $townshipIdsByName->first()]);

        DB::table('reports')
            ->where('status', 'matched')
            ->update(['status' => 'pending_claim']);

        DB::table('reports')
            ->where('status', 'closed')
            ->update(['status' => 'resolved']);

        Schema::table('reports', function (Blueprint $table) {
            $table->dropIndex(['type', 'status']);
            $table->dropIndex(['township']);
            $table->dropColumn([
                'township',
                'location',
                'contact_phone',
                'resolved_at',
            ]);
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->renameColumn('occurred_at', 'date_occurred');
            $table->renameColumn('image_path', 'photo');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->unsignedBigInteger('township_id')->nullable(false)->change();

            $table->index(['type', 'status']);
            $table->index('township_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropIndex(['type', 'status']);
            $table->dropIndex(['township_id']);
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->renameColumn('date_occurred', 'occurred_at');
            $table->renameColumn('photo', 'image_path');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->string('township')->after('status');
            $table->string('location')->nullable()->after('description');
            $table->string('contact_phone')->nullable()->after('location');
            $table->timestamp('resolved_at')->nullable()->after('occurred_at');
        });

        $townshipNamesById = DB::table('townships')->pluck('name', 'id');
        $reverseMap = array_flip($this->legacyTownshipMap);

        DB::table('reports')
            ->select(['id', 'township_id'])
            ->orderBy('id')
            ->chunkById(100, function ($reports) use ($townshipNamesById, $reverseMap): void {
                foreach ($reports as $report) {
                    $townshipName = $townshipNamesById[$report->township_id] ?? null;

                    if ($townshipName === null) {
                        continue;
                    }

                    DB::table('reports')
                        ->where('id', $report->id)
                        ->update(['township' => $reverseMap[$townshipName] ?? $townshipName]);
                }
            });

        DB::table('reports')
            ->where('status', 'pending_claim')
            ->update(['status' => 'matched']);

        Schema::table('reports', function (Blueprint $table) {
            $table->dropConstrainedForeignId('township_id');
            $table->dropColumn('ward');

            $table->index(['type', 'status']);
            $table->index('township');
        });
    }
};

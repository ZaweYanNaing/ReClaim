<?php

use App\Enums\ReportType;
use App\Models\Category;
use App\Models\Report;
use App\Models\Township;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\TownshipSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
});

function validReportPayload(): array
{
    return [
        'type' => ReportType::Lost->value,
        'title' => 'Lost brown wallet',
        'description' => 'Brown leather wallet with family photos inside.',
        'category_id' => Category::query()->value('id'),
        'township_id' => Township::query()->value('id'),
        'ward' => 'Ward 12',
        'date_occurred' => now()->subDay()->format('Y-m-d'),
    ];
}

test('authenticated user can create a report with photo', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('reports.store'), [
            ...validReportPayload(),
            'photo' => UploadedFile::fake()->image('wallet.jpg'),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $report = Report::query()->first();

    expect($report)->not->toBeNull()
        ->and($report->user_id)->toBe($user->id)
        ->and($report->title)->toBe('Lost brown wallet')
        ->and($report->photo)->not->toBeNull();

    Storage::disk('public')->assertExists($report->photo);
});

test('report creation validates required fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('reports.store'), [])
        ->assertSessionHasErrors([
            'type',
            'title',
            'description',
            'category_id',
            'township_id',
            'date_occurred',
        ]);
});

test('report creation rejects invalid photo uploads', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('reports.store'), [
            ...validReportPayload(),
            'photo' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors(['photo']);
});

test('report owner can update a report and replace photo', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $report = Report::factory()->for($user)->create([
        'photo' => UploadedFile::fake()->image('old.jpg')->store('reports', 'public'),
    ]);

    $oldPhoto = $report->photo;

    $response = $this
        ->actingAs($user)
        ->patch(route('reports.update', $report), [
            ...validReportPayload(),
            'title' => 'Updated wallet report',
            'photo' => UploadedFile::fake()->image('new.jpg'),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('reports.show', $report));

    $report->refresh();

    expect($report->title)->toBe('Updated wallet report')
        ->and($report->photo)->not->toBe($oldPhoto);

    Storage::disk('public')->assertMissing($oldPhoto);
    Storage::disk('public')->assertExists($report->photo);
});

test('report owner can remove photo on update', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $report = Report::factory()->for($user)->create([
        'photo' => UploadedFile::fake()->image('old.jpg')->store('reports', 'public'),
    ]);

    $oldPhoto = $report->photo;

    $this->actingAs($user)
        ->patch(route('reports.update', $report), [
            ...validReportPayload(),
            'remove_photo' => '1',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('reports.show', $report));

    $report->refresh();

    expect($report->photo)->toBeNull();
    Storage::disk('public')->assertMissing($oldPhoto);
});

test('non owner cannot update or delete a report', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $report = Report::factory()->for($owner)->create();

    $this->actingAs($otherUser)
        ->patch(route('reports.update', $report), validReportPayload())
        ->assertForbidden();

    $this->actingAs($otherUser)
        ->delete(route('reports.destroy', $report))
        ->assertForbidden();
});

test('report owner can delete a report', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $report = Report::factory()->for($user)->create([
        'photo' => UploadedFile::fake()->image('item.jpg')->store('reports', 'public'),
    ]);

    $photoPath = $report->photo;

    $this->actingAs($user)
        ->delete(route('reports.destroy', $report))
        ->assertRedirect(route('reports.index'));

    expect(Report::query()->find($report->id))->toBeNull();
    Storage::disk('public')->assertMissing($photoPath);
});

test('reports index supports keyword search on title and description', function () {
    Report::factory()->create([
        'title' => 'Lost blue umbrella near 26th Street',
        'description' => 'Compact folding umbrella with wooden handle.',
    ]);

    Report::factory()->create([
        'title' => 'Found red wallet',
        'description' => 'Brown leather bifold with family photos.',
    ]);

    $this->get(route('reports.index', ['search' => 'umbrella']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/index')
            ->where('reports.total', 1)
            ->where('filters.search', 'umbrella')
            ->where('reports.data.0.title', 'Lost blue umbrella near 26th Street'));

    $this->get(route('reports.index', ['search' => 'family photos']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('reports.total', 1)
            ->where('reports.data.0.title', 'Found red wallet'));
});

test('reports index supports township category and status filters with pagination', function () {
    $township = Township::query()->first();
    $otherTownship = Township::query()->whereKeyNot($township->id)->first();
    $category = Category::query()->first();
    $otherCategory = Category::query()->whereKeyNot($category->id)->first();

    Report::factory()->count(13)->create([
        'township_id' => $township->id,
        'category_id' => $category->id,
        'status' => 'open',
    ]);

    Report::factory()->create([
        'township_id' => $otherTownship->id,
        'category_id' => $otherCategory->id,
        'status' => 'resolved',
    ]);

    $this->get(route('reports.index', [
        'township' => $township->id,
        'category' => $category->id,
        'status' => 'open',
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/index')
            ->where('reports.total', 13)
            ->where('reports.per_page', 12)
            ->where('reports.last_page', 2)
            ->has('reports.data', 12)
            ->where('filters.township', (string) $township->id)
            ->where('filters.category', (string) $category->id)
            ->where('filters.status', 'open'));
});

test('report show includes can manage for owner only', function () {
    $owner = User::factory()->create();
    $report = Report::factory()->for($owner)->create();

    $this->get(route('reports.show', $report))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/show')
            ->where('canManage', false));

    $this->actingAs($owner)
        ->get(route('reports.show', $report))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/show')
            ->where('canManage', true)
            ->where('report.photo_url', $report->photo_url));
});

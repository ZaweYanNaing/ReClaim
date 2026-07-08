<?php

use App\Enums\ClaimStatus;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Claim;
use App\Models\Comment;
use App\Models\Report;
use App\Models\Township;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\TownshipSeeder;

test('home page displays reclaim branding', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('recentReports')
            ->has('townships', 7)
            ->has('categories', 6));
});

test('reports index page renders', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    Report::factory()->create();

    $this->get(route('reports.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/index')
            ->has('reports.data', 1));
});

test('report show page renders', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    $report = Report::factory()->create();

    $this->get(route('reports.show', $report))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/show')
            ->where('report.id', $report->id));
});

test('authenticated user can view create report page', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('reports.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('reports/create'));
});

test('admin dashboard is restricted to admins', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admin can view admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->has('stats.total_reports')
            ->has('stats.resolved_reports')
            ->has('stats.active_users')
            ->has('stats.pending_claims'));
});

test('reclaim config is loaded', function () {
    expect(config('reclaim.city'))->toBe('Mandalay')
        ->and(config('reclaim.region'))->toBe('Mandalay Region');
});

test('township seeder creates all seven mandalay townships', function () {
    $this->seed(TownshipSeeder::class);

    expect(Township::query()->count())->toBe(7)
        ->and(Township::query()->pluck('name')->all())->toContain('Maha Aungmye', 'Patheingyi');
});

test('category seeder creates default categories', function () {
    $this->seed(CategorySeeder::class);

    expect(Category::query()->count())->toBe(6)
        ->and(Category::query()->pluck('name')->all())->toContain('Electronics', 'Others');
});

test('report can be created with relationships', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    $report = Report::factory()->create();

    expect($report->user)->toBeInstanceOf(User::class)
        ->and($report->category)->toBeInstanceOf(Category::class)
        ->and($report->township)->toBeInstanceOf(Township::class);
});

test('user can have profile fields and role', function () {
    $user = User::factory()->admin()->create([
        'phone' => '09123456789',
        'profile_photo' => 'avatars/user.jpg',
    ]);

    expect($user->phone)->toBe('09123456789')
        ->and($user->profile_photo)->toBe('avatars/user.jpg')
        ->and($user->role)->toBe(UserRole::Admin);
});

test('claim belongs to report and claimant', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    $claim = Claim::factory()->create();

    expect($claim->report)->toBeInstanceOf(Report::class)
        ->and($claim->claimant)->toBeInstanceOf(User::class)
        ->and($claim->status)->toBe(ClaimStatus::Pending);
});

test('comment belongs to report and user', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    $comment = Comment::factory()->create();

    expect($comment->report)->toBeInstanceOf(Report::class)
        ->and($comment->user)->toBeInstanceOf(User::class);
});

test('report has claims and comments relationships', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    $report = Report::factory()->create();
    Claim::factory()->count(2)->create(['report_id' => $report->id]);
    Comment::factory()->count(3)->create(['report_id' => $report->id]);

    expect($report->claims)->toHaveCount(2)
        ->and($report->comments)->toHaveCount(3)
        ->and($report->status)->toBe(ReportStatus::Open);
});

test('deleting a report cascades to claims and comments', function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
    $report = Report::factory()->create();
    Claim::factory()->create(['report_id' => $report->id]);
    Comment::factory()->create(['report_id' => $report->id]);

    $report->forceDelete();

    expect(Claim::query()->count())->toBe(0)
        ->and(Comment::query()->count())->toBe(0);
});

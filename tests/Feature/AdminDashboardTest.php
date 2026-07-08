<?php

use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Models\Claim;
use App\Models\Report;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\TownshipSeeder;

beforeEach(function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
});

test('admin dashboard shows requested stat cards', function () {
    $admin = User::factory()->admin()->create();
    $owner = User::factory()->create();
    $claimant = User::factory()->create();

    $reports = Report::factory()->count(3)->for($owner)->create();
    $reports[0]->update(['status' => ReportStatus::Resolved]);
    $reports[1]->update(['status' => ReportStatus::Resolved]);

    $report = Report::factory()->for($owner)->create();
    Claim::factory()->count(2)->create([
        'report_id' => $report->id,
        'claimant_id' => $claimant->id,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->where('stats.total_reports', 4)
            ->where('stats.resolved_reports', 2)
            ->where('stats.active_users', 3)
            ->where('stats.pending_claims', 2)
            ->has('reports.data')
            ->has('users.data')
            ->has('claims.data'));
});

test('admin can archive and restore a report', function () {
    $admin = User::factory()->admin()->create();
    $report = Report::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.reports.destroy', $report))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Report::query()->find($report->id))->toBeNull();
    expect(Report::withTrashed()->find($report->id))->not->toBeNull();

    $this->get(route('reports.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('reports.total', 0));

    $this->actingAs($admin)
        ->patch(route('admin.reports.restore', $report->id))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Report::query()->find($report->id))->not->toBeNull();
});

test('admin can update report status', function () {
    $admin = User::factory()->admin()->create();
    $report = Report::factory()->create(['status' => ReportStatus::Open]);

    $this->actingAs($admin)
        ->patch(route('admin.reports.status', $report), [
            'status' => ReportStatus::Resolved->value,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($report->fresh()->status)->toBe(ReportStatus::Resolved);
});

test('admin can archive and restore a user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(User::query()->find($user->id))->toBeNull();

    $this->actingAs($admin)
        ->patch(route('admin.users.restore', $user->id))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(User::query()->find($user->id))->not->toBeNull();
});

test('admin cannot archive themselves', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertRedirect()
        ->assertSessionHas('error');

    expect(User::query()->find($admin->id))->not->toBeNull();
});

test('admin can change user roles', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->patch(route('admin.users.role', $user), [
            'role' => UserRole::Admin->value,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($user->fresh()->role)->toBe(UserRole::Admin);
});

test('admin can archive and restore claims', function () {
    $admin = User::factory()->admin()->create();
    $claim = Claim::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.claims.destroy', $claim))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Claim::query()->find($claim->id))->toBeNull();

    $this->actingAs($admin)
        ->patch(route('admin.claims.restore', $claim->id))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Claim::query()->find($claim->id))->not->toBeNull();
});

test('admin dashboard can list archived records', function () {
    $admin = User::factory()->admin()->create();
    $report = Report::factory()->create();
    $report->delete();

    $this->actingAs($admin)
        ->get(route('admin.dashboard', ['archived' => 1]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.archived', true)
            ->where('reports.data.0.id', $report->id)
            ->where('reports.data.0.deleted_at', fn ($value) => $value !== null));
});

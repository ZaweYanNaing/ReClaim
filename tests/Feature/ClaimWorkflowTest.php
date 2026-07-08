<?php

use App\Enums\ClaimStatus;
use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\Claim;
use App\Models\Report;
use App\Models\User;
use App\Notifications\ClaimApprovedNotification;
use App\Notifications\ClaimRejectedNotification;
use App\Notifications\ClaimSubmittedNotification;
use Database\Seeders\CategorySeeder;
use Database\Seeders\TownshipSeeder;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    $this->seed([TownshipSeeder::class, CategorySeeder::class]);
});

function foundReportFor(User $owner): Report
{
    return Report::factory()->for($owner)->create([
        'type' => ReportType::Found,
        'status' => ReportStatus::Open,
    ]);
}

test('authenticated user can submit a claim on a found report', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $report = foundReportFor($owner);

    $response = $this->actingAs($claimant)->post(route('reports.claims.store', $report), [
        'proof_description' => 'It has my family photo inside and a scratch on the left corner.',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('reports.show', $report));

    $claim = Claim::query()->first();

    expect($claim)->not->toBeNull()
        ->and($claim->claimant_id)->toBe($claimant->id)
        ->and($claim->status)->toBe(ClaimStatus::Pending);

    $report->refresh();
    expect($report->status)->toBe(ReportStatus::PendingClaim);

    Notification::assertSentTo($owner, ClaimSubmittedNotification::class);
});

test('claim submission is rejected for invalid reports', function () {
    $owner = User::factory()->create();
    $claimant = User::factory()->create();

    $lostReport = Report::factory()->for($owner)->create([
        'type' => ReportType::Lost,
    ]);

    $this->actingAs($claimant)
        ->post(route('reports.claims.store', $lostReport), [
            'proof_description' => 'This should not be allowed on a lost report.',
        ])
        ->assertSessionHasErrors(['proof_description']);

    $this->actingAs($owner)
        ->post(route('reports.claims.store', foundReportFor($owner)), [
            'proof_description' => 'Owners should not be able to claim their own report.',
        ])
        ->assertSessionHasErrors(['proof_description']);
});

test('report owner can approve a claim and resolve the report', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $otherClaimant = User::factory()->create();
    $report = foundReportFor($owner);

    $approvedClaim = Claim::factory()->for($report)->for($claimant, 'claimant')->create();
    $otherClaim = Claim::factory()->for($report)->for($otherClaimant, 'claimant')->create();

    $report->update(['status' => ReportStatus::PendingClaim]);

    $this->actingAs($owner)
        ->patch(route('claims.approve', $approvedClaim))
        ->assertRedirect()
        ->assertSessionHas('success');

    $approvedClaim->refresh();
    $otherClaim->refresh();
    $report->refresh();

    expect($approvedClaim->status)->toBe(ClaimStatus::Approved)
        ->and($otherClaim->status)->toBe(ClaimStatus::Rejected)
        ->and($report->status)->toBe(ReportStatus::Resolved);

    Notification::assertSentTo($claimant, ClaimApprovedNotification::class);
    Notification::assertSentTo($otherClaimant, ClaimRejectedNotification::class);
});

test('report owner can reject a claim and reopen the report when no pending claims remain', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $report = foundReportFor($owner);
    $claim = Claim::factory()->for($report)->for($claimant, 'claimant')->create();

    $report->update(['status' => ReportStatus::PendingClaim]);

    $this->actingAs($owner)
        ->patch(route('claims.reject', $claim))
        ->assertRedirect()
        ->assertSessionHas('success');

    $claim->refresh();
    $report->refresh();

    expect($claim->status)->toBe(ClaimStatus::Rejected)
        ->and($report->status)->toBe(ReportStatus::Open);

    Notification::assertSentTo($claimant, ClaimRejectedNotification::class);
});

test('admin can approve claims but regular users cannot', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $intruder = User::factory()->create();
    $admin = User::factory()->admin()->create();
    $report = foundReportFor($owner);
    $claim = Claim::factory()->for($report)->for($claimant, 'claimant')->create();

    $report->update(['status' => ReportStatus::PendingClaim]);

    $this->actingAs($intruder)
        ->patch(route('claims.approve', $claim))
        ->assertForbidden();

    $this->actingAs($admin)
        ->patch(route('claims.approve', $claim))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($claim->fresh()->status)->toBe(ClaimStatus::Approved);
});

test('report show exposes claim review data for owners and claim actions for eligible users', function () {
    $owner = User::factory()->create();
    $claimant = User::factory()->create();
    $report = foundReportFor($owner);
    $claim = Claim::factory()->for($report)->for($claimant, 'claimant')->create();

    $this->actingAs($owner)
        ->get(route('reports.show', $report))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/show')
            ->where('canReviewClaims', true)
            ->has('claims', 1)
            ->where('claims.0.id', $claim->id));

    $this->actingAs($claimant)
        ->get(route('reports.show', $report))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('canClaim', false)
            ->where('userClaim.id', $claim->id));

    $this->get(route('reports.show', $report))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('canClaim', false)
            ->where('canReviewClaims', false));
});

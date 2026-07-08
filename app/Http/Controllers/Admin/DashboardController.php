<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ClaimStatus;
use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $showArchived = $request->boolean('archived');

        $reportsQuery = Report::query()
            ->with([
                'user' => fn ($query) => $query->withTrashed(),
                'category',
                'township',
            ])
            ->when($showArchived, fn ($query) => $query->onlyTrashed())
            ->latest();

        $usersQuery = User::query()
            ->when($showArchived, fn ($query) => $query->onlyTrashed())
            ->latest();

        $claimsQuery = Claim::query()
            ->with([
                'claimant' => fn ($query) => $query->withTrashed(),
                'report' => fn ($query) => $query->withTrashed(),
            ])
            ->when($showArchived, fn ($query) => $query->onlyTrashed())
            ->latest();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_reports' => Report::query()->count(),
                'resolved_reports' => Report::query()->where('status', ReportStatus::Resolved)->count(),
                'active_users' => User::query()->count(),
                'pending_claims' => Claim::query()->where('status', ClaimStatus::Pending)->count(),
            ],
            'filters' => [
                'archived' => $showArchived,
            ],
            'reports' => $reportsQuery
                ->paginate(8, ['*'], 'reports_page')
                ->withQueryString()
                ->through(fn (Report $report): array => [
                    'id' => $report->id,
                    'title' => $report->title,
                    'type' => $report->type->value,
                    'status' => $report->status->value,
                    'deleted_at' => $report->deleted_at?->toIso8601String(),
                    'user' => $report->user->only(['id', 'name', 'email']),
                    'category' => $report->category->only(['name']),
                    'township' => $report->township->only(['name']),
                    'created_at' => $report->created_at?->toIso8601String(),
                ]),
            'users' => $usersQuery
                ->paginate(8, ['*'], 'users_page')
                ->withQueryString()
                ->through(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'deleted_at' => $user->deleted_at?->toIso8601String(),
                    'created_at' => $user->created_at?->toIso8601String(),
                ]),
            'claims' => $claimsQuery
                ->paginate(8, ['*'], 'claims_page')
                ->withQueryString()
                ->through(fn (Claim $claim): array => [
                    'id' => $claim->id,
                    'status' => $claim->status->value,
                    'proof_description' => $claim->proof_description,
                    'deleted_at' => $claim->deleted_at?->toIso8601String(),
                    'claimant' => $claim->claimant->only(['id', 'name', 'email']),
                    'report' => $claim->report->only(['id', 'title']),
                    'created_at' => $claim->created_at?->toIso8601String(),
                ]),
        ]);
    }
}

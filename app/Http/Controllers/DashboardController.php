<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $myReports = Report::query()
            ->with(['category', 'township'])
            ->where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Report $report): array => [
                'id' => $report->id,
                'type' => $report->type->value,
                'status' => $report->status->value,
                'title' => $report->title,
                'created_at' => $report->created_at?->toIso8601String(),
                'category' => $report->category->only(['id', 'name']),
                'township' => $report->township->only(['id', 'name']),
            ]);

        $myClaims = Claim::query()
            ->with(['report.category', 'report.township'])
            ->where('claimant_id', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Claim $claim): array => [
                'id' => $claim->id,
                'status' => $claim->status->value,
                'proof_description' => $claim->proof_description,
                'created_at' => $claim->created_at?->toIso8601String(),
                'report' => [
                    'id' => $claim->report->id,
                    'title' => $claim->report->title,
                    'type' => $claim->report->type->value,
                    'category' => $claim->report->category->only(['id', 'name']),
                    'township' => $claim->report->township->only(['id', 'name']),
                ],
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'reports' => Report::query()->where('user_id', $user->id)->count(),
                'open_reports' => Report::query()->where('user_id', $user->id)->where('status', 'open')->count(),
                'claims' => Claim::query()->where('claimant_id', $user->id)->count(),
            ],
            'myReports' => $myReports,
            'myClaims' => $myClaims,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    public function destroy(Report $report): RedirectResponse
    {
        $report->delete();

        return back()->with('success', 'Report archived successfully.');
    }

    public function restore(int $reportId): RedirectResponse
    {
        $report = Report::query()->onlyTrashed()->findOrFail($reportId);
        $report->restore();

        return back()->with('success', 'Report restored successfully.');
    }

    public function updateStatus(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(ReportStatus::class)],
        ]);

        $report->update(['status' => $validated['status']]);

        return back()->with('success', 'Report status updated.');
    }
}

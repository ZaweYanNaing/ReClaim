<?php

namespace App\Http\Controllers;

use App\Enums\ClaimStatus;
use App\Enums\UserRole;
use App\Http\Requests\StoreClaimRequest;
use App\Models\Claim;
use App\Models\Report;
use App\Models\User;
use App\Services\ClaimService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    public function __construct(private ClaimService $claimService) {}

    public function store(StoreClaimRequest $request, Report $report): RedirectResponse
    {
        $this->claimService->submit(
            $report,
            $request->user(),
            $request->validated('proof_description'),
        );

        return redirect()
            ->route('reports.show', $report)
            ->with('success', 'Your claim has been submitted. The finder will review it soon.');
    }

    public function approve(Request $request, Claim $claim): RedirectResponse
    {
        $this->authorizeReview($request->user(), $claim);

        if ($claim->status !== ClaimStatus::Pending) {
            return back()->with('error', 'Only pending claims can be approved.');
        }

        $this->claimService->approve($claim, $request->user());

        return back()->with('success', 'The claim has been approved and the report is now resolved.');
    }

    public function reject(Request $request, Claim $claim): RedirectResponse
    {
        $this->authorizeReview($request->user(), $claim);

        if ($claim->status !== ClaimStatus::Pending) {
            return back()->with('error', 'Only pending claims can be rejected.');
        }

        $this->claimService->reject($claim, $request->user());

        return back()->with('success', 'The claim has been rejected.');
    }

    private function authorizeReview(User $user, Claim $claim): void
    {
        $claim->loadMissing('report');

        $canReview = $claim->report->user_id === $user->id
            || $user->role === UserRole::Admin;

        if (! $canReview) {
            abort(403);
        }
    }
}

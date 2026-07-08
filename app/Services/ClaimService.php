<?php

namespace App\Services;

use App\Enums\ClaimStatus;
use App\Enums\ReportStatus;
use App\Models\Claim;
use App\Models\Report;
use App\Models\User;
use App\Notifications\ClaimApprovedNotification;
use App\Notifications\ClaimRejectedNotification;
use App\Notifications\ClaimSubmittedNotification;
use Illuminate\Support\Facades\DB;

class ClaimService
{
    public function submit(Report $report, User $claimant, string $proofDescription): Claim
    {
        return DB::transaction(function () use ($report, $claimant, $proofDescription): Claim {
            $claim = $report->claims()->create([
                'claimant_id' => $claimant->id,
                'proof_description' => $proofDescription,
                'status' => ClaimStatus::Pending,
            ]);

            if ($report->status !== ReportStatus::Resolved) {
                $report->update(['status' => ReportStatus::PendingClaim]);
            }

            $claim->load(['claimant', 'report.user']);
            $report->user->notify(new ClaimSubmittedNotification($claim));

            return $claim;
        });
    }

    public function approve(Claim $claim, User $reviewer): Claim
    {
        return DB::transaction(function () use ($claim, $reviewer): Claim {
            $claim->load(['claimant', 'report']);

            $claim->update(['status' => ClaimStatus::Approved]);

            $claim->report->update(['status' => ReportStatus::Resolved]);

            $claim->report->claims()
                ->where('id', '!=', $claim->id)
                ->where('status', ClaimStatus::Pending)
                ->each(function (Claim $otherClaim): void {
                    $otherClaim->update(['status' => ClaimStatus::Rejected]);
                    $otherClaim->load('claimant', 'report');
                    $otherClaim->claimant->notify(new ClaimRejectedNotification($otherClaim));
                });

            $claim->claimant->notify(new ClaimApprovedNotification($claim));

            return $claim->fresh(['claimant', 'report']);
        });
    }

    public function reject(Claim $claim, User $reviewer): Claim
    {
        return DB::transaction(function () use ($claim): Claim {
            $claim->load(['claimant', 'report']);

            $claim->update(['status' => ClaimStatus::Rejected]);

            $hasPendingClaims = $claim->report->claims()
                ->where('status', ClaimStatus::Pending)
                ->exists();

            if (! $hasPendingClaims && $claim->report->status === ReportStatus::PendingClaim) {
                $claim->report->update(['status' => ReportStatus::Open]);
            }

            $claim->claimant->notify(new ClaimRejectedNotification($claim));

            return $claim->fresh(['claimant', 'report']);
        });
    }
}

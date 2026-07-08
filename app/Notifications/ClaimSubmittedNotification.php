<?php

namespace App\Notifications;

use App\Models\Claim;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ClaimSubmittedNotification extends Notification
{
    use Queueable;

    public function __construct(public Claim $claim) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'claim_submitted',
            'claim_id' => $this->claim->id,
            'report_id' => $this->claim->report_id,
            'report_title' => $this->claim->report->title,
            'claimant_name' => $this->claim->claimant->name,
            'message' => sprintf(
                '%s submitted a claim on your report "%s".',
                $this->claim->claimant->name,
                $this->claim->report->title,
            ),
        ];
    }
}

<?php

namespace App\Notifications;

use App\Models\Claim;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ClaimApprovedNotification extends Notification
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
            'type' => 'claim_approved',
            'claim_id' => $this->claim->id,
            'report_id' => $this->claim->report_id,
            'report_title' => $this->claim->report->title,
            'message' => sprintf(
                'Your claim on "%s" was approved. We hope you are reunited with your item soon.',
                $this->claim->report->title,
            ),
        ];
    }
}

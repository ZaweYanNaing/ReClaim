<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Open = 'open';
    case PendingClaim = 'pending_claim';
    case Resolved = 'resolved';

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Open',
            self::PendingClaim => 'Pending Claim',
            self::Resolved => 'Resolved',
        };
    }
}

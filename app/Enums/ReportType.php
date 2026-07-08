<?php

namespace App\Enums;

enum ReportType: string
{
    case Lost = 'lost';
    case Found = 'found';

    public function label(): string
    {
        return match ($this) {
            self::Lost => 'Lost Item',
            self::Found => 'Found Item',
        };
    }
}

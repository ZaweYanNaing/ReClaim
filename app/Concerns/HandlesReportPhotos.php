<?php

namespace App\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HandlesReportPhotos
{
    protected function storeReportPhoto(UploadedFile $file): string
    {
        return $file->store('reports', 'public');
    }

    protected function deleteReportPhoto(?string $path): void
    {
        if ($path === null || str_starts_with($path, 'http')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}

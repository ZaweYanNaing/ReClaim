<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\RedirectResponse;

class ClaimController extends Controller
{
    public function destroy(Claim $claim): RedirectResponse
    {
        $claim->delete();

        return back()->with('success', 'Claim archived successfully.');
    }

    public function restore(int $claimId): RedirectResponse
    {
        $claim = Claim::query()->onlyTrashed()->findOrFail($claimId);
        $claim->restore();

        return back()->with('success', 'Claim restored successfully.');
    }
}

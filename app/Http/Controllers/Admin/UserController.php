<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()?->is($user)) {
            return back()->with('error', 'You cannot archive your own account.');
        }

        $user->delete();

        return back()->with('success', 'User archived successfully.');
    }

    public function restore(int $userId): RedirectResponse
    {
        $user = User::query()->onlyTrashed()->findOrFail($userId);
        $user->restore();

        return back()->with('success', 'User restored successfully.');
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        if ($request->user()?->is($user)) {
            return back()->with('error', 'You cannot change your own role.');
        }

        $validated = $request->validate([
            'role' => ['required', Rule::enum(UserRole::class)],
        ]);

        $user->update(['role' => $validated['role']]);

        return back()->with('success', 'User role updated.');
    }
}

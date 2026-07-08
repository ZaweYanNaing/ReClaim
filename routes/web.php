<?php

use App\Http\Controllers\Admin\ClaimController as AdminClaimController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');

    Route::delete('reports/{report}', [AdminReportController::class, 'destroy'])->name('reports.destroy');
    Route::patch('reports/{reportId}/restore', [AdminReportController::class, 'restore'])->name('reports.restore')->whereNumber('reportId');
    Route::patch('reports/{report}/status', [AdminReportController::class, 'updateStatus'])->name('reports.status');

    Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::patch('users/{userId}/restore', [AdminUserController::class, 'restore'])->name('users.restore')->whereNumber('userId');
    Route::patch('users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role');

    Route::delete('claims/{claim}', [AdminClaimController::class, 'destroy'])->name('claims.destroy');
    Route::patch('claims/{claimId}/restore', [AdminClaimController::class, 'restore'])->name('claims.restore')->whereNumber('claimId');
});

require __DIR__.'/reports.php';
require __DIR__.'/settings.php';

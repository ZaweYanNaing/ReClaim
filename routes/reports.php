<?php

use App\Http\Controllers\ClaimController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
Route::get('reports/create', [ReportController::class, 'create'])->name('reports.create')->middleware(['auth', 'verified']);
Route::post('reports', [ReportController::class, 'store'])->name('reports.store')->middleware(['auth', 'verified']);
Route::get('reports/{report}', [ReportController::class, 'show'])->name('reports.show');
Route::get('reports/{report}/edit', [ReportController::class, 'edit'])->name('reports.edit')->middleware(['auth', 'verified']);
Route::patch('reports/{report}', [ReportController::class, 'update'])->name('reports.update')->middleware(['auth', 'verified']);
Route::delete('reports/{report}', [ReportController::class, 'destroy'])->name('reports.destroy')->middleware(['auth', 'verified']);

Route::post('reports/{report}/claims', [ClaimController::class, 'store'])->name('reports.claims.store')->middleware(['auth', 'verified']);
Route::patch('claims/{claim}/approve', [ClaimController::class, 'approve'])->name('claims.approve')->middleware(['auth', 'verified']);
Route::patch('claims/{claim}/reject', [ClaimController::class, 'reject'])->name('claims.reject')->middleware(['auth', 'verified']);

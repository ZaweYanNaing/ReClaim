<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Report;
use App\Models\Township;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $recentReports = Report::query()
            ->with(['category', 'township', 'user'])
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->trim()->value();
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('township'), fn ($query) => $query->where('township_id', $request->integer('township')))
            ->when($request->filled('category'), fn ($query) => $query->where('category_id', $request->integer('category')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->value()))
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Report $report): array => $this->summarizeReport($report));

        return Inertia::render('welcome', [
            'recentReports' => $recentReports,
            'townships' => Township::query()->orderBy('name')->get(['id', 'name']),
            'categories' => Category::query()->orderBy('sort_order')->get(['id', 'name', 'slug', 'icon']),
            'filters' => $request->only(['search', 'township', 'category', 'status']),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function summarizeReport(Report $report): array
    {
        return [
            'id' => $report->id,
            'type' => $report->type->value,
            'status' => $report->status->value,
            'title' => $report->title,
            'description' => $report->description,
            'ward' => $report->ward,
            'photo_url' => $report->photo_url,
            'date_occurred' => $report->date_occurred?->toIso8601String(),
            'created_at' => $report->created_at?->toIso8601String(),
            'category' => [
                'id' => $report->category->id,
                'name' => $report->category->name,
                'icon' => $report->category->icon,
            ],
            'township' => [
                'id' => $report->township->id,
                'name' => $report->township->name,
            ],
            'user' => [
                'id' => $report->user->id,
                'name' => $report->user->name,
            ],
            'verified' => $report->user->email_verified_at !== null,
        ];
    }
}

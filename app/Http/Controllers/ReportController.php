<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesReportPhotos;
use App\Enums\ClaimStatus;
use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Enums\UserRole;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Models\Category;
use App\Models\Claim;
use App\Models\Comment;
use App\Models\Report;
use App\Models\Township;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    use HandlesReportPhotos;

    public function index(Request $request): Response
    {
        $reports = Report::query()
            ->with(['category', 'township', 'user'])
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->value();
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('township'), fn ($query) => $query->where('township_id', $request->integer('township')))
            ->when($request->filled('category'), fn ($query) => $query->where('category_id', $request->integer('category')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->value()))
            ->when($request->filled('type'), fn ($query) => $query->where('type', $request->string('type')->value()))
            ->when($request->filled('date_from'), fn ($query) => $query->whereDate('date_occurred', '>=', $request->date('date_from')))
            ->when($request->filled('date_to'), fn ($query) => $query->whereDate('date_occurred', '<=', $request->date('date_to')))
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Report $report): array => $this->summarizeReport($report));

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'townships' => Township::query()->orderBy('name')->get(['id', 'name']),
            'categories' => Category::query()->orderBy('sort_order')->get(['id', 'name', 'slug', 'icon']),
            'filters' => $request->only(['search', 'township', 'category', 'status']),
        ]);
    }

    public function show(Request $request, Report $report): Response
    {
        $user = $request->user();
        $canManage = $user?->id === $report->user_id;
        $isAdmin = $user?->role === UserRole::Admin;

        $report->load(['category', 'township', 'user', 'comments.user']);

        $claims = collect();
        $userClaim = null;

        if ($canManage || $isAdmin) {
            $report->load(['claims.claimant']);
            $claims = $report->claims;
        } elseif ($user) {
            $userClaim = $report->claims()
                ->with('claimant')
                ->where('claimant_id', $user->id)
                ->latest()
                ->first();
        }

        $hasActiveClaim = $user !== null && $report->claims()
            ->where('claimant_id', $user->id)
            ->whereIn('status', [ClaimStatus::Pending, ClaimStatus::Approved])
            ->exists();

        return Inertia::render('reports/show', [
            'report' => $this->detailReport($report),
            'canManage' => $canManage,
            'canReviewClaims' => $canManage || $isAdmin,
            'canClaim' => $user !== null
                && $report->type === ReportType::Found
                && $report->status !== ReportStatus::Resolved
                && ! $canManage
                && ! $hasActiveClaim,
            'userClaim' => $userClaim ? $this->summarizeClaim($userClaim) : null,
            'claims' => $claims->map(fn (Claim $claim): array => $this->summarizeClaim($claim))->values(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('reports/create', $this->formOptions());
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['photo']);

        if ($request->hasFile('photo')) {
            $data['photo'] = $this->storeReportPhoto($request->file('photo'));
        }

        $report = $request->user()->reports()->create($data);

        return redirect()
            ->route('reports.show', $report)
            ->with('success', 'Your report has been shared with the community. We hope for good news soon.');
    }

    public function edit(Report $report): Response
    {
        $this->authorizeReport($report);

        return Inertia::render('reports/edit', [
            ...$this->formOptions(),
            'report' => $this->formReport($report),
        ]);
    }

    public function update(UpdateReportRequest $request, Report $report): RedirectResponse
    {
        $this->authorizeReport($report);

        $data = $request->safe()->except(['photo', 'remove_photo']);

        if ($request->boolean('remove_photo')) {
            $this->deleteReportPhoto($report->photo);
            $data['photo'] = null;
        }

        if ($request->hasFile('photo')) {
            $this->deleteReportPhoto($report->photo);
            $data['photo'] = $this->storeReportPhoto($request->file('photo'));
        }

        $report->update($data);

        return redirect()
            ->route('reports.show', $report)
            ->with('success', 'Your report has been updated.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        $this->authorizeReport($report);

        $this->deleteReportPhoto($report->photo);
        $report->delete();

        return redirect()
            ->route('reports.index')
            ->with('success', 'Your report has been removed.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'townships' => Township::query()->orderBy('name')->get(['id', 'name']),
            'categories' => Category::query()->orderBy('sort_order')->get(['id', 'name', 'icon']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formReport(Report $report): array
    {
        return [
            'id' => $report->id,
            'type' => $report->type->value,
            'title' => $report->title,
            'description' => $report->description,
            'category_id' => $report->category_id,
            'township_id' => $report->township_id,
            'ward' => $report->ward,
            'photo_url' => $report->photo_url,
            'date_occurred' => $report->date_occurred?->format('Y-m-d'),
        ];
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
            'category' => $report->category->only(['id', 'name', 'icon']),
            'township' => $report->township->only(['id', 'name']),
            'user' => $report->user->only(['id', 'name']),
            'verified' => $report->user->email_verified_at !== null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detailReport(Report $report): array
    {
        return [
            ...$this->summarizeReport($report),
            'user' => [
                'id' => $report->user->id,
                'name' => $report->user->name,
                'email' => $report->user->email,
                'phone' => $report->user->phone,
                'profile_photo_url' => $report->user->profile_photo_url,
            ],
            'comments' => $report->comments->map(fn (Comment $comment): array => [
                'id' => $comment->id,
                'message' => $comment->message,
                'created_at' => $comment->created_at?->toIso8601String(),
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'profile_photo_url' => $comment->user->profile_photo_url,
                ],
            ]),
        ];
    }

    private function authorizeReport(Report $report): void
    {
        if ($report->user_id !== auth()->id()) {
            abort(403);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function summarizeClaim(Claim $claim): array
    {
        return [
            'id' => $claim->id,
            'status' => $claim->status->value,
            'proof_description' => $claim->proof_description,
            'created_at' => $claim->created_at?->toIso8601String(),
            'claimant' => $claim->claimant->only(['id', 'name', 'email']),
        ];
    }
}

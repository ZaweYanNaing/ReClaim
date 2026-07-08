import { Head, router } from '@inertiajs/react';
import { Filter, LayoutGrid, List, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/reclaim/button';
import { EmptyState } from '@/components/reclaim/empty-state';
import { Pagination } from '@/components/reclaim/pagination';
import { ReportCard } from '@/components/reclaim/report-card';
import { ReportFiltersBar } from '@/components/reclaim/report-filters-bar';
import { index as reportsIndex } from '@/routes/reports';
import type {
    Category,
    Paginated,
    ReportFilters,
    ReportSummary,
    Township,
} from '@/types/reclaim';

type Props = {
    reports: Paginated<ReportSummary>;
    townships: Township[];
    categories: Category[];
    filters: ReportFilters;
};

export default function ReportsIndex({
    reports,
    townships,
    categories,
    filters,
}: Props) {
    const [view, setView] = useState<'grid' | 'list'>('grid');

    function applyFilters(query: Record<string, string>) {
        router.get(reportsIndex(), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Browse Reports" />

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold">Browse reports</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Search and filter lost and found items shared by your Mandalay
                        neighbors. Filters stay in the URL so you can bookmark or share a
                        search.
                    </p>
                </div>

                <div className="mb-8 rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Filter className="size-4 text-terracotta" />
                        Search & filters
                    </div>
                    <ReportFiltersBar
                        townships={townships}
                        categories={categories}
                        filters={filters}
                        onApply={applyFilters}
                    />
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {reports.total} report{reports.total === 1 ? '' : 's'} found
                    </p>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={view === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('grid')}
                        >
                            <LayoutGrid className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('list')}
                        >
                            <List className="size-4" />
                        </Button>
                    </div>
                </div>

                {reports.data.length > 0 ? (
                    <div
                        className={
                            view === 'grid'
                                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                                : 'flex flex-col gap-4'
                        }
                    >
                        {reports.data.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Search}
                        title="Nothing matched your search yet"
                        description="Try widening your filters, or check back soon. Sometimes the kindest outcome is that nothing was lost at all."
                    />
                )}

                <Pagination pagination={reports} className="mt-10" />
            </div>
        </>
    );
}

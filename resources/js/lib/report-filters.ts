import type { ReportFilters } from '@/types/reclaim';

export type ReportFilterValues = {
    search: string;
    township: string;
    category: string;
    status: string;
};

export function filtersFromProps(filters: ReportFilters = {}): ReportFilterValues {
    return {
        search: filters.search ?? '',
        township: filters.township ?? '',
        category: filters.category ?? '',
        status: filters.status ?? '',
    };
}

export function buildReportFilterQuery(
    values: ReportFilterValues,
): Record<string, string> {
    return Object.fromEntries(
        Object.entries({
            search: values.search.trim(),
            township: values.township,
            category: values.category,
            status: values.status,
        }).filter(([, value]) => value !== ''),
    );
}

export function hasActiveFilters(values: ReportFilterValues): boolean {
    return (
        values.search.trim() !== '' ||
        values.township !== '' ||
        values.category !== '' ||
        values.status !== ''
    );
}

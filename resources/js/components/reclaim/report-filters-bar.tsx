import { Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/reclaim/button';
import { FormInput, FormSelect } from '@/components/reclaim/form-input';
import {
    buildReportFilterQuery,
    filtersFromProps,
    hasActiveFilters,
    type ReportFilterValues,
} from '@/lib/report-filters';
import type { Category, ReportFilters, Township } from '@/types/reclaim';

type ReportFiltersBarProps = {
    townships: Township[];
    categories: Category[];
    filters?: ReportFilters;
    onApply: (query: Record<string, string>) => void;
    className?: string;
    compact?: boolean;
};

export function ReportFiltersBar({
    townships,
    categories,
    filters,
    onApply,
    className,
    compact = false,
}: ReportFiltersBarProps) {
    const [values, setValues] = useState<ReportFilterValues>(() =>
        filtersFromProps(filters),
    );

    useEffect(() => {
        setValues(filtersFromProps(filters));
    }, [filters]);

    function apply(nextValues: ReportFilterValues = values) {
        onApply(buildReportFilterQuery(nextValues));
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        apply();
    }

    function updateValue<Key extends keyof ReportFilterValues>(
        key: Key,
        value: ReportFilterValues[Key],
        applyImmediately = false,
    ) {
        const nextValues = { ...values, [key]: value };
        setValues(nextValues);

        if (applyImmediately) {
            apply(nextValues);
        }
    }

    function clearFilters() {
        const cleared: ReportFilterValues = {
            search: '',
            township: '',
            category: '',
            status: '',
        };

        setValues(cleared);
        onApply({});
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={className}
        >
            <div
                className={
                    compact
                        ? 'flex flex-col gap-3 lg:flex-row lg:items-end'
                        : 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'
                }
            >
                <div className={compact ? 'flex-1' : 'md:col-span-2 xl:col-span-1'}>
                    <FormInput
                        label={compact ? 'Search reports' : 'Search'}
                        name="search"
                        value={values.search}
                        onChange={(event) =>
                            updateValue('search', event.target.value)
                        }
                        placeholder="Keyword in title or description"
                    />
                </div>
                <FormSelect
                    label="Township"
                    name="township"
                    value={values.township}
                    onChange={(event) =>
                        updateValue('township', event.target.value, true)
                    }
                    options={[
                        { value: '', label: 'All townships' },
                        ...townships.map((township) => ({
                            value: String(township.id),
                            label: township.name,
                        })),
                    ]}
                />
                <FormSelect
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={(event) =>
                        updateValue('category', event.target.value, true)
                    }
                    options={[
                        { value: '', label: 'All categories' },
                        ...categories.map((category) => ({
                            value: String(category.id),
                            label: category.name,
                        })),
                    ]}
                />
                <FormSelect
                    label="Status"
                    name="status"
                    value={values.status}
                    onChange={(event) =>
                        updateValue('status', event.target.value, true)
                    }
                    options={[
                        { value: '', label: 'Any status' },
                        { value: 'open', label: 'Open' },
                        { value: 'pending_claim', label: 'Pending claim' },
                        { value: 'resolved', label: 'Resolved' },
                    ]}
                />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                <Button type="submit">
                    <Search className="size-4" />
                    Search
                </Button>
                {hasActiveFilters(values) && (
                    <Button type="button" variant="outline" onClick={clearFilters}>
                        Clear filters
                    </Button>
                )}
            </div>
        </form>
    );
}

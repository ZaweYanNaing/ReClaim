import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types/reclaim';

type PaginationProps<T> = {
    pagination: Paginated<T>;
    className?: string;
};

export function Pagination<T>({ pagination, className }: PaginationProps<T>) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <nav
            className={cn('flex flex-wrap items-center justify-center gap-2', className)}
            aria-label="Pagination"
        >
            {pagination.links.map((link, index) => {
                if (!link.url) {
                    return (
                        <span
                            key={`${link.label}-${index}`}
                            className="inline-flex min-w-10 items-center justify-center rounded-xl px-3 py-2 text-sm text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveState
                        preserveScroll
                        className={cn(
                            'inline-flex min-w-10 items-center justify-center rounded-xl px-3 py-2 text-sm transition-gentle',
                            link.active
                                ? 'bg-primary text-primary-foreground shadow-soft'
                                : 'bg-card text-foreground hover:bg-cream-dark',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}

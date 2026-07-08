import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types/reclaim';

type AdminTablePaginationProps<T> = {
    pagination: Paginated<T>;
    className?: string;
};

export function AdminTablePagination<T>({
    pagination,
    className,
}: AdminTablePaginationProps<T>) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <nav
            className={cn('mt-4 flex flex-wrap items-center justify-end gap-2', className)}
            aria-label="Table pagination"
        >
            {pagination.links.map((link, index) => {
                if (!link.url) {
                    return (
                        <span
                            key={`${link.label}-${index}`}
                            className="inline-flex min-w-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground"
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
                            'inline-flex min-w-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-xs transition-gentle',
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-cream-dark text-foreground hover:bg-cream-dark/80',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}

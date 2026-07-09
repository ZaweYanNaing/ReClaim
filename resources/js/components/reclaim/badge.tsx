import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200',
    {
        variants: {
            variant: {
                default: 'bg-muted text-muted-foreground',
                lost: 'bg-red-100 text-red-700',
                found: 'bg-lime/20 text-forest',
                open: 'bg-amber-100 text-amber-700',
                pending: 'bg-orange-100 text-orange-700',
                resolved: 'bg-green-100 text-green-700',
                verified: 'bg-forest/10 text-forest',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant, className }))} {...props} />
    );
}

export function StatusBadge({ status }: { status: string }) {
    const variant =
        status === 'open'
            ? 'open'
            : status === 'pending_claim' || status === 'pending'
              ? 'pending'
              : status === 'resolved' || status === 'approved'
                ? 'resolved'
                : 'default';

    const label =
        status === 'pending_claim'
            ? 'Pending claim'
            : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

    return <Badge variant={variant}>{label}</Badge>;
}

export function TypeBadge({ type }: { type: 'lost' | 'found' }) {
    return (
        <Badge variant={type === 'lost' ? 'lost' : 'found'}>
            {type === 'lost' ? 'Lost' : 'Found'}
        </Badge>
    );
}

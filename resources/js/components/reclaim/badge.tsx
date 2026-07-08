import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-gentle',
    {
        variants: {
            variant: {
                default: 'bg-cream-dark text-foreground',
                lost: 'bg-terracotta-soft/30 text-terracotta',
                found: 'bg-teal-soft text-teal',
                open: 'bg-amber-warm/40 text-foreground',
                pending: 'bg-amber-warm/50 text-foreground',
                resolved: 'bg-sage/20 text-sage',
                verified: 'bg-teal-soft text-teal',
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

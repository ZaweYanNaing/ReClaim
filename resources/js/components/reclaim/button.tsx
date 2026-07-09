import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-gentle disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'btn-shimmer text-forest font-semibold shadow-lime hover:-translate-y-0.5 hover:shadow-lime',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                accent:
                    'bg-forest text-white shadow-forest hover:-translate-y-0.5 hover:bg-forest-light',
                outline:
                    'border-2 border-forest/20 bg-white text-forest hover:border-forest/50 hover:bg-forest/5',
                ghost: 'text-foreground hover:bg-muted',
                destructive:
                    'bg-destructive text-white shadow-soft hover:-translate-y-0.5 hover:bg-destructive/90',
                lime: 'bg-lime text-forest-dark font-semibold hover:-translate-y-0.5 hover:bg-lime/90 shadow-lime',
            },
            size: {
                sm: 'h-9 px-4 text-sm',
                md: 'h-11 px-5 text-sm',
                lg: 'h-12 px-7 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

type ButtonProps = ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

export function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

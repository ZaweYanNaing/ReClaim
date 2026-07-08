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
                    'bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-primary/90',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-amber-warm/40',
                accent:
                    'bg-accent text-accent-foreground shadow-soft hover:-translate-y-0.5 hover:bg-accent/90',
                outline:
                    'border border-border bg-card text-foreground hover:border-primary/30 hover:bg-cream-dark',
                ghost: 'text-foreground hover:bg-cream-dark',
                destructive:
                    'bg-destructive text-white shadow-soft hover:-translate-y-0.5 hover:bg-destructive/90',
            },
            size: {
                sm: 'h-9 px-4 text-sm',
                md: 'h-11 px-5 text-sm',
                lg: 'h-12 px-6 text-base',
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

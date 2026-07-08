import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type FormInputProps = ComponentProps<'input'> & {
    label: string;
    error?: string;
    hint?: string;
};

export function FormInput({
    label,
    error,
    hint,
    className,
    id,
    ...props
}: FormInputProps) {
    const inputId = id ?? props.name;

    return (
        <div className="grid gap-2">
            <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <input
                id={inputId}
                className={cn(
                    'h-11 rounded-xl border border-input bg-card px-4 text-sm shadow-xs transition-gentle placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none',
                    error && 'border-destructive focus:ring-destructive/15',
                    className,
                )}
                {...props}
            />
            {hint && !error && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

type FormTextareaProps = ComponentProps<'textarea'> & {
    label: string;
    error?: string;
    hint?: string;
};

export function FormTextarea({
    label,
    error,
    hint,
    className,
    id,
    ...props
}: FormTextareaProps) {
    const inputId = id ?? props.name;

    return (
        <div className="grid gap-2">
            <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <textarea
                id={inputId}
                className={cn(
                    'min-h-28 rounded-xl border border-input bg-card px-4 py-3 text-sm shadow-xs transition-gentle placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none',
                    error && 'border-destructive focus:ring-destructive/15',
                    className,
                )}
                {...props}
            />
            {hint && !error && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

type FormSelectProps = ComponentProps<'select'> & {
    label: string;
    error?: string;
    options: Array<{ value: string | number; label: string }>;
};

export function FormSelect({
    label,
    error,
    options,
    className,
    id,
    ...props
}: FormSelectProps) {
    const inputId = id ?? props.name;

    return (
        <div className="grid gap-2">
            <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <select
                id={inputId}
                className={cn(
                    'h-11 rounded-xl border border-input bg-card px-4 text-sm shadow-xs transition-gentle focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none',
                    error && 'border-destructive focus:ring-destructive/15',
                    className,
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

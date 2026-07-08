import { Link } from '@inertiajs/react';
import { HeartHandshake } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.82_0.1_75/0.25),transparent_50%),radial-gradient(circle_at_bottom,oklch(0.88_0.03_188/0.35),transparent_45%)]" />
            <div className="relative w-full max-w-md">
                <div className="flex flex-col gap-8 rounded-3xl border border-border/80 bg-card/95 p-8 shadow-soft-lg backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3 font-medium"
                        >
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-terracotta-soft/30 text-terracotta">
                                <HeartHandshake className="size-7" />
                            </div>
                        </Link>

                        <div className="space-y-2">
                            <h1 className="font-heading text-2xl font-semibold">{title}</h1>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

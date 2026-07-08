import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/reclaim/card';
import { cn } from '@/lib/utils';

type AdminStatCardProps = {
    label: string;
    value: number;
    icon: LucideIcon;
    tone?: string;
};

export function AdminStatCard({
    label,
    value,
    icon: Icon,
    tone = 'bg-teal-soft text-teal',
}: AdminStatCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 pt-6">
                <div
                    className={cn(
                        'flex size-12 items-center justify-center rounded-2xl',
                        tone,
                    )}
                >
                    <Icon className="size-5" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-heading text-2xl font-semibold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

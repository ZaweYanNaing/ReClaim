import { Link } from '@inertiajs/react';
import { MapPin, ShieldCheck } from 'lucide-react';
import type { ReportSummary } from '@/types/reclaim';
import { Badge, StatusBadge, TypeBadge } from '@/components/reclaim/badge';
import { Card, CardContent } from '@/components/reclaim/card';
import { show } from '@/routes/reports';

type ReportCardProps = {
    report: ReportSummary;
};

export function ReportCard({ report }: ReportCardProps) {
    return (
        <Link href={show(report.id)} className="group block h-full">
            <Card className="h-full overflow-hidden group-hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                    {report.photo_url ? (
                        <img
                            src={report.photo_url}
                            alt={report.title}
                            className="size-full object-cover transition-gentle group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-terracotta-soft/20 to-teal-soft/40 text-terracotta">
                            <MapPin className="size-10 opacity-60" />
                        </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <TypeBadge type={report.type} />
                        <StatusBadge status={report.status} />
                    </div>
                </div>
                <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug">
                            {report.title}
                        </h3>
                        {report.verified && (
                            <Badge variant="verified" className="shrink-0">
                                <ShieldCheck className="size-3" />
                                Verified
                            </Badge>
                        )}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                        {report.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{report.category.name}</span>
                        <span>·</span>
                        <span>{report.township.name}</span>
                        {report.ward && (
                            <>
                                <span>·</span>
                                <span>{report.ward}</span>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

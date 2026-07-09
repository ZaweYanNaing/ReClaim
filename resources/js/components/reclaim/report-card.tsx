import { Link } from '@inertiajs/react';
import { MapPin, ShieldCheck } from 'lucide-react';
import type { ReportSummary } from '@/types/reclaim';
import { Badge, StatusBadge, TypeBadge } from '@/components/reclaim/badge';
import { show } from '@/routes/reports';

type ReportCardProps = {
    report: ReportSummary;
};

export function ReportCard({ report }: ReportCardProps) {
    return (
        <Link href={show(report.id)} className="group block h-full">
            <div className="h-full rounded-2xl border border-border bg-card text-card-foreground shadow-soft transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-soft-lg hover:border-lime/40 overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {report.photo_url ? (
                        <img
                            src={report.photo_url}
                            alt={report.title}
                            className="size-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-forest/10 via-lime-soft/30 to-teal-soft/40">
                            <MapPin className="size-12 text-forest/30" />
                        </div>
                    )}
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <TypeBadge type={report.type} />
                        <StatusBadge status={report.status} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug group-hover:text-forest transition-colors">
                            {report.title}
                        </h3>
                        {report.verified && (
                            <Badge variant="verified" className="shrink-0">
                                <ShieldCheck className="size-3" />
                                Verified
                            </Badge>
                        )}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                        {report.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {report.category.name}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            <MapPin className="size-3" />
                            {report.township.name}
                        </span>
                        {report.ward && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {report.ward}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

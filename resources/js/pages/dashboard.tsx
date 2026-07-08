import { Head, Link } from '@inertiajs/react';
import { ClipboardList, FileHeart, HandHeart, Settings } from 'lucide-react';
import { Button } from '@/components/reclaim/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reclaim/card';
import { EmptyState } from '@/components/reclaim/empty-state';
import { StatusBadge } from '@/components/reclaim/badge';
import { edit, show } from '@/routes/reports';
import { edit as profileEdit } from '@/routes/profile';
import { create } from '@/routes/reports';
import type { ClaimSummary, ReportSummary } from '@/types/reclaim';

type Props = {
    stats: {
        reports: number;
        open_reports: number;
        claims: number;
    };
    myReports: Array<
        Pick<ReportSummary, 'id' | 'type' | 'status' | 'title' | 'created_at'> & {
            category: { id: number; name: string };
            township: { id: number; name: string };
        }
    >;
    myClaims: ClaimSummary[];
};

export default function Dashboard({ stats, myReports, myClaims }: Props) {
    return (
        <>
            <Head title="My Dashboard" />

            <div className="flex flex-col gap-8 p-4 md:p-6">
                <div>
                    <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
                    <p className="mt-2 text-muted-foreground">
                        Your reports and claims in one calm place.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: 'My reports',
                            value: stats.reports,
                            icon: FileHeart,
                            tone: 'text-terracotta bg-terracotta-soft/25',
                        },
                        {
                            label: 'Open reports',
                            value: stats.open_reports,
                            icon: ClipboardList,
                            tone: 'text-teal bg-teal-soft',
                        },
                        {
                            label: 'My claims',
                            value: stats.claims,
                            icon: HandHeart,
                            tone: 'text-sage bg-sage/15',
                        },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="flex items-center gap-4 pt-6">
                                <div
                                    className={`flex size-12 items-center justify-center rounded-2xl ${stat.tone}`}
                                >
                                    <stat.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="font-heading text-2xl font-semibold">
                                        {stat.value}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>My reports</CardTitle>
                            <Link href={create()}>
                                <Button size="sm">New report</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {myReports.length > 0 ? (
                                myReports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="flex flex-col gap-3 rounded-xl bg-cream-dark/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <Link
                                                href={show(report.id)}
                                                className="font-medium hover:text-primary"
                                            >
                                                {report.title}
                                            </Link>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {report.category.name} · {report.township.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={report.status} />
                                            <Link href={edit(report.id)}>
                                                <Button variant="ghost" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState
                                    icon={FileHeart}
                                    title="You haven't shared a report yet"
                                    description="When you do, it will appear here. We're wishing you only good news."
                                    action={
                                        <Link href={create()}>
                                            <Button>Create your first report</Button>
                                        </Link>
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My claims</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {myClaims.length > 0 ? (
                                myClaims.map((claim) => (
                                    <div
                                        key={claim.id}
                                        className="rounded-xl bg-cream-dark/60 p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <Link
                                                href={show(claim.report.id)}
                                                className="font-medium hover:text-primary"
                                            >
                                                {claim.report.title}
                                            </Link>
                                            <StatusBadge status={claim.status} />
                                        </div>
                                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                            {claim.proof_description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <EmptyState
                                    icon={HandHeart}
                                    title="No claims submitted yet"
                                    description="If you recognize a found item, you can gently submit a claim from its report page."
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-heading font-semibold">Profile settings</p>
                            <p className="text-sm text-muted-foreground">
                                Update your contact details and security preferences.
                            </p>
                        </div>
                        <Link href={profileEdit()}>
                            <Button variant="outline">
                                <Settings className="size-4" />
                                Open settings
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};

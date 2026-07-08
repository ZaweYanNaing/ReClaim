import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, MapPin, PawPrint, Sparkles } from 'lucide-react';
import { Button } from '@/components/reclaim/button';
import { Card, CardContent } from '@/components/reclaim/card';
import { EmptyState } from '@/components/reclaim/empty-state';
import { ReportCard } from '@/components/reclaim/report-card';
import { ReportFiltersBar } from '@/components/reclaim/report-filters-bar';
import { create, index } from '@/routes/reports';
import { register } from '@/routes';
import type { Category, ReportFilters, ReportSummary, Township } from '@/types/reclaim';

type Props = {
    recentReports: ReportSummary[];
    townships: Township[];
    categories: Category[];
    filters: ReportFilters;
};

export default function Welcome({ recentReports, townships, categories, filters }: Props) {
    const { auth } = usePage().props;

    function browseReports(query: Record<string, string>) {
        router.get(index(), query);
    }

    return (
        <>
            <Head title="ReClaim — Mandalay Lost & Found" />

            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.82_0.1_75/0.35),transparent_45%),radial-gradient(circle_at_bottom_right,oklch(0.88_0.03_188/0.45),transparent_40%)]" />
                <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
                    <div className="max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-terracotta-soft/25 px-4 py-1.5 text-sm font-medium text-terracotta">
                            <Sparkles className="size-4" />
                            Community care for Mandalay
                        </div>
                        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Helping neighbors find what matters most
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                            ReClaim is a gentle, trusted space to report lost belongings,
                            share found items, and support one another across all seven
                            townships.
                        </p>
                    </div>

                    <div className="mt-10 rounded-2xl border border-border/70 bg-card/90 p-5 shadow-soft backdrop-blur-sm sm:p-6">
                        <ReportFiltersBar
                            townships={townships}
                            categories={categories}
                            filters={filters}
                            onApply={browseReports}
                            compact
                        />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            icon: Heart,
                            title: 'Report with care',
                            text: 'Share what you lost so neighbors can keep an eye out.',
                        },
                        {
                            icon: MapPin,
                            title: 'Found something?',
                            text: 'Post found items by township so owners can recognize them.',
                        },
                        {
                            icon: PawPrint,
                            title: 'Pets are family',
                            text: 'Lost pets get the same gentle urgency as any treasured item.',
                        },
                    ].map((item) => (
                        <Card key={item.title}>
                            <CardContent className="space-y-3">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-soft text-teal">
                                    <item.icon className="size-5" />
                                </div>
                                <h2 className="font-heading text-lg font-semibold">
                                    {item.title}
                                </h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {item.text}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="font-heading text-2xl font-semibold">
                            Recent community reports
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Latest lost and found items shared by neighbors
                        </p>
                    </div>
                    <Link href={index()}>
                        <Button variant="outline">View all reports</Button>
                    </Link>
                </div>

                {recentReports.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recentReports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Sparkles}
                        title="No lost items reported yet — hope it stays that way!"
                        description="When someone needs help, their report will appear here. You can also browse categories like electronics, documents, and pets."
                        action={
                            auth.user ? (
                                <Link href={create()}>
                                    <Button>Share a report</Button>
                                </Link>
                            ) : (
                                <Link href={register()}>
                                    <Button>Join to share a report</Button>
                                </Link>
                            )
                        }
                    />
                )}

                <div className="mt-10 rounded-2xl bg-teal-soft/40 p-6 text-center sm:p-8">
                    <p className="font-heading text-lg font-semibold text-teal">
                        Covering {categories.length} categories across {townships.length} townships
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Aungmyethazan · Chanayethazan · Maha Aungmye · Chanmyathazi ·
                        Pyigyidagun · Amarapura · Patheingyi
                    </p>
                </div>
            </section>
        </>
    );
}

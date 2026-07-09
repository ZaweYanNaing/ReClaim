import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Heart,
    MapPin,
    PawPrint,
    Sparkles,
    ArrowRight,
    Search,
    Star,
    Users,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/reclaim/button';
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

const TICKER_ITEMS = [
    '✦ Lost something?',
    '✦ Found something?',
    '✦ Help your neighbor',
    '✦ Aungmyethazan',
    '✦ Chanayethazan',
    '✦ Maha Aungmye',
    '✦ Chanmyathazi',
    '✦ Pyigyidagun',
    '✦ Amarapura',
    '✦ Patheingyi',
    '✦ Free & community-run',
    '✦ 7 townships covered',
];

export default function Welcome({ recentReports, townships, categories, filters }: Props) {
    const { auth } = usePage().props;

    function browseReports(query: Record<string, string>) {
        router.get(index(), query);
    }

    return (
        <>
            <Head title="ReClaim — Mandalay Lost & Found" />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-white">
                {/* Animated background blobs */}
                <div
                    className="animate-blob absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-lime/20 blur-3xl pointer-events-none"
                    style={{ animationDelay: '0s' }}
                />
                <div
                    className="animate-blob absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-forest/8 blur-3xl pointer-events-none"
                    style={{ animationDelay: '3s' }}
                />
                <div
                    className="animate-blob absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-soft/40 blur-3xl pointer-events-none"
                    style={{ animationDelay: '6s' }}
                />

                <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        {/* Left — Text */}
                        <div>
                            {/* Badge */}
                            <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-4 py-1.5 text-sm font-semibold text-forest">
                                <Sparkles className="size-4 text-lime fill-lime" />
                                Community care for Mandalay
                            </div>

                            <h1 className="animate-fade-up delay-100 font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-forest sm:text-6xl lg:text-7xl">
                                Helping
                                <span className="relative inline-block ml-3">
                                    <span className="relative z-10">neighbors</span>
                                    <span
                                        className="absolute bottom-1 left-0 right-0 h-4 bg-lime/40 -skew-x-2 rounded"
                                        aria-hidden="true"
                                    />
                                </span>
                                <br />
                                find what
                                <br />
                                <span className="text-forest/40">matters most.</span>
                            </h1>

                            <p className="animate-fade-up delay-200 mt-6 text-lg leading-relaxed text-muted-foreground max-w-lg">
                                ReClaim is a trusted space to report lost belongings, share found
                                items, and support one another across all seven Mandalay townships.
                            </p>

                            <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link href={create()}>
                                        <Button variant="lime" size="lg">
                                            + Report an item
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={register()}>
                                        <Button variant="lime" size="lg">
                                            Join free
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </Link>
                                )}
                                <Link href={index()}>
                                    <Button variant="outline" size="lg">
                                        <Search className="size-4" />
                                        Browse reports
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="animate-fade-up delay-400 mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-4 text-forest" />
                                    Free forever
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-4 text-forest" />
                                    Community verified
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-4 text-forest" />
                                    7 townships
                                </span>
                            </div>
                        </div>

                        {/* Right — Floating cards */}
                        <div className="relative hidden lg:flex items-center justify-center h-[480px]">
                            {/* Main card */}
                            <div className="animate-float relative z-10 w-72 rounded-3xl bg-forest p-6 text-white shadow-forest">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-lime text-forest-dark">
                                        <Heart className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Community Report</p>
                                        <p className="text-xs text-white/50">Just posted · Aungmyethazan</p>
                                    </div>
                                </div>
                                <p className="font-heading font-bold text-lg mb-1">Lost: Black leather wallet</p>
                                <p className="text-sm text-white/60 mb-4">Contains ID and bank cards. Last seen near Zay Cho Market.</p>
                                <div className="flex items-center justify-between">
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">Documents</span>
                                    <span className="rounded-full bg-lime/20 text-lime px-3 py-1 text-xs font-semibold">Open</span>
                                </div>
                            </div>

                            {/* Floating stat: happy reunions */}
                            <div
                                className="animate-float absolute top-8 right-4 z-20 rounded-2xl bg-white shadow-soft-lg border border-border p-4 min-w-[150px]"
                                style={{ animationDelay: '1s' }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex size-8 items-center justify-center rounded-xl bg-lime/20 text-forest">
                                        <Users className="size-4" />
                                    </div>
                                    <p className="font-heading font-bold text-xl text-forest">
                                        {recentReports.length > 0 ? `${recentReports.length}+` : '50+'}
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">Active reports</p>
                            </div>

                            {/* Floating stat: 5-star */}
                            <div
                                className="animate-float absolute bottom-12 left-2 z-20 rounded-2xl bg-white shadow-soft-lg border border-border p-4"
                                style={{ animationDelay: '2s' }}
                            >
                                <div className="flex gap-0.5 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="size-4 fill-lime text-lime" />
                                    ))}
                                </div>
                                <p className="text-xs font-semibold text-forest">Community trusted</p>
                                <p className="text-[11px] text-muted-foreground">Free · Non-profit</p>
                            </div>
                        </div>
                    </div>

                    {/* Search/filter bar */}
                    <div className="animate-fade-up delay-500 mt-12 rounded-3xl border border-border/80 bg-white/80 p-5 shadow-soft-lg backdrop-blur-sm sm:p-6">
                        <p className="font-heading text-sm font-semibold text-forest mb-4 flex items-center gap-2">
                            <Search className="size-4" />
                            Search reports
                        </p>
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

            {/* ── Marquee ticker ── */}
            <div className="bg-lime overflow-hidden py-3 border-y border-lime/60">
                <div className="flex w-max animate-marquee gap-0">
                    {/* Duplicate for seamless loop */}
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span
                            key={i}
                            className="whitespace-nowrap px-6 text-sm font-bold text-forest tracking-wide"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Feature cards ── */}
            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="text-center mb-12 animate-fade-up">
                    <p className="inline-flex items-center gap-2 rounded-full bg-forest/8 px-4 py-1.5 text-sm font-semibold text-forest mb-4">
                        ✦ How it works
                    </p>
                    <h2 className="font-heading text-3xl font-extrabold text-forest sm:text-4xl">
                        Simple. Kind. Effective.
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        {
                            icon: Heart,
                            title: 'Report with care',
                            text: 'Share what you lost so neighbors can keep an eye out. Add a photo, description, and location to help people recognize it.',
                            color: 'bg-red-50 text-red-600',
                            delay: 'delay-100',
                            number: '01',
                        },
                        {
                            icon: MapPin,
                            title: 'Found something?',
                            text: 'Post found items by township so owners can recognize them. Even a small detail can help reunite someone with what they love.',
                            color: 'bg-lime/20 text-forest',
                            delay: 'delay-200',
                            number: '02',
                        },
                        {
                            icon: PawPrint,
                            title: 'Pets are family',
                            text: 'Lost pets get the same gentle urgency as any treasured item. Our community watches out for them too.',
                            color: 'bg-forest/10 text-forest',
                            delay: 'delay-300',
                            number: '03',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className={`animate-fade-up ${item.delay} rounded-3xl border border-border bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg hover:border-lime/40 relative overflow-hidden group`}
                        >
                            {/* Step number watermark */}
                            <span className="absolute top-4 right-5 font-heading text-5xl font-black text-black/4 select-none group-hover:text-lime/15 transition-colors">
                                {item.number}
                            </span>

                            <div
                                className={`flex size-12 items-center justify-center rounded-2xl ${item.color} mb-5 transition-transform duration-300 group-hover:scale-110`}
                            >
                                <item.icon className="size-6" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-forest mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Recent reports ── */}
            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-forest/8 px-4 py-1.5 text-sm font-semibold text-forest mb-3">
                            ✦ Latest activity
                        </p>
                        <h2 className="font-heading text-3xl font-extrabold text-forest">
                            Recent community reports
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Latest lost and found items shared by neighbors
                        </p>
                    </div>
                    <Link href={index()}>
                        <Button variant="outline" size="md">
                            View all
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>

                {recentReports.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recentReports.map((report, i) => (
                            <div
                                key={report.id}
                                className={`animate-fade-up delay-${Math.min(i * 100 + 100, 500)}`}
                            >
                                <ReportCard report={report} />
                            </div>
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
                                    <Button variant="lime">Share a report</Button>
                                </Link>
                            ) : (
                                <Link href={register()}>
                                    <Button variant="lime">Join to share a report</Button>
                                </Link>
                            )
                        }
                    />
                )}

                {/* CTA Strip */}
                <div className="mt-14 rounded-3xl bg-forest p-8 text-center sm:p-12 relative overflow-hidden">
                    {/* Decorative lime blob */}
                    <div className="absolute -top-16 -right-16 size-64 rounded-full bg-lime/15 blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-lime/10 blur-2xl" />

                    <div className="relative">
                        <p className="inline-flex items-center gap-2 rounded-full bg-lime/15 px-4 py-1.5 text-sm font-semibold text-lime mb-4">
                            ✦ Covering {categories.length} categories across {townships.length} townships
                        </p>
                        <h3 className="font-heading text-2xl font-extrabold text-white sm:text-3xl mb-3">
                            Someone out there recognizes what you lost.
                        </h3>
                        <p className="text-sm text-white/60 max-w-lg mx-auto mb-8">
                            Aungmyethazan · Chanayethazan · Maha Aungmye · Chanmyathazi ·
                            Pyigyidagun · Amarapura · Patheingyi
                        </p>
                        {auth.user ? (
                            <Link href={create()}>
                                <Button variant="lime" size="lg">
                                    Post a report now
                                    <ArrowRight className="size-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href={register()}>
                                <Button variant="lime" size="lg">
                                    Join the community
                                    <ArrowRight className="size-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

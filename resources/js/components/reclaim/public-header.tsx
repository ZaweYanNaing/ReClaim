import { Link, usePage } from '@inertiajs/react';
import { HeartHandshake, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/reclaim/button';
import { dashboard, home, login, register } from '@/routes';
import { create, index } from '@/routes/reports';

export function PublicHeader() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <Link href={home()} className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-terracotta-soft/30 text-terracotta">
                        <HeartHandshake className="size-5" />
                    </div>
                    <div>
                        <p className="font-heading text-lg font-semibold leading-none">
                            ReClaim
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Mandalay community lost & found
                        </p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    <Link
                        href={index()}
                        className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-gentle hover:bg-cream-dark hover:text-foreground"
                    >
                        Browse reports
                    </Link>
                    {auth.user ? (
                        <>
                            <Link href={create()}>
                                <Button variant="accent" size="sm">
                                    Report item
                                </Button>
                            </Link>
                            <Link href={dashboard()}>
                                <Button variant="outline" size="sm">
                                    Dashboard
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={login()}>
                                <Button variant="ghost" size="sm">
                                    Log in
                                </Button>
                            </Link>
                            <Link href={register()}>
                                <Button size="sm">Join the community</Button>
                            </Link>
                        </>
                    )}
                </nav>

                <button
                    type="button"
                    className="rounded-xl p-2 text-foreground md:hidden"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {open && (
                <div className="border-t border-border/70 px-4 py-4 md:hidden">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={index()}
                            className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-cream-dark"
                            onClick={() => setOpen(false)}
                        >
                            Browse reports
                        </Link>
                        {auth.user ? (
                            <>
                                <Link href={create()} onClick={() => setOpen(false)}>
                                    <Button className="w-full">Report item</Button>
                                </Link>
                                <Link href={dashboard()} onClick={() => setOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        Dashboard
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={login()} onClick={() => setOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href={register()} onClick={() => setOpen(false)}>
                                    <Button className="w-full">Join the community</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export function PublicFooter() {
    return (
        <footer className="border-t border-border/70 bg-cream-dark/60">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-heading text-base font-semibold">ReClaim Mandalay</p>
                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        A warm, community-led space to help neighbors reunite with lost
                        belongings and beloved pets.
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Free · Non-profit · Built for all 7 townships
                </p>
            </div>
        </footer>
    );
}

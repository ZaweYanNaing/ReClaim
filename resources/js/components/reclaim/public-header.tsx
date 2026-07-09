import { Link, usePage } from '@inertiajs/react';
import { HeartHandshake, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/reclaim/button';
import { dashboard, home, login, register } from '@/routes';
import { create, index } from '@/routes/reports';

export function PublicHeader() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-xl shadow-soft border-b border-border/60'
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                {/* Logo */}
                <Link href={home()} className="flex items-center gap-3 group">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-forest text-lime shadow-forest transition-all duration-300 group-hover:scale-110 group-hover:shadow-lime">
                        <HeartHandshake className="size-5" />
                    </div>
                    <div>
                        <p className="font-heading text-lg font-bold leading-none text-forest">
                            ReClaim
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                            Mandalay Lost &amp; Found
                        </p>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    <Link
                        href={index()}
                        className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-forest/5 hover:text-forest"
                    >
                        Browse reports
                    </Link>

                    {auth.user ? (
                        <>
                            <Link href={create()}>
                                <Button variant="lime" size="sm">
                                    + Report item
                                </Button>
                            </Link>
                            <Link href={dashboard()}>
                                <Button variant="accent" size="sm">
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
                                <Button variant="lime" size="sm">
                                    Join free
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile toggle */}
                <button
                    type="button"
                    className="rounded-xl p-2 text-forest transition-all hover:bg-forest/5 md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
                    open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="border-t border-border/60 bg-white/95 backdrop-blur-xl px-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={index()}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-forest/5 transition-all"
                            onClick={() => setOpen(false)}
                        >
                            Browse reports
                        </Link>
                        {auth.user ? (
                            <>
                                <Link href={create()} onClick={() => setOpen(false)}>
                                    <Button variant="lime" className="w-full">
                                        + Report item
                                    </Button>
                                </Link>
                                <Link href={dashboard()} onClick={() => setOpen(false)}>
                                    <Button variant="accent" className="w-full">
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
                                    <Button variant="lime" className="w-full">
                                        Join free
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export function PublicFooter() {
    return (
        <footer className="bg-forest text-white">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-lime text-forest-dark">
                                <HeartHandshake className="size-5" />
                            </div>
                            <p className="font-heading text-xl font-bold text-white">
                                ReClaim
                            </p>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                            A community-led platform helping Mandalay neighbors reunite with
                            lost belongings and beloved pets.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 text-sm">
                        <div>
                            <p className="font-semibold text-lime mb-3">Platform</p>
                            <ul className="space-y-2 text-white/60">
                                <li><Link href={index()} className="hover:text-white transition-colors">Browse reports</Link></li>
                                <li><Link href={register()} className="hover:text-white transition-colors">Join the community</Link></li>
                                <li><Link href={login()} className="hover:text-white transition-colors">Sign in</Link></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-lime mb-3">Coverage</p>
                            <ul className="space-y-2 text-white/60 text-xs">
                                <li>Aungmyethazan</li>
                                <li>Chanayethazan</li>
                                <li>Maha Aungmye</li>
                                <li>+ 4 more townships</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} ReClaim Mandalay. Free · Non-profit · Community driven.
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 px-3 py-1 text-xs font-medium text-lime">
                        ✦ 7 townships covered
                    </span>
                </div>
            </div>
        </footer>
    );
}

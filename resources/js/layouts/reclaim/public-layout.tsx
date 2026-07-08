import type { ReactNode } from 'react';
import { PublicFooter, PublicHeader } from '@/components/reclaim/public-header';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    );
}

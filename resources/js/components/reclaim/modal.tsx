import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ReactNode } from 'react';

type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
};

export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border-border/80 bg-card shadow-soft-lg sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-heading text-xl">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="text-muted-foreground">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="py-2">{children}</div>
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}

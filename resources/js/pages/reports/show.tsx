import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    Check,
    HandHeart,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { StatusBadge, TypeBadge } from '@/components/reclaim/badge';
import { Button } from '@/components/reclaim/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reclaim/card';
import { Modal } from '@/components/reclaim/modal';
import { FormTextarea } from '@/components/reclaim/form-input';
import { approve, reject } from '@/routes/claims';
import { destroy, edit } from '@/routes/reports';
import { store as storeClaim } from '@/routes/reports/claims';
import { login } from '@/routes';
import type { ClaimItem, ReportDetail } from '@/types/reclaim';

type Props = {
    report: ReportDetail;
    canManage: boolean;
    canReviewClaims: boolean;
    canClaim: boolean;
    userClaim: ClaimItem | null;
    claims: ClaimItem[];
};

export default function ReportShow({
    report,
    canManage,
    canReviewClaims,
    canClaim,
    userClaim,
    claims,
}: Props) {
    const { auth } = usePage().props;
    const [claimOpen, setClaimOpen] = useState(false);

    const showClaimAction =
        report.type === 'found' &&
        report.status !== 'resolved' &&
        !canManage;

    function handleDelete() {
        if (
            !confirm(
                'Remove this report? Neighbors will no longer be able to find it in the community feed.',
            )
        ) {
            return;
        }

        router.delete(destroy(report.id));
    }

    function handleApprove(claimId: number) {
        if (!confirm('Approve this claim and mark the report as resolved?')) {
            return;
        }

        router.patch(approve(claimId));
    }

    function handleReject(claimId: number) {
        if (!confirm('Reject this claim?')) {
            return;
        }

        router.patch(reject(claimId));
    }

    return (
        <>
            <Head title={report.title} />

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
                            {report.photo_url ? (
                                <img
                                    src={report.photo_url}
                                    alt={report.title}
                                    className="aspect-[16/10] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-terracotta-soft/20 to-teal-soft/50 text-terracotta">
                                    <MapPin className="size-16 opacity-50" />
                                </div>
                            )}
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-wrap gap-2">
                                    <TypeBadge type={report.type} />
                                    <StatusBadge status={report.status} />
                                    {report.verified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-3 py-1 text-xs font-medium text-teal">
                                            <ShieldCheck className="size-3" />
                                            Verified report
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-2xl">{report.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="leading-relaxed text-muted-foreground">
                                    {report.description}
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl bg-cream-dark/70 p-4">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Location
                                        </p>
                                        <p className="mt-1 font-medium">
                                            {report.township.name}
                                            {report.ward ? `, ${report.ward}` : ''}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-cream-dark/70 p-4">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Category
                                        </p>
                                        <p className="mt-1 font-medium">
                                            {report.category.name}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {canReviewClaims && claims.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <HandHeart className="size-5 text-terracotta" />
                                        Claims to review
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {claims.map((claim) => (
                                        <div
                                            key={claim.id}
                                            className="rounded-xl bg-cream-dark/60 p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {claim.claimant.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {claim.claimant.email}
                                                    </p>
                                                </div>
                                                <StatusBadge status={claim.status} />
                                            </div>
                                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                {claim.proof_description}
                                            </p>
                                            {claim.status === 'pending' && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleApprove(claim.id)
                                                        }
                                                    >
                                                        <Check className="size-4" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleReject(claim.id)
                                                        }
                                                    >
                                                        <X className="size-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="size-5 text-teal" />
                                    Community comments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {report.comments.length > 0 ? (
                                    report.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="rounded-xl bg-cream-dark/60 p-4"
                                        >
                                            <p className="text-sm font-medium">
                                                {comment.user.name}
                                            </p>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                {comment.message}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No comments yet. A kind note of encouragement can mean a
                                        lot to someone searching.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="space-y-5 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-terracotta-soft/25 text-terracotta">
                                        <User className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{report.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Reported this item
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="size-4" />
                                    {report.date_occurred
                                        ? new Date(report.date_occurred).toLocaleDateString()
                                        : 'Date not specified'}
                                </div>

                                {showClaimAction && (
                                    <>
                                        {canClaim && (
                                            <Button
                                                className="w-full"
                                                onClick={() => setClaimOpen(true)}
                                            >
                                                <HandHeart className="size-4" />
                                                Claim This Item
                                            </Button>
                                        )}
                                        {!auth.user && (
                                            <Link href={login()}>
                                                <Button className="w-full">
                                                    Sign in to claim this item
                                                </Button>
                                            </Link>
                                        )}
                                        {auth.user && userClaim && (
                                            <div className="rounded-xl bg-cream-dark/70 p-4 text-sm">
                                                <p className="font-medium">Your claim</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <StatusBadge status={userClaim.status} />
                                                    <span className="text-muted-foreground">
                                                        Submitted{' '}
                                                        {new Date(
                                                            userClaim.created_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {canManage && (
                                    <>
                                        <Link href={edit(report.id)}>
                                            <Button variant="outline" className="w-full">
                                                Edit report
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 className="size-4" />
                                            Delete report
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal
                open={claimOpen}
                onOpenChange={setClaimOpen}
                title="Claim this item"
                description="Tell the finder gently how you can prove this item belongs to you. They will review your claim."
            >
                <Form
                    {...storeClaim.form(report.id)}
                    resetOnSuccess
                    onSuccess={() => setClaimOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormTextarea
                                label="Proof description"
                                name="proof_description"
                                placeholder="Describe identifying details only you would know..."
                                hint="Please avoid sharing sensitive personal information publicly."
                                error={errors.proof_description}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setClaimOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit claim'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </Modal>
        </>
    );
}

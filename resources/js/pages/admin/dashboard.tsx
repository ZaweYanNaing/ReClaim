import { Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    ArchiveRestore,
    Check,
    CheckCircle2,
    ClipboardList,
    HandHeart,
    Users,
    X,
} from 'lucide-react';
import { StatusBadge } from '@/components/reclaim/badge';
import { AdminStatCard } from '@/components/reclaim/admin-stat-card';
import { AdminTablePagination } from '@/components/reclaim/admin-table-pagination';
import { Button } from '@/components/reclaim/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reclaim/card';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    destroy as destroyClaim,
    restore as restoreClaim,
} from '@/routes/admin/claims';
import {
    destroy as destroyReport,
    restore as restoreReport,
    status as updateReportStatus,
} from '@/routes/admin/reports';
import {
    destroy as destroyUser,
    restore as restoreUser,
    role as updateUserRole,
} from '@/routes/admin/users';
import { approve, reject } from '@/routes/claims';
import { show } from '@/routes/reports';
import type { ClaimStatus, Paginated, ReportStatus, UserRole } from '@/types/reclaim';

type AdminReportRow = {
    id: number;
    title: string;
    type: string;
    status: ReportStatus;
    deleted_at: string | null;
    user: { id: number; name: string; email: string };
    category: { name: string };
    township: { name: string };
    created_at: string;
};

type AdminUserRow = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    deleted_at: string | null;
    created_at: string;
};

type AdminClaimRow = {
    id: number;
    status: ClaimStatus;
    proof_description: string;
    deleted_at: string | null;
    claimant: { id: number; name: string; email: string };
    report: { id: number; title: string };
    created_at: string;
};

type Props = {
    stats: {
        total_reports: number;
        resolved_reports: number;
        active_users: number;
        pending_claims: number;
    };
    filters: {
        archived: boolean;
    };
    reports: Paginated<AdminReportRow>;
    users: Paginated<AdminUserRow>;
    claims: Paginated<AdminClaimRow>;
};

const reportStatuses: Array<{ value: ReportStatus; label: string }> = [
    { value: 'open', label: 'Open' },
    { value: 'pending_claim', label: 'Pending claim' },
    { value: 'resolved', label: 'Resolved' },
];

export default function AdminDashboard({
    stats,
    filters,
    reports,
    users,
    claims,
}: Props) {
    function toggleArchivedView() {
        router.get(
            adminDashboard(),
            { archived: filters.archived ? undefined : 1 },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleApproveClaim(claimId: number) {
        if (!confirm('Approve this claim and mark the report as resolved?')) {
            return;
        }

        router.patch(approve(claimId));
    }

    function handleRejectClaim(claimId: number) {
        if (!confirm('Reject this claim?')) {
            return;
        }

        router.patch(reject(claimId));
    }

    function archiveReport(reportId: number) {
        if (!confirm('Archive this report? It will be hidden from the public feed.')) {
            return;
        }

        router.delete(destroyReport(reportId));
    }

    function restoreReportRow(reportId: number) {
        router.patch(restoreReport(reportId));
    }

    function updateReportStatusValue(reportId: number, status: ReportStatus) {
        router.patch(updateReportStatus(reportId), { status });
    }

    function archiveUser(userId: number) {
        if (!confirm('Archive this user? They will no longer be able to sign in.')) {
            return;
        }

        router.delete(destroyUser(userId));
    }

    function restoreUserRow(userId: number) {
        router.patch(restoreUser(userId));
    }

    function updateUserRoleValue(userId: number, role: UserRole) {
        router.patch(updateUserRole(userId), { role });
    }

    function archiveClaimRow(claimId: number) {
        if (!confirm('Archive this claim record?')) {
            return;
        }

        router.delete(destroyClaim(claimId));
    }

    function restoreClaimRow(claimId: number) {
        router.patch(restoreClaim(claimId));
    }

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-8 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-heading text-3xl font-bold">Admin dashboard</h1>
                        <p className="mt-2 text-muted-foreground">
                            Monitor community health and moderate reports, users, and claims.
                        </p>
                    </div>
                    <Button
                        variant={filters.archived ? 'secondary' : 'outline'}
                        onClick={toggleArchivedView}
                    >
                        {filters.archived ? (
                            <>
                                <ArchiveRestore className="size-4" />
                                View active records
                            </>
                        ) : (
                            <>
                                <Archive className="size-4" />
                                View archived records
                            </>
                        )}
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="Total reports"
                        value={stats.total_reports}
                        icon={ClipboardList}
                        tone="bg-terracotta-soft/25 text-terracotta"
                    />
                    <AdminStatCard
                        label="Resolved"
                        value={stats.resolved_reports}
                        icon={CheckCircle2}
                        tone="bg-sage/15 text-sage"
                    />
                    <AdminStatCard
                        label="Active users"
                        value={stats.active_users}
                        icon={Users}
                        tone="bg-teal-soft text-teal"
                    />
                    <AdminStatCard
                        label="Pending claims"
                        value={stats.pending_claims}
                        icon={HandHeart}
                        tone="bg-amber-warm/40 text-foreground"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="pb-3 pr-4 font-medium">Title</th>
                                    <th className="pb-3 pr-4 font-medium">Reporter</th>
                                    <th className="pb-3 pr-4 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.data.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="border-b border-border/60 align-top"
                                    >
                                        <td className="py-3 pr-4">
                                            <Link
                                                href={show(report.id)}
                                                className="font-medium hover:text-primary"
                                            >
                                                {report.title}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">
                                                {report.category.name} · {report.township.name}
                                            </p>
                                            {report.deleted_at && (
                                                <p className="mt-1 text-xs font-medium text-destructive">
                                                    Archived
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-muted-foreground">
                                            {report.user.name}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <StatusBadge status={report.status} />
                                        </td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {!report.deleted_at ? (
                                                    <>
                                                        <select
                                                            value={report.status}
                                                            onChange={(event) =>
                                                                updateReportStatusValue(
                                                                    report.id,
                                                                    event.target
                                                                        .value as ReportStatus,
                                                                )
                                                            }
                                                            className="h-9 rounded-xl border border-input bg-card px-3 text-xs"
                                                        >
                                                            {reportStatuses.map((status) => (
                                                                <option
                                                                    key={status.value}
                                                                    value={status.value}
                                                                >
                                                                    {status.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                archiveReport(report.id)
                                                            }
                                                        >
                                                            <Archive className="size-4" />
                                                            Archive
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            restoreReportRow(report.id)
                                                        }
                                                    >
                                                        <ArchiveRestore className="size-4" />
                                                        Restore
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminTablePagination pagination={reports} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="pb-3 pr-4 font-medium">Name</th>
                                    <th className="pb-3 pr-4 font-medium">Email</th>
                                    <th className="pb-3 pr-4 font-medium">Role</th>
                                    <th className="pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-border/60 align-top"
                                    >
                                        <td className="py-3 pr-4 font-medium">
                                            {user.name}
                                            {user.deleted_at && (
                                                <p className="mt-1 text-xs font-medium text-destructive">
                                                    Archived
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-muted-foreground">
                                            {user.email}
                                        </td>
                                        <td className="py-3 pr-4 capitalize">{user.role}</td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {!user.deleted_at ? (
                                                    <>
                                                        <select
                                                            value={user.role}
                                                            onChange={(event) =>
                                                                updateUserRoleValue(
                                                                    user.id,
                                                                    event.target
                                                                        .value as UserRole,
                                                                )
                                                            }
                                                            className="h-9 rounded-xl border border-input bg-card px-3 text-xs capitalize"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                archiveUser(user.id)
                                                            }
                                                        >
                                                            <Archive className="size-4" />
                                                            Archive
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            restoreUserRow(user.id)
                                                        }
                                                    >
                                                        <ArchiveRestore className="size-4" />
                                                        Restore
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminTablePagination pagination={users} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Claims</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="pb-3 pr-4 font-medium">Report</th>
                                    <th className="pb-3 pr-4 font-medium">Claimant</th>
                                    <th className="pb-3 pr-4 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.data.map((claim) => (
                                    <tr
                                        key={claim.id}
                                        className="border-b border-border/60 align-top"
                                    >
                                        <td className="py-3 pr-4">
                                            <Link
                                                href={show(claim.report.id)}
                                                className="font-medium hover:text-primary"
                                            >
                                                {claim.report.title}
                                            </Link>
                                            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                                {claim.proof_description}
                                            </p>
                                            {claim.deleted_at && (
                                                <p className="mt-1 text-xs font-medium text-destructive">
                                                    Archived
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-muted-foreground">
                                            {claim.claimant.name}
                                            <p className="text-xs">{claim.claimant.email}</p>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <StatusBadge status={claim.status} />
                                        </td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {!claim.deleted_at && (
                                                    <>
                                                        {claim.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleApproveClaim(
                                                                            claim.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Check className="size-4" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        handleRejectClaim(
                                                                            claim.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="size-4" />
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                archiveClaimRow(claim.id)
                                                            }
                                                        >
                                                            <Archive className="size-4" />
                                                            Archive
                                                        </Button>
                                                    </>
                                                )}
                                                {claim.deleted_at && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            restoreClaimRow(claim.id)
                                                        }
                                                    >
                                                        <ArchiveRestore className="size-4" />
                                                        Restore
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminTablePagination pagination={claims} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Admin', href: '/admin' }],
};

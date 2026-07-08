export type ReportType = 'lost' | 'found';

export type ReportStatus = 'open' | 'pending_claim' | 'resolved';

export type UserRole = 'user' | 'admin';

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Township {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    slug?: string;
    icon: string | null;
    sort_order?: number;
}

export interface UserSummary {
    id: number;
    name: string;
    email?: string;
    phone?: string | null;
    profile_photo?: string | null;
    role?: UserRole;
}

export interface ReportSummary {
    id: number;
    type: ReportType;
    status: ReportStatus;
    title: string;
    description: string;
    ward: string | null;
    photo_url: string | null;
    date_occurred: string | null;
    created_at: string;
    category: Pick<Category, 'id' | 'name' | 'icon'>;
    township: Pick<Township, 'id' | 'name'>;
    user: Pick<UserSummary, 'id' | 'name'>;
    verified: boolean;
}

export interface ReportDetail extends ReportSummary {
    user: Pick<UserSummary, 'id' | 'name' | 'email' | 'phone' | 'profile_photo'>;
    comments: CommentItem[];
}

export interface CommentItem {
    id: number;
    message: string;
    created_at: string;
    user: Pick<UserSummary, 'id' | 'name' | 'profile_photo'>;
}

export interface ClaimItem {
    id: number;
    status: ClaimStatus;
    proof_description: string;
    created_at: string;
    claimant: Pick<UserSummary, 'id' | 'name' | 'email'>;
}

export interface ClaimSummary {
    id: number;
    status: ClaimStatus;
    proof_description: string;
    created_at: string;
    report: {
        id: number;
        title: string;
        type: ReportType;
        category: Pick<Category, 'id' | 'name'>;
        township: Pick<Township, 'id' | 'name'>;
    };
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface ReportFilters {
    search?: string;
    township?: string;
    category?: string;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
}

export type User = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    profile_photo?: string | null;
    profile_photo_url?: string | null;
    avatar?: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

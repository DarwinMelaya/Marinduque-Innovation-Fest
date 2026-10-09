export type User = {
    id: number;
    name: string;
    booth_name: string | null;
    email: string | null;
    role: 'admin' | 'staff' | null;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

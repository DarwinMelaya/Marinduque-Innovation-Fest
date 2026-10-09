import AuthLayoutTemplate from "@/layouts/auth/auth-glass-layout";

export default function AuthLayout({
    title = "",
    description = "",
    wide = false,
    children,
}: {
    title?: string;
    description?: string;
    wide?: boolean;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} wide={wide}>
            {children}
        </AuthLayoutTemplate>
    );
}

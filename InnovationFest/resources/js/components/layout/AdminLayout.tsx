import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminSidebar from '@/components/layout/AdminSidebar';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
};

const AdminLayout = ({ breadcrumbs = [], children }: Props) => {
    // The wrapper themes server-rendered markup; <html> covers portalled menus, selects, and the mobile sidebar sheet.
    useEffect(() => {
        document.documentElement.classList.add('admin-theme');

        return () => document.documentElement.classList.remove('admin-theme');
    }, []);

    return (
        <div className="admin-theme contents">
            <AppShell variant="sidebar">
                <AdminSidebar />
                <AppContent
                    variant="sidebar"
                    className="min-w-0 overflow-x-clip font-sans text-white antialiased md:border md:border-white/10"
                >
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>
        </div>
    );
};

export default AdminLayout;

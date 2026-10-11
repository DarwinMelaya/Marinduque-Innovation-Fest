import type { ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PanelLayout from "@/components/layout/PanelLayout";
import type { BreadcrumbItem } from "@/types";

type Props = {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
};

const AdminLayout = ({ breadcrumbs, children }: Props) => (
    <PanelLayout sidebar={<AdminSidebar />} breadcrumbs={breadcrumbs}>
        {children}
    </PanelLayout>
);

export default AdminLayout;

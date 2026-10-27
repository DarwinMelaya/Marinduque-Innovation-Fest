import type { ReactNode } from "react";
import AttendanceSidebar from "@/components/layout/AttendanceSidebar";
import PanelLayout from "@/components/layout/PanelLayout";
import type { BreadcrumbItem } from "@/types";

type Props = {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
};

const AttendanceLayout = ({ breadcrumbs, children }: Props) => (
    <PanelLayout sidebar={<AttendanceSidebar />} breadcrumbs={breadcrumbs}>
        {children}
    </PanelLayout>
);

export default AttendanceLayout;

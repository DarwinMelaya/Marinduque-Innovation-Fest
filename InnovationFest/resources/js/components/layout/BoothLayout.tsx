import type { ReactNode } from 'react';
import BoothSidebar from '@/components/layout/BoothSidebar';
import PanelLayout from '@/components/layout/PanelLayout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
};

const BoothLayout = ({ breadcrumbs, children }: Props) => (
    <PanelLayout sidebar={<BoothSidebar />} breadcrumbs={breadcrumbs}>
        {children}
    </PanelLayout>
);

export default BoothLayout;

import { LayoutGrid, UserCog, Users } from 'lucide-react';
import PanelSidebar from '@/components/layout/PanelSidebar';
import { dashboard } from '@/routes/admin';
import { index as participantsIndex } from '@/routes/admin/participants';
import { index as staffIndex } from '@/routes/admin/staff';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Registered Participants',
        href: participantsIndex(),
        icon: Users,
    },
    {
        title: 'Registered Staff',
        href: staffIndex(),
        icon: UserCog,
    },
];

const AdminSidebar = () => (
    <PanelSidebar homeHref={dashboard()} navItems={navItems} />
);

export default AdminSidebar;

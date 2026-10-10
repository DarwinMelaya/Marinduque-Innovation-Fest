import { LayoutGrid, QrCode, Trophy, UserCog, Users } from 'lucide-react';
import PanelSidebar from '@/components/layout/PanelSidebar';
import { dashboard } from '@/routes/admin';
import { index as participantsIndex } from '@/routes/admin/participants';
import { index as qrCodesIndex } from '@/routes/admin/qr-codes';
import { index as staffIndex } from '@/routes/admin/staff';
import { index as visitorsIndex } from '@/routes/admin/visitors';
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
        title: 'Generate QR Code',
        href: qrCodesIndex(),
        icon: QrCode,
    },
    {
        title: 'Visitors & Points',
        href: visitorsIndex(),
        icon: Trophy,
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

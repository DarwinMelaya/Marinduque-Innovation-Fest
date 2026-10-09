import { ClipboardList, House } from 'lucide-react';
import PanelSidebar from '@/components/layout/PanelSidebar';
import { home, visits } from '@/routes/booth';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    {
        title: 'Home',
        href: home(),
        icon: House,
    },
    {
        title: 'Visits',
        href: visits(),
        icon: ClipboardList,
    },
];

const BoothSidebar = () => (
    <PanelSidebar homeHref={home()} navItems={navItems} />
);

export default BoothSidebar;

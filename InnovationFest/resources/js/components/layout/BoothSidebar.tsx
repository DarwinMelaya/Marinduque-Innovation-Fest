import { ClipboardList, House } from 'lucide-react';
import PanelSidebar from '@/components/layout/PanelSidebar';
import { home } from '@/routes/booth';
import { index as visitsIndex } from '@/routes/booth/visits';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    {
        title: 'Home',
        href: home(),
        icon: House,
    },
    {
        title: 'Visits',
        href: visitsIndex(),
        icon: ClipboardList,
    },
];

const BoothSidebar = () => (
    <PanelSidebar homeHref={home()} navItems={navItems} />
);

export default BoothSidebar;

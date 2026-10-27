import { House } from "lucide-react";
import PanelSidebar from "@/components/layout/PanelSidebar";
import { home } from "@/routes/attendance";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
    {
        title: "Scan",
        href: home(),
        icon: House,
    },
];

const AttendanceSidebar = () => (
    <PanelSidebar
        homeHref={home()}
        navGroups={[{ label: "Menu", items: navItems }]}
    />
);

export default AttendanceSidebar;

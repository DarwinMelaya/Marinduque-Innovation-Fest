import {
    ClipboardCheck,
    LayoutGrid,
    QrCode,
    Trophy,
    UserCog,
    Users,
} from "lucide-react";
import PanelSidebar from "@/components/layout/PanelSidebar";
import type { NavGroup } from "@/components/layout/PanelSidebar";
import { dashboard } from "@/routes/admin";
import { index as evaluationsIndex } from "@/routes/admin/evaluations";
import { index as participantsIndex } from "@/routes/admin/participants";
import { index as qrCodesIndex } from "@/routes/admin/qr-codes";
import { index as staffIndex } from "@/routes/admin/staff";
import { index as visitorsIndex } from "@/routes/admin/visitors";

const navGroups: NavGroup[] = [
    {
        label: "Overview",
        items: [
            {
                title: "Dashboard",
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: "People",
        items: [
            {
                title: "Registered Participants",
                href: participantsIndex(),
                icon: Users,
            },
            {
                title: "Registered Staff",
                href: staffIndex(),
                icon: UserCog,
            },
        ],
    },
    {
        label: "Engagement",
        items: [
            {
                title: "Visitors & Points",
                href: visitorsIndex(),
                icon: Trophy,
            },
            {
                title: "Generate QR Code",
                href: qrCodesIndex(),
                icon: QrCode,
            },
            {
                title: "Evaluations",
                href: evaluationsIndex(),
                icon: ClipboardCheck,
            },
        ],
    },
];

const AdminSidebar = () => (
    <PanelSidebar homeHref={dashboard()} navGroups={navGroups} />
);

export default AdminSidebar;

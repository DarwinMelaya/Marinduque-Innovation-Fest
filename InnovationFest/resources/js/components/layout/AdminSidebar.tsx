import { Link } from '@inertiajs/react';
import { LayoutGrid, Users } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes/admin';
import { index as participantsIndex } from '@/routes/admin/participants';
import type { NavItem } from '@/types';
import logo from '../../../pictures/Marinduque Innovation Fest 206 logo.png';

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
];

const AdminSidebar = () => {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader className="border-b border-white/10 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-transparent active:bg-transparent"
                        >
                            <Link href={dashboard()} prefetch>
                                <img
                                    src={logo}
                                    alt="Marinduque Innovation Fest"
                                    className="size-9 shrink-0 object-contain"
                                />
                                <span className="truncate text-sm leading-tight font-extrabold tracking-wide uppercase">
                                    Marinduque
                                    <br />
                                    <span className="text-white/75">
                                        Innovation Fest
                                    </span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="pt-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-1">
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    className="h-11 rounded-lg px-3 text-[15px] font-medium text-white/90 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/15 data-[active=true]:font-semibold data-[active=true]:text-white [&>svg]:size-5 data-[active=true]:[&>svg]:text-[#F15E00]"
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
};

export default AdminSidebar;

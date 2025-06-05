
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/Logo";
import { User, History, ArrowRightLeft, Repeat, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';

const navItems = [
  { href: "/dashboard/my-profile", label: "My Profile", icon: User },
  { href: "/dashboard/my-accounts", label: "My Accounts", icon: Wallet },
  { href: "/dashboard/history", label: "Transaction History", icon: History },
  { href: "/dashboard/transfer", label: "Transfer", icon: ArrowRightLeft },
  { href: "/dashboard/currency-conversion", label: "Currency Conversion", icon: Repeat },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Sidebar side="left" collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Logo showText={true} />
        <div className="md:hidden"> {/* Only show trigger on small screens if sidebar is collapsed */}
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href === "/dashboard/currency-conversion" && pathname === "/dashboard")}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button variant="ghost" onClick={logout} className="w-full justify-start text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:justify-center">
          <LogOut className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

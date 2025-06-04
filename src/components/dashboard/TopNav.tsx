"use client";

import { Logo } from "@/components/shared/Logo";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Button } from "@/components/ui/button";
import { HelpCircle, PanelLeft } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function TopNav() {
  const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        {isMobile && <SidebarTrigger />}
        <div className="hidden md:block">
          <Logo showText={false} size="md" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/help">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Link>
        </Button>
        <UserProfileDropdown />
      </div>
    </header>
  );
}

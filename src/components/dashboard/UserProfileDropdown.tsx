"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserCircle, Settings } from "lucide-react";
import Link from "next/link";

export function UserProfileDropdown() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 rounded-full px-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentUser.avatar || `https://placehold.co/40x40.png?text=${currentUser?.name?.charAt(0) ?? "U"}`}
                alt={currentUser?.name ?? "User"}
                data-ai-hint="profile person"
              />
              <AvatarFallback>{currentUser?.name?.charAt(0)?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block text-sm font-medium">{currentUser.name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/my-profile" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
           <Link href="/dashboard/settings" className="flex items-center"> {/* Assuming a settings page */}
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

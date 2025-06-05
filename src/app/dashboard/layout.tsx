"use client";

import React, { useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    // You can return a loading spinner or null while redirecting
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopNav />
          <main className="flex-1 p-6 overflow-auto bg-[hsl(var(--dashboard-main-content-background))]">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

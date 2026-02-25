import React, { memo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search, Server } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import Link from "next/link";

const PUBLIC_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password", "/terms", "/privacy"];

// Memoize the layout to prevent re-renders during navigation
export const AppLayout = memo(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading, currentServer } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isPublicPage = PUBLIC_PAGES.includes(router.pathname);

  // Do not render shell on public pages to avoid double-wrapping
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50/50">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-white px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-4 px-2">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 leading-tight">
                    {currentServer?.name || "Orchestrix"}
                  </span>
                  {currentServer && (
                    <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Live Production Node
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/servers">
                <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Server className="h-4 w-4" />
                  <span>Mission Control</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative text-gray-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
              <GlobalScheduleButton />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
});

AppLayout.displayName = "AppLayout";

function GlobalScheduleButton() {
  const { setIsCreateDialogOpen } = useEvent();
  return (
    <Button 
      onClick={() => setIsCreateDialogOpen(true)}
      className="bg-gray-900 hover:bg-gray-800 text-white gap-2 font-medium"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">Schedule Event</span>
    </Button>
  );
}
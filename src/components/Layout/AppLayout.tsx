import React, { memo } from "react";
import { useRouter } from "next/router";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";

const PUBLIC_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password", "/terms", "/privacy"];

// Memoize the layout to prevent re-renders during navigation
export const AppLayout = memo(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
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
                <span className="text-xl font-bold text-gray-900">Orchestrix</span>
                <div className="hidden md:flex items-center relative">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Ask Orchestrix..." 
                    className="pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-md text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
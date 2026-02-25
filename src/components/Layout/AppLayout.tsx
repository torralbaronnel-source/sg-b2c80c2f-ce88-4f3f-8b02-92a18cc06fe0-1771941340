import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

function Header() {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold tracking-tight text-[#6264a7]">ORCHESTRIX</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9"><Search className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9"><Bell className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9"><Settings className="h-4 w-4" /></Button>
      </div>
    </header>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const isCommunicationPage = router.pathname === "/communication";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className={cn(
            "flex-1 overflow-hidden",
            isCommunicationPage ? "p-0" : "p-4 md:p-6 overflow-y-auto"
          )}>
            <div className={cn(
              "h-full w-full",
              !isCommunicationPage && "mx-auto max-w-7xl"
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
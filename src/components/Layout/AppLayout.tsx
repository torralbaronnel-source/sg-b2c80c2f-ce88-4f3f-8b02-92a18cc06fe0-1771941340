import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NeuralProxy } from "@/components/Modules/NeuralProxy";

interface AppLayoutProps {
  children: React.ReactNode;
}

function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-bold tracking-tight text-[#6264a7]">ORCHESTRIX</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const isCommunicationPage = router.pathname === "/communication";

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden">
        <Header />
        <main
          className={cn(
            "flex-1",
            isCommunicationPage
              ? "overflow-hidden p-0"
              : "overflow-y-auto p-4 md:p-6"
          )}
        >
          <div
            className={cn(
              "h-full w-full",
              !isCommunicationPage && "mx-auto max-w-7xl"
            )}
          >
            {children}
          </div>
        </main>
      </SidebarInset>
      <NeuralProxy />
      <Toaster />
    </SidebarProvider>
  );
}
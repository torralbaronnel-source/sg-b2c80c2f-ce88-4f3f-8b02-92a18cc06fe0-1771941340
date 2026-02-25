import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { Server, Activity } from "lucide-react";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          {/* Enhanced Header with Branding & Infrastructure Trigger */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xl shadow-lg shadow-amber-500/20">
                  R
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Red Production</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Active Production Node</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/servers">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm">
                  <Server className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-xs">Manage Infrastructure</span>
                </Button>
              </Link>
              <div className="h-8 w-[1px] bg-slate-200 mx-2" />
              <ThemeSwitch />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
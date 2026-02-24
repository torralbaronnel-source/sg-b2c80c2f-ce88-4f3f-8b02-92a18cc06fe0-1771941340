import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Plus,
  ChevronRight,
  User,
  Clock,
  Briefcase,
  Map,
  DollarSign,
  FileText
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { EventSelector } from "@/components/EventHub/EventSelector";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { 
    id: "dashboard", 
    name: "Overview", 
    icon: LayoutDashboard, 
    path: "/dashboard" 
  },
  { 
    id: "crm", 
    name: "CRM & Leads", 
    icon: Users, 
    path: "/crm",
    subItems: [
      { name: "Inquiries", href: "/crm/inquiries", icon: Users },
      { name: "Clients", href: "/crm/clients", icon: User },
      { name: "Contracts", href: "/crm/contracts", icon: FileText },
    ]
  },
  { 
    id: "events",
    name: "Events",
    icon: Calendar,
    path: "/events",
    subItems: [
      { name: "Overview", href: "/events", icon: LayoutDashboard },
      { name: "Timeline", href: "/events/timeline", icon: Clock },
      { name: "Guest List", href: "/events/guests", icon: Users },
      { name: "Vendors", href: "/events/vendors", icon: Briefcase },
      { name: "Seating Plans", href: "/events/seating", icon: Map },
    ],
  },
  { 
    id: "comm", 
    name: "Communication", 
    icon: MessageSquare, 
    path: "/communication",
    subItems: [
      { name: "WhatsApp", href: "/whatsapp", icon: MessageSquare },
      { name: "Email", href: "/communication/email", icon: FileText },
    ]
  },
  { 
    id: "finance",
    name: "Finance",
    icon: CreditCard,
    path: "/finance",
    subItems: [
      { name: "Overview", href: "/finance", icon: LayoutDashboard },
      { name: "Budget", href: "/finance/budget", icon: DollarSign },
      { name: "Invoices", href: "/finance/invoices", icon: FileText },
      { name: "Payments", href: "/finance/payments", icon: CreditCard },
    ],
  },
  { 
    id: "analytics", 
    name: "Analytics", 
    icon: BarChart3, 
    path: "/analytics" 
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200 bg-white shadow-sm">
          <SidebarHeader className="border-b border-slate-100 p-4">
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-md shadow-indigo-200">
                O
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Orchestrix</span>
            </div>
            <div className="px-2 pb-2">
              <EventSelector />
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Platforms
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PLATFORMS.map((platform) => {
                    const isActive = router.pathname === platform.path || (platform.path !== "/dashboard" && router.pathname.startsWith(platform.path));
                    
                    return (
                      <SidebarMenuItem key={platform.id} className="mb-1">
                        <SidebarMenuButton 
                          asChild
                          isActive={isActive}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                            isActive 
                              ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100" 
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <Link href={platform.path}>
                            <platform.icon className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            <span>{platform.name}</span>
                          </Link>
                        </SidebarMenuButton>
                        
                        {isActive && platform.subItems && (
                          <div className="mt-1 ml-9 flex flex-col gap-1 border-l border-slate-100 pl-4">
                            {platform.subItems.map((sub) => {
                              const isSubActive = router.pathname === sub.href;
                              return (
                                <Link 
                                  key={sub.name} 
                                  href={sub.href}
                                  className={cn(
                                    "py-1 text-left text-xs font-medium transition-colors",
                                    isSubActive ? "text-indigo-600 font-semibold" : "text-slate-500 hover:text-indigo-600"
                                  )}
                                >
                                  {sub.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto border-t border-slate-100 p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 text-slate-600 hover:text-slate-900">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 text-slate-600 hover:text-slate-900">
                  <User className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">Production Team</span>
                    <span className="text-[10px] text-slate-400">Admin Account</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </Sidebar>

        {/* Main Workspace */}
        <div className="flex flex-1 flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-slate-900 capitalize">
                  {router.pathname.split("/")[1] || "Dashboard"}
                </span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-400 text-xs">Active Workspace</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Quick search (⌘+K)" 
                  className="h-9 w-64 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div className="flex items-center gap-3">
                <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Action</span>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-8">
            <div className="mx-auto max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
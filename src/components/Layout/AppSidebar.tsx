import * as React from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Package, 
  Shield, 
  HelpCircle,
  FileText,
  CreditCard,
  MessageSquare,
  Globe,
  Database,
  Briefcase,
  Zap,
  ClipboardList,
  MapPin,
  TrendingUp,
  Box,
  Server,
  Fingerprint
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Main Platforms",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Production Hub", url: "/production", icon: Briefcase },
      { title: "Communication", url: "/communication", icon: MessageSquare },
    ],
  },
  {
    title: "Event Management",
    items: [
      { title: "Events Hub", url: "/events", icon: Calendar },
      { title: "Itineraries", url: "/itineraries", icon: ClipboardList },
      { title: "Timelines", url: "/timelines", icon: Zap },
      { title: "Guest Manifest", url: "/guests", icon: Users },
      { title: "Venues", url: "/venues", icon: MapPin },
    ],
  },
  {
    title: "CRM & Sales",
    items: [
      { title: "CRM Dashboard", url: "/crm", icon: Globe },
      { title: "Leads", url: "/leads", icon: Zap },
      { title: "Quotes", url: "/quotes", icon: FileText },
    ],
  },
  {
    title: "Finance & Data",
    items: [
      { title: "Finance", url: "/finance", icon: CreditCard },
      { title: "Invoices", url: "/invoices", icon: TrendingUp },
      { title: "Inventory", url: "/inventory", icon: Box },
    ],
  },
  {
    title: "System & Admin",
    items: [
      { title: "Nodes & Servers", url: "/servers", icon: Server },
      { title: "Modules", url: "/modules", icon: Fingerprint },
      { title: "Super Admin", url: "/admin", icon: Shield },
      { title: "Portal Settings", url: "/admin/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="none" className="border-r bg-sidebar-background w-64 h-screen flex flex-col shrink-0 sticky top-0">
      <SidebarHeader className="border-b h-16 flex items-center px-6 shrink-0 bg-sidebar-background z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6264a7] text-white shadow-lg ring-1 ring-white/20">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black leading-none text-[#6264a7] tracking-tight">ORCHESTRIX</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Management Suite</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto scrollbar-hide hover:scrollbar-default py-4">
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-hide::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-hide::-webkit-scrollbar-thumb {
            background: rgba(98, 100, 167, 0.1);
            border-radius: 10px;
          }
          .scrollbar-hide:hover::-webkit-scrollbar-thumb {
            background: rgba(98, 100, 167, 0.2);
          }
        `}</style>
        
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <h2 className="px-6 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </h2>
            <nav className="space-y-1 px-2">
              {group.items.map((item) => {
                const isActive = router.pathname === item.url;
                return (
                  <Link 
                    key={item.title} 
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                      isActive 
                        ? "bg-[#6264a7]/10 text-[#6264a7] font-semibold" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0", 
                      isActive ? "text-[#6264a7]" : "text-muted-foreground/80 group-hover:text-accent-foreground"
                    )} />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Extra space to ensure the scroll is visible if content is long */}
        <div className="h-20" />
      </SidebarContent>

      <div className="mt-auto border-t p-4 bg-sidebar-background shrink-0">
        <div className="rounded-xl bg-gradient-to-br from-[#6264a7]/5 to-transparent p-4 border border-[#6264a7]/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fortress Health</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Database className="h-4 w-4 text-[#6264a7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Active Node</span>
              <span className="text-[10px] text-muted-foreground">RED_PROD_MAIN</span>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
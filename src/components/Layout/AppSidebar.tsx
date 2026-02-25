import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  MessageSquare,
  DollarSign,
  Package,
  FileText,
  Clock,
  MapPin,
  ClipboardList,
  CreditCard,
  Briefcase,
  ChevronDown,
  LayoutGrid,
  Zap,
  PlayCircle,
  Shield,
  Cpu,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

interface NavGroup {
  title: string;
  icon?: LucideIcon;
  items: NavItem[];
}

const navigationItems: NavGroup[] = [
  {
    title: "Main Platforms",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/",
      },
    ],
  },
  {
    title: "CRM & Clients",
    icon: Users,
    items: [
      { title: "Clients", url: "/crm", icon: Users },
      { title: "Leads & Pipeline", url: "/leads", icon: Zap },
      { title: "Communication Log", url: "/communication", icon: MessageSquare },
    ],
  },
  {
    title: "Event Management",
    icon: Calendar,
    items: [
      { title: "All Events", url: "/events", icon: Calendar },
      { title: "Production Hub", url: "/production", icon: PlayCircle },
      { title: "Event Timelines", url: "/timelines", icon: Clock },
      { title: "Venues", url: "/venues", icon: MapPin },
      { title: "Guest Lists", url: "/guests", icon: Users },
    ],
  },
  {
    title: "Finance",
    icon: DollarSign,
    items: [
      { title: "Quotes", url: "/quotes", icon: FileText },
      { title: "Invoices", url: "/invoices", icon: CreditCard },
      { title: "Payments", url: "/finance", icon: DollarSign },
      { title: "Contracts", url: "/terms", icon: Shield },
    ],
  },
  {
    title: "Resources",
    icon: Package,
    items: [
      { title: "Staff & Teams", url: "/admin", icon: Users },
      { title: "Vendor Directory", url: "/crm", icon: Briefcase },
      { title: "Global Modules", url: "/modules", icon: LayoutGrid },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: Cpu,
    items: [
      {
        title: "NANO Core",
        url: "/nano",
      },
      {
        title: "Admin Portal",
        url: "/admin",
      },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { user, profile, role } = useAuth();
  
  const hasAccess = (url: string) => {
    if (!role) return true;
    const r = role as any;
    if (r.hierarchy_level === 0) return true;
    
    // Map URL to permission key
    const pageKey = url === "/" ? "dashboard" : url.replace("/", "");
    const perms = r.permissions || {};
    return perms[pageKey]?.view !== false;
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 overflow-hidden p-1 shadow-sm border border-slate-100">
            <img 
              src="/LOGO_BRAND_ORCHESTRIX.PNG" 
              alt="Orchestrix Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">ORCHESTRIX</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Management Suite</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 pb-4">
        <SidebarMenu>
          {navigationItems.map((group, idx) => {
            // Filter group items based on access
            const accessibleItems = group.items.filter(item => hasAccess(item.url));
            if (accessibleItems.length === 0) return null;

            // Dashboard is top-level, not collapsible
            if (group.title === "Main Platforms") {
              return (
                <SidebarGroup key={idx}>
                  <SidebarGroupLabel className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                    {group.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    {accessibleItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={router.pathname === item.url}
                          className={cn(
                            "h-11 transition-all duration-200 rounded-xl px-3",
                            router.pathname === item.url
                              ? "bg-blue-50 text-blue-700 font-bold shadow-sm ring-1 ring-blue-100"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <Link href={item.url} className="flex items-center gap-3">
                            <item.icon className={cn("h-5 w-5", router.pathname === item.url ? "text-blue-600" : "text-slate-400")} />
                            <span className="text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            }

            // Other groups are collapsible
            const isGroupActive = accessibleItems.some(item => router.pathname === item.url);

            return (
              <Collapsible
                key={group.title}
                defaultOpen={isGroupActive}
                className="group/collapsible w-full mb-2"
              >
                <SidebarMenuItem className="list-none">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={cn(
                        "w-full h-11 justify-between transition-all duration-200 rounded-xl px-3",
                        isGroupActive ? "text-slate-900 font-bold" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {group.icon && <group.icon className={cn("h-5 w-5", isGroupActive ? "text-blue-600" : "text-slate-400")} />}
                        <span className="text-sm">{group.title}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="animate-in slide-in-from-top-1 duration-200">
                    <SidebarMenu className="mt-1 space-y-1 pl-4 border-l border-slate-100 ml-5">
                      {accessibleItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={router.pathname === item.url}
                            className={cn(
                              "h-9 transition-all duration-200 rounded-lg px-3",
                              router.pathname === item.url
                                ? "bg-blue-50 text-blue-700 font-bold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              {item.icon && <item.icon className={cn("h-4 w-4", router.pathname === item.url ? "text-blue-600" : "text-slate-400")} />}
                              <span className="text-xs">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="mx-4 opacity-50" />

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 w-full justify-start gap-4 rounded-xl px-4 hover:bg-slate-50 transition-colors"
            >
              <Link href="/profile">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-bold">
                  RT
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-bold text-slate-900 truncate w-full">Ronnel Torralba</span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Super Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
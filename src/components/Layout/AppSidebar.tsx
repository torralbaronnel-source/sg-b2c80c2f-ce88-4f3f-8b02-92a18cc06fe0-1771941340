import * as React from "react"
import {
  Search,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  LayoutDashboard,
  LogOut,
  MapPin,
  Briefcase,
  Package,
  Heart,
  FileText,
  Clock,
  ShieldCheck,
  Truck,
  Database,
  Users2,
  PhoneCall,
  ClipboardList,
  Store,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { memo } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "CRM & Clients",
    icon: Users,
    children: [
      { name: "Clients", href: "/crm" },
      { name: "Leads & Pipeline", href: "/leads" },
      { name: "Communication Log", href: "/communications" },
    ],
  },
  {
    name: "Event Management",
    icon: Calendar,
    children: [
      { name: "All Events", href: "/events" },
      { name: "Event Timelines", href: "/timelines" },
      { name: "Venues", href: "/venues" },
      { name: "Guest Lists", href: "/guests" },
    ],
  },
  {
    name: "Finance",
    icon: DollarSign,
    children: [
      { name: "Quotes", href: "/quotes" },
      { name: "Invoices", href: "/invoices" },
      { name: "Payments", href: "/finance" },
      { name: "Contracts", href: "/contracts" },
    ],
  },
  {
    name: "Resources",
    icon: Briefcase,
    children: [
      { name: "Services & Packages", href: "/services" },
      { name: "Staff & Crew", href: "/staff" },
      { name: "Vendors", href: "/vendors" },
      { name: "Equipment", href: "/equipment" },
    ],
  },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  { name: "WhatsApp", href: "/whatsapp", icon: MessageSquare },
  { name: "Settings", href: "/profile", icon: Settings },
]

const systemItems = [
  {
    title: "AI Assistant",
    url: "/whatsapp",
    icon: MessageSquare,
  },
  {
    title: "Super Admin",
    url: "/admin?tab=super",
    icon: Settings,
  }
]

function NavItem({ item, isActive }: { item: any, isActive: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "transition-all duration-200",
          isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
        )}
      >
        <Link href={item.url} prefetch={true}>
          <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const MemoizedNavItem = memo(NavItem);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { profile, currentServer } = useAuth()

  return (
    <Sidebar className="border-r border-neutral-100 bg-white" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <span className="text-xl font-black italic">
              {currentServer?.name?.[0] || "O"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-sm tracking-tight text-foreground uppercase">
              {currentServer?.name || "ORCHESTRIX"}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              {currentServer ? "Active Production Node" : "Operating System"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>Main Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <MemoizedNavItem 
                  key={item.title} 
                  item={item} 
                  isActive={router.pathname === item.url} 
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System & Dev</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <MemoizedNavItem 
                  key={item.title} 
                  item={item} 
                  isActive={router.pathname === item.url} 
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 bg-brand-secondary/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/profile" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <UserCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">{profile?.full_name || "Admin User"}</span>
                  <span className="text-xs text-gray-500">Lead Coordinator</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
import * as React from "react"
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  Wallet,
  Settings,
  ShieldCheck,
  Zap,
  Bot,
  UserCircle
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

const navItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Production Hub",
    url: "/events",
    icon: Zap,
    badge: "Live"
  },
  {
    title: "Communication",
    url: "/communication",
    icon: MessageSquare,
  },
  {
    title: "CRM & Clients",
    url: "/crm",
    icon: Users,
  },
  {
    title: "Finance",
    url: "/finance",
    icon: Wallet,
  },
  {
    title: "Portal Admin",
    url: "/admin",
    icon: ShieldCheck,
  },
]

const systemItems = [
  {
    title: "AI Assistant",
    url: "/whatsapp",
    icon: Bot,
  },
  {
    title: "Super Admin",
    url: "/admin?tab=super",
    icon: Settings,
  }
]

export function AppSidebar() {
  const router = useRouter()
  const { profile } = useAuth()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">Orchestrix</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={router.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto flex h-5 items-center rounded bg-red-100 px-1.5 text-[10px] font-medium text-red-600">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System & Dev</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={router.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
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
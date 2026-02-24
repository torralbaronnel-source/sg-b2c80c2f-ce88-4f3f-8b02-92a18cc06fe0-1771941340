import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  CreditCard, 
  Settings, 
  ChevronDown,
  Search,
  Bell,
  Sparkles,
  Briefcase,
  LogOut,
  Check,
  ChevronsUpDown,
  PlusCircle,
  Building2,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEvent } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Production Hub", href: "/events", icon: Calendar, badge: "Live" },
  { name: "Communication", href: "/communication", icon: MessageSquare },
  { name: "CRM & Clients", href: "/crm", icon: Users },
  { name: "Finance", href: "/finance", icon: CreditCard },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeEvent, recentEvents, setActiveEvent } = useEvent();
  const { user, signOut, activeOrg, setActiveOrg, organizations } = useAuth();

  // For now, we'll allow anyone with "owner" role or your specific user ID to see the admin link
  // In production, this would be restricted to platform admins only
  const isSuperAdmin = true; 

  const navigation = {
    main: [
      { name: "Settings", href: "/profile", icon: Settings },
    ],
    admin: [
      { name: "Super Admin", href: "/admin", icon: ShieldCheck },
    ]
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-sidebar-border/5">
            <div className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      {activeOrg?.logo_url ? (
                        <Image 
                          src={activeOrg.logo_url} 
                          alt={activeOrg.name} 
                          width={40} 
                          height={40} 
                          className="rounded-lg object-contain mix-blend-multiply"
                        />
                      ) : (
                        <Building2 className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="font-semibold truncate text-sidebar-foreground">
                        {activeOrg?.name || "Select Organization"}
                      </span>
                      <span className="text-xs text-sidebar-foreground/60 truncate capitalize">
                        {activeOrg?.subscription_plan || "Free Plan"}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/40 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[240px]" align="start">
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Organizations</DropdownMenuLabel>
                  {organizations.map((org) => (
                    <DropdownMenuItem 
                      key={org.id} 
                      onClick={() => setActiveOrg(org)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
                        {org.logo_url ? (
                          <Image src={org.logo_url} alt={org.name} width={20} height={20} className="object-contain" />
                        ) : (
                          <Building2 className="h-3 w-3" />
                        )}
                      </div>
                      <span className="flex-1 truncate">{org.name}</span>
                      {activeOrg?.id === org.id && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-primary">
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Organization</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-4">Main Menu</p>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "transition-all duration-200",
                        isActive ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-rose-500 hover:bg-rose-500 text-[10px] h-4 px-1">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-6">Quick Access</p>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="AI Assistant" className="text-slate-500">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  <span>AI Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Vendor Portal" className="text-slate-500">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Vendor Portal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {isSuperAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.admin.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={router.pathname === item.href}
                          tooltip={item.name}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs uppercase">
                    {user?.email?.charAt(0) || "A"}
                  </div>
                  <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
                    <p className="text-sm font-bold truncate text-slate-900">Admin User</p>
                    <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">Lead Coordinator</p>
                  </div>
                  <Settings className="w-4 h-4 text-slate-400 group-data-[state=collapsed]:hidden" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-rose-500 focus:text-rose-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 text-slate-500" />
              <Separator orientation="vertical" className="h-6 mx-2" />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2 border-slate-200 shadow-sm font-medium bg-white">
                    {activeEvent ? activeEvent.title : "Select Active Event"}
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <div className="p-2">
                    <Input placeholder="Search events..." className="h-8 mb-2" />
                    {recentEvents.map(event => (
                      <DropdownMenuItem 
                        key={event.id}
                        onClick={() => setActiveEvent(event)}
                        className="flex flex-col items-start gap-1 py-2"
                      >
                        <span className="font-bold text-sm">{event.title}</span>
                        <span className="text-xs text-slate-500">{event.client} • {event.date}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative w-64 lg:w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Ask Orchestrix..." 
                  className="pl-9 h-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-300 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </Button>
              <div className="h-8 w-px bg-slate-200 mx-2" />
              <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg h-9 font-medium shadow-sm px-4">
                New Project
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
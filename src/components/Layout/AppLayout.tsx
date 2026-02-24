import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  MessageSquare,
  Sparkles,
  Settings,
  ShieldAlert,
  Menu,
  ChevronLeft,
  Search,
  Bell,
  LogOut,
  User,
  Building2,
  Terminal,
  ShieldCheck,
  CreditCard,
  ChevronsUpDown,
  Check,
  PlusCircle,
  ChevronDown
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
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEvent } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { format } from "date-fns";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Production Hub", href: "/events", icon: Calendar, badge: "Live" },
  { name: "Communication", href: "/communication", icon: MessageSquare },
  { name: "CRM & Clients", href: "/crm", icon: Users },
  { name: "Finance", href: "/finance", icon: CreditCard },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { events, activeEvent, setActiveEvent, setIsCreateDialogOpen } = useEvent();
  const { user, profile, activeOrg, organizations, setActiveOrg, signOut } = useAuth();
  
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeOrg, organizations, setActiveOrg, user, signOut } = useAuth();
  const { setIsCreateDialogOpen } = useEvent();
  const { setOpen, isMobile } = useSidebar();

  const getPlatformName = () => {
    const path = router.pathname;
    if (path === "/dashboard") return "Overview";
    if (path === "/events") return "Production Hub";
    if (path === "/communication") return "Communication";
    if (path === "/crm") return "CRM & Clients";
    if (path === "/finance") return "Finance";
    if (path === "/admin") return "Portal Admin";
    if (path === "/profile") return "Settings";
    return "Orchestrix";
  };

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

  const mainMenuItems = [
    { title: "Overview", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Production Hub", icon: Sparkles, url: "/events", badge: "Live" },
    { title: "Communication", icon: MessageSquare, url: "/communication" },
    { title: "CRM & Clients", icon: Users, url: "/crm" },
    { title: "Finance", icon: Wallet, url: "/finance" },
    { title: "Portal Admin", icon: ShieldCheck, url: "/admin" },
  ];

  const handlePlatformClick = (url: string) => {
    // Only auto-collapse on desktop if desired, or always to save space
    // Clicking a platform link collapses the sidebar to maximize space
    if (!isMobile) {
      setOpen(false);
    }
  };

  const developerItems = [
    { title: "AI Assistant", icon: Terminal, url: "#" },
    { title: "Vendor Portal", icon: Building2, url: "#" },
    { title: "Super Admin", icon: ShieldAlert, url: "/admin/super" },
  ];

  return (
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
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2">Main Platforms</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={router.pathname === item.url} className="px-4 py-2 hover:bg-slate-50 transition-colors">
                      <Link 
                        href={item.url} 
                        className="flex items-center gap-3"
                        onClick={() => handlePlatformClick(item.url)}
                      >
                        <item.icon className={cn("w-5 h-5", router.pathname === item.url ? "text-primary" : "text-slate-500")} />
                        <span className={cn("font-bold text-sm", router.pathname === item.url ? "text-slate-900" : "text-slate-600")}>{item.title}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-rose-500 text-white text-[10px] px-1 h-4 border-none">{item.badge}</Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* System & Dev Tools - Only visible to Super Admins (mock check for now) */}
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2">System & Dev</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {developerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={router.pathname === item.url} className="px-4 py-2 hover:bg-slate-50 transition-colors opacity-60 hover:opacity-100">
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-slate-400" />
                        <span className="font-bold text-sm text-slate-500">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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
            
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 tracking-tight text-lg">
                {getPlatformName()}
              </span>
            </div>

            <div className="relative w-64 lg:w-96 hidden md:block ml-4">
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
            <Button 
              onClick={() => {
                if (router.pathname !== "/events") {
                  router.push("/events");
                }
                setIsCreateDialogOpen(true);
              }}
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg h-9 font-medium shadow-sm px-4"
            >
              Schedule Event
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
  );
}
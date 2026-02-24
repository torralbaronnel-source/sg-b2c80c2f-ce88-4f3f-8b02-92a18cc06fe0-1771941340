import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  Search,
  Menu,
  Clock,
  CheckCircle2,
  FileText,
  UserPlus,
  BarChart3,
  Mail,
  Slack,
  CreditCard,
  User
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { EventSelector } from "@/components/EventHub/EventSelector";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { company = "orchestrix" } = router.query;

  const platforms = [
    {
      id: "overview",
      name: "Overview",
      icon: LayoutDashboard,
      items: [
        { name: "Executive Dashboard", href: `/${company}/dashboard`, icon: LayoutDashboard },
        { name: "Analytics", href: `/${company}/analytics`, icon: BarChart3 },
        { name: "Activity Feed", href: `/${company}/activity`, icon: Clock },
      ],
    },
    {
      id: "events",
      name: "Events",
      icon: Calendar,
      items: [
        { name: "Production Hub", href: `/${company}/events`, icon: Calendar },
        { name: "Timelines", href: `/${company}/events/timelines`, icon: Clock },
        { name: "Guest List", href: `/${company}/events/guests`, icon: Users },
        { name: "Vendors", href: `/${company}/events/vendors`, icon: UserPlus },
        { name: "Seating Plans", href: `/${company}/events/seating`, icon: CheckCircle2 },
      ],
    },
    {
      id: "communication",
      name: "Communication",
      icon: MessageSquare,
      items: [
        { name: "Message Center", href: `/${company}/communication`, icon: MessageSquare },
        { name: "WhatsApp", href: `/${company}/communication/whatsapp`, icon: MessageSquare },
        { name: "Slack", href: `/${company}/communication/slack`, icon: Slack },
        { name: "Email", href: `/${company}/communication/email`, icon: Mail },
      ],
    },
    {
      id: "finance",
      name: "Finance",
      icon: DollarSign,
      items: [
        { name: "Budget Tracker", href: `/${company}/finance`, icon: DollarSign },
        { name: "Payments", href: `/${company}/finance/payments`, icon: CreditCard },
      ],
    },
    {
      id: "crm",
      name: "CRM",
      icon: Users,
      items: [
        { name: "Client Database", href: `/${company}/crm`, icon: Users },
        { name: "Inquiries", href: `/${company}/crm/inquiries`, icon: Mail },
        { name: "Contracts", href: `/${company}/crm/contracts`, icon: FileText },
      ],
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 capitalize">
                  {company}
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-widest text-indigo-600">
                  Operating System
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 pb-6">
            <div className="mb-6 px-3">
              <EventSelector />
            </div>

            {platforms.map((platform) => (
              <SidebarGroup key={platform.id} className="mb-4">
                <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {platform.name}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {platform.items.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <Link href={item.href} passHref legacyBehavior>
                          <SidebarMenuButton 
                            asChild
                            isActive={router.asPath === item.href}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                              router.asPath === item.href 
                                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100" 
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                          >
                            <a>
                              <item.icon className={cn(
                                "h-4.5 w-4.5 transition-colors",
                                router.asPath === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                              )} />
                              <span className="text-sm">{item.name}</span>
                            </a>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <div className="mt-auto border-t border-slate-100 p-4">
            <Link href={`/${company}/profile`} passHref legacyBehavior>
              <SidebarMenuButton 
                asChild
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50"
              >
                <a>
                  <User className="h-4.5 w-4.5 text-slate-400" />
                  <span className="text-sm font-medium">My Profile</span>
                </a>
              </SidebarMenuButton>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="capitalize">{company}</span>
              <ChevronRight className="h-4 w-4 text-slate-300" />
              <span className="text-slate-900">Dashboard</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Quick search (⌘K)"
                  className="h-9 w-64 border-slate-200 bg-slate-50 pl-10 text-sm focus:ring-indigo-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <ThemeSwitch />
                <Button variant="ghost" size="icon" className="relative text-slate-600 hover:bg-slate-50">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                </Button>
                <div className="h-8 w-8 rounded-full bg-indigo-100 p-0.5 ring-2 ring-indigo-50">
                   <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase">
                    {user?.email?.[0] || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
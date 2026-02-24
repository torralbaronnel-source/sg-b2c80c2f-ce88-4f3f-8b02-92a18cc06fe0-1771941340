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
  Menu,
  X,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEvent } from "@/contexts/EventContext";

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
  const company = (router.query.company as string) || "orchestrix";

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">O</div>
          <span className="font-serif font-bold text-xl tracking-tight uppercase">Orchestrix</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="mb-4">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Main Menu</p>
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname.includes(item.href);
              return (
                <Link key={item.name} href={`/${company}${item.href}`}>
                  <span className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                    isActive 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}>
                    <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto bg-rose-500 hover:bg-rose-500 text-[10px] h-4 px-1">
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          <div>
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Quick Access</p>
            <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900 font-medium text-sm">
              <Sparkles className="w-4 h-4 mr-3 text-amber-500" />
              AI Assistant
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900 font-medium text-sm">
              <Briefcase className="w-4 h-4 mr-3 text-blue-500" />
              Vendor Portal
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">Lead Coordinator</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white lg:rounded-tl-[32px] lg:mt-2 lg:border-t lg:border-l lg:border-slate-200">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 border-slate-200 shadow-sm font-medium">
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

            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Ask Orchestrix (e.g. 'Show me budget for Santos wedding')" 
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
            <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg h-9 font-medium shadow-sm">
              New Project
            </Button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut, profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <SidebarProvider defaultOpen={true} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Sidebar Zone - Fixed height with internal scroll */}
        <AppSidebar />
        
        {/* MainZone - Separate Scroll Zone */}
        <main className="flex-1 flex flex-col min-w-0 relative h-screen">
          {/* Header - Fixed at top of main zone */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-[40] shadow-sm">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 flex items-center justify-center rounded-md border bg-card text-card-foreground hover:bg-accent transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
                  DATA FORTRESS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1 border focus-within:ring-2 focus-within:ring-[#6264a7] transition-all">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search Nodes..." 
                  className="bg-transparent border-none text-sm focus:outline-none w-32 md:w-48 py-1"
                />
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 relative text-muted-foreground hover:text-[#6264a7]">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
                </Button>
                
                <ThemeSwitch />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-[#6264a7]/20 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
                      <User className="h-5 w-5 text-[#6264a7]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.full_name || user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Mission Control</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Dashboard Content Scroll Zone */}
          <div className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-black p-4 lg:p-6 custom-scrollbar">
            <div className="max-w-[1600px] mx-auto min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
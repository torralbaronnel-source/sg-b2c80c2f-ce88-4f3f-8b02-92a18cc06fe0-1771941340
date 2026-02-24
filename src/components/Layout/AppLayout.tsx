import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  MessageSquare,
  CalendarDays,
  Users2,
  FileText,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  activeApp?: string;
}

const apps = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, href: '/' },
  { id: 'communication', name: 'Communication Hub', icon: MessageSquare, href: '/communication' },
  { id: 'calendar', name: 'Event Calendar', icon: CalendarDays, href: '/calendar' },
  { id: 'vendors', name: 'Vendor Management', icon: Users2, href: '/vendors' },
  { id: 'contracts', name: 'Contracts', icon: FileText, href: '/contracts' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'settings', name: 'Settings', icon: Settings, href: '/settings' },
];

export function AppLayout({ children, activeApp = 'dashboard' }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">Orchestrix</h1>
              </div>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                Event Management Platform
              </Badge>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-1">
                {apps.map((app) => {
                  const Icon = app.icon;
                  const isActive = activeApp === app.id;
                  
                  return (
                    <Button
                      key={app.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`
                        flex items-center space-x-2 h-9
                        ${isActive 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{app.name}</span>
                    </Button>
                  );
                })}
              </nav>

              {/* User Actions */}
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="flex items-center justify-around py-2">
          {apps.slice(0, 5).map((app) => {
            const Icon = app.icon;
            const isActive = activeApp === app.id;
            
            return (
              <Button
                key={app.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`
                  flex flex-col items-center space-y-1 h-12 px-3
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{app.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
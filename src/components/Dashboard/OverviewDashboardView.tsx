import React, { useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function OverviewDashboardView() {
  const { events, loading } = useEvent();
  const { activeOrg } = useAuth();

  const stats = useMemo(() => {
    const active = events.filter(e => e.status === "active").length;
    const planning = events.filter(e => e.status === "planning").length;
    const completed = events.filter(e => e.status === "completed").length;
    const totalGuests = events.reduce((acc, e) => acc + (e.pax || 0), 0);

    return [
      {
        title: "Live Events",
        value: events.filter(e => e.status === "active").length,
        icon: Clock,
        color: "text-rose-500",
        bg: "bg-rose-50"
      },
      {
        title: "Active Projects",
        value: events.length,
        icon: Calendar,
        color: "text-blue-500",
        bg: "bg-blue-50"
      },
      {
        title: "Total Guests",
        value: totalGuests.toLocaleString(),
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-50"
      },
      {
        title: "Team Comms",
        value: "11",
        icon: MessageSquare,
        color: "text-purple-500",
        bg: "bg-purple-50"
      }
    ];
  }, [events]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {activeOrg?.name || "Coordinator"}
        </h1>
        <p className="text-muted-foreground">
          Here is a quick snapshot of your production environment today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="p-6 bg-white border rounded-xl shadow-sm space-y-3">
            <div className={`p-2 w-fit rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/events"
              className="flex flex-col items-center justify-center p-6 bg-white border rounded-xl hover:border-primary/50 transition-colors gap-3"
            >
              <Calendar className="text-primary" size={24} />
              <span className="text-sm font-medium">Production Hub</span>
            </Link>
            <Link 
              href="/whatsapp"
              className="flex flex-col items-center justify-center p-6 bg-white border rounded-xl hover:border-primary/50 transition-colors gap-3"
            >
              <MessageSquare className="text-emerald-500" size={24} />
              <span className="text-sm font-medium">Communication</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
          <div className="bg-white border rounded-xl p-4 space-y-4">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}</p>
                </div>
                <Link href="/events" className="text-xs text-primary hover:underline flex items-center">
                  Manage <ArrowUpRight size={12} className="ml-1" />
                </Link>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming events yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
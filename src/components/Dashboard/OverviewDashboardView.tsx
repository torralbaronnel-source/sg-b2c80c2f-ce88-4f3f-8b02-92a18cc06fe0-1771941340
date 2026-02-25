import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEvent } from "@/contexts/EventContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function OverviewDashboardView() {
  const { user, currentOrganization: activeOrg } = useAuth();
  const { events, loading: eventsLoading } = useEvent();

  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === "active" || e.status === "planning").length,
    upcomingThisMonth: events.filter(e => {
      const date = new Date(e.event_date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    totalGuests: events.reduce((sum, e) => sum + (e.guest_count || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with {activeOrg?.name || "your organization"} today.
          </p>
        </div>
        <Link href="/servers">
          <Button variant="outline" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Manage Infrastructure
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Production</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming (Month)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests Managed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventsLoading ? (
                <p className="text-sm text-muted-foreground">Loading events...</p>
              ) : events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events scheduled yet.</p>
              ) : (
                events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</p>
                    </div>
                    <Link href="/events">
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Calendar, 
  Users, 
  MessageSquare, 
  MapPin, 
  Clock, 
  AlertCircle,
  Activity,
  ChevronRight,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const events = [
  {
    id: 1,
    title: "REYES-SANTOS WEDDING",
    client: "Maria & Carlos Reyes-Santos",
    location: "Manila Hotel Grand Ballroom",
    date: "2026-02-24",
    time: "15:00 - 23:00",
    guests: 350,
    vendors: 12,
    coordinator: "Ana Rivera",
    status: "LIVE",
    issues: 2,
    messages: 8
  },
  {
    id: 2,
    title: "CORPORATE GALA 2026",
    client: "TechVision Philippines",
    location: "Makati Shangri-La",
    date: "2026-02-25",
    time: "18:00 - 22:00",
    guests: 500,
    vendors: 8,
    coordinator: "Roberto Lim",
    status: "SETUP",
    messages: 3
  },
  {
    id: 3,
    title: "DEBUT CELEBRATION",
    client: "Isabella Martinez",
    location: "Villa Escudero Plantations",
    date: "2026-02-28",
    time: "17:00 - 23:00",
    guests: 200,
    vendors: 10,
    coordinator: "Sarah Wong",
    status: "UPCOMING"
  },
  {
    id: 4,
    title: "CORPORATE TEAM BUILDING",
    client: "ABC Corporation",
    location: "Club Punta Fuego",
    date: "2026-03-05",
    time: "08:00 - 17:00",
    guests: 150,
    vendors: 4,
    coordinator: "Ana Rivera",
    status: "COMPLETED"
  },
  {
    id: 5,
    title: "CHILDREN'S BIRTHDAY PARTY",
    client: "The Santos Family",
    location: "Sky Ranch Tagaytay",
    date: "2026-03-12",
    time: "14:00 - 18:00",
    guests: 100,
    vendors: 5,
    coordinator: "Roberto Lim",
    status: "UPCOMING"
  }
];

export function EventsDashboardView() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and coordinate with teams</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Live Events</p>
                <p className="text-3xl font-bold text-red-600">1</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold text-blue-600">5</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                <p className="text-3xl font-bold text-green-600">1,280</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                <p className="text-3xl font-bold text-purple-600">11</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden border-2 hover:border-blue-200 transition-colors">
            <CardHeader className="bg-slate-50/50 p-4 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{event.client}</p>
                </div>
                <Badge 
                  variant={event.status === "LIVE" ? "destructive" : "secondary"}
                  className={event.status === "LIVE" ? "animate-pulse" : ""}
                >
                  {event.status === "LIVE" && <Activity className="mr-1 h-3 w-3" />}
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.guests} Guests • {event.vendors} Vendors</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Users className="h-4 w-4" />
                  <span>Coordinator: {event.coordinator}</span>
                </div>
              </div>

              {event.issues && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>{event.issues} Critical Issues</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  {event.messages || 0} Messages
                </Button>
                <Button 
                  size="sm" 
                  className={`flex-1 ${event.status === "LIVE" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {event.status === "LIVE" ? (
                    <><Activity className="mr-2 h-4 w-4" /> Command Center</>
                  ) : (
                    <><ChevronRight className="mr-2 h-4 w-4" /> View Event</>
                  )}
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import React, { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Info,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useEvent } from "@/contexts/EventContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export function EventsDashboardView() {
  const { events, loading, createEvent, isCreateDialogOpen, setIsCreateDialogOpen } = useEvent();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    event_date: "",
    call_time: "",
    venue: "",
    guest_count: 0,
    budget: 0,
    description: ""
  });

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.client_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createEvent(formData as any);
    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({
        title: "",
        client_name: "",
        event_date: "",
        call_time: "",
        venue: "",
        guest_count: 0,
        budget: 0,
        description: ""
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Planning</Badge>;
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events or clients..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-auto" onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="completed">Done</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-24 flex items-center px-6">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredEvents.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-1">
              Start by scheduling your first event using the button above.
            </p>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="w-2 bg-blue-600 self-stretch" />
                  <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center text-blue-700">
                        <span className="text-xs font-bold uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-bold leading-none">{new Date(event.event_date).getDate()}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            <Link href={`/events/${event.id}`} className="hover:underline text-primary font-semibold">
                              {event.title}
                            </Link>
                          </h3>
                          {getStatusBadge(event.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.client_name}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.call_time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                      <div className="hidden lg:block text-right">
                        <p className="text-xs text-slate-400 uppercase font-semibold">Venue</p>
                        <p className="text-sm font-medium text-slate-700">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{(event as any).venue || (event as any).details?.venue || "TBD"}</span>
                          </div>
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors ml-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
            <DialogDescription>
              Enter the core details for your new event production.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Santos-Reyes Wedding" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input 
                  id="client" 
                  placeholder="Full name" 
                  required 
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  required 
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Call Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  required 
                  value={formData.call_time}
                  onChange={(e) => setFormData({...formData, call_time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input 
                  id="venue" 
                  placeholder="Location" 
                  required 
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Initial Description / Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Brief overview of the event requirements..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Schedule Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
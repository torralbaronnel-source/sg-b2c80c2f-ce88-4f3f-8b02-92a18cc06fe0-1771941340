import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Search, Plus, Clock, MapPin, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/contexts/EventContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export function EventsDashboardView() {
  const { events, createEvent, isCreateDialogOpen, setIsCreateDialogOpen, loading } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    event_date: "",
    call_time: "",
    location: "",
    budget: 0,
    description: "",
    status: "Planning"
  });

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.client_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter.toLowerCase();
      
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
        location: "",
        budget: 0,
        description: "",
        status: "Planning"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "planning":
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Planning</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Confirmed</Badge>;
      case "live":
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 animate-pulse">LIVE</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Events Hub</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Operation Control Center</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by title or client..." 
            className="pl-9 h-10 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Tabs defaultValue="all" onValueChange={setStatusFilter} className="hidden sm:block">
            <TabsList className="bg-slate-100 border-none h-10">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Planning">Planning</TabsTrigger>
              <TabsTrigger value="Confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="Live">Live</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#6264a7] hover:bg-[#525497] text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-slate-100 shadow-none">
              <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-xl border-slate-100">
            <Info className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No active records found in this sequence.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="group border-slate-200 hover:border-[#6264a7] transition-all shadow-none mb-3 cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div className="w-1.5 h-16 bg-slate-200 group-hover:bg-[#6264a7] transition-colors" />
                    <div className="flex-1 px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-10 w-10 rounded border border-slate-100 bg-slate-50 items-center justify-center text-slate-400">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{event.title}</span>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.client_name}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location || "TBD"}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.call_time || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#6264a7]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Operational Sequence</DialogTitle>
            <DialogDescription className="text-xs uppercase font-bold text-slate-400">Basic Event Initialization</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase text-slate-500">Event Title</Label>
                <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client" className="text-xs font-bold uppercase text-slate-500">Client</Label>
                <Input id="client" required value={formData.client_name} onChange={(e) => setFormData({...formData, client_name: e.target.value})} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-bold uppercase text-slate-500">Date</Label>
                <Input id="date" type="date" required value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-bold uppercase text-slate-500">Location</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-xs font-bold uppercase text-slate-500">Call Time</Label>
                <Input id="time" type="time" value={formData.call_time} onChange={(e) => setFormData({...formData, call_time: e.target.value})} className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-bold uppercase text-slate-500">Initial Directives</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="min-h-[80px]" />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="text-xs font-bold uppercase">Cancel</Button>
              <Button type="submit" className="bg-[#6264a7] hover:bg-[#525497] text-white text-xs font-bold uppercase h-9">Initialize Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState, useMemo } from "react";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Users, 
  Calendar as CalendarIcon, 
  Activity, 
  ChevronRight, 
  Search,
  Filter,
  Edit2,
  DollarSign,
  Clock,
  Plus,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEvent } from "@/contexts/EventContext";
import { format } from "date-fns";
import { motion } from "framer-motion";

const STATUS_CONFIG = {
  planning: { color: "bg-slate-100 text-slate-700", label: "Planning" },
  confirmed: { color: "bg-blue-100 text-blue-700", label: "Confirmed" },
  in_progress: { color: "bg-amber-100 text-amber-700", label: "Live / In Progress" },
  completed: { color: "bg-emerald-100 text-emerald-700", label: "Completed" },
  cancelled: { color: "bg-rose-100 text-rose-700", label: "Cancelled" },
};

const CreateEventDialog = () => {
  const { createEvent } = useEvent();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    event_date: format(new Date(), "yyyy-MM-dd'T'18:00"),
    venue: "",
    guest_count: 150,
    budget: 0,
    status: "planning"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent(formData);
      setOpen(false);
      setFormData({
        title: "",
        client_name: "",
        event_date: format(new Date(), "yyyy-MM-dd'T'18:00"),
        venue: "",
        guest_count: 150,
        budget: 0,
        status: "planning"
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white font-bold gap-2 hover:bg-black transition-all shadow-md active:scale-95">
          <Plus className="w-4 h-4" />
          Schedule Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-slate-900">Schedule New Production</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Title</Label>
                <Input 
                  required
                  placeholder="e.g. Santos-Reyes Wedding"
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Client Name</Label>
                <Input 
                  required
                  placeholder="Full Name"
                  value={formData.client_name} 
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date & Call Time</Label>
                <Input 
                  required
                  type="datetime-local"
                  value={formData.event_date} 
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Initial Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData({...formData, status: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue / Location</Label>
              <Input 
                placeholder="Hotel, Ballroom, or Landmark"
                value={formData.venue} 
                onChange={(e) => setFormData({...formData, venue: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Pax</Label>
                <Input 
                  type="number"
                  value={formData.guest_count} 
                  onChange={(e) => setFormData({...formData, guest_count: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Budget (PHP)</Label>
                <Input 
                  type="number"
                  value={formData.budget} 
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-slate-900 text-white hover:bg-black min-w-[140px]">
              {loading ? "Scheduling..." : "Create Production"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const QuickEditDialog = ({ event, onSave }: { event: any, onSave: (data: any) => Promise<void> }) => {
  const [formData, setFormData] = useState({
    title: event.title,
    client_name: event.client_name || "",
    event_date: event.event_date ? format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm") : "",
    venue: event.venue || "",
    guest_count: event.guest_count || 0,
    budget: event.budget || 0,
    status: event.status || "planning"
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 transition-colors">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-slate-900">Quick Edit Production</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Name</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className="focus-visible:ring-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Client Name</Label>
              <Input 
                value={formData.client_name} 
                onChange={(e) => setFormData({...formData, client_name: e.target.value})} 
                className="focus-visible:ring-slate-400"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date & Time</Label>
              <Input 
                type="datetime-local"
                value={formData.event_date} 
                onChange={(e) => setFormData({...formData, event_date: e.target.value})} 
                className="focus-visible:ring-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({...formData, status: val})}
              >
                <SelectTrigger className="focus:ring-slate-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue</Label>
            <Input 
              value={formData.venue} 
              onChange={(e) => setFormData({...formData, venue: e.target.value})} 
              placeholder="e.g., Grand Ballroom, Conrad Manila"
              className="focus-visible:ring-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Expected Guests</Label>
              <Input 
                type="number"
                value={formData.guest_count} 
                onChange={(e) => setFormData({...formData, guest_count: parseInt(e.target.value) || 0})} 
                className="focus-visible:ring-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Budget (PHP)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₱</span>
                <Input 
                  type="number"
                  className="pl-7 focus-visible:ring-slate-400"
                  value={formData.budget} 
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})} 
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-200">Cancel</Button>
          <Button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white hover:bg-black min-w-[120px]">
            {loading ? "Syncing..." : "Update Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function EventsDashboardView() {
  const { events, loading, updateEvent, createEvent } = useEvent();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.client_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.venue || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  const handleSeedData = async () => {
    await createEvent({
      title: "Reyes-Santos Wedding",
      client_name: "Maria & Carlos Reyes-Santos",
      event_date: format(new Date(), "yyyy-MM-dd'T'15:00"),
      venue: "Manila Hotel Grand Ballroom",
      guest_count: 350,
      budget: 1200000,
      status: "planning"
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 text-slate-300 animate-pulse" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Production Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Production Hub</h1>
          <p className="text-slate-500 mt-1">Directly manage and monitor your event operations</p>
        </div>
        <div className="flex items-center gap-3">
          {events.length === 0 && (
            <Button variant="outline" onClick={handleSeedData} className="gap-2 border-dashed border-slate-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Seed Sample Event
            </Button>
          )}
          <CreateEventDialog />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name, client, or venue..." 
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-slate-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200 focus:ring-slate-400">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const statusInfo = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.planning;
            const isLive = event.status === "in_progress";
            const eventDate = event.event_date ? new Date(event.event_date) : null;

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="group h-full"
              >
                <Card className="h-full border-slate-200 transition-all duration-300 group-hover:border-slate-400 group-hover:shadow-xl relative overflow-hidden bg-white">
                  <div className={cn("h-1.5 w-full", isLive ? "bg-rose-500 animate-pulse" : "bg-slate-200")} />
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={cn("text-[10px] font-bold uppercase tracking-widest px-1.5 py-0 border-none", statusInfo.color)}>
                        {isLive && <Activity className="h-3 w-3 mr-1 inline-block" />}
                        {statusInfo.label}
                      </Badge>
                      <QuickEditDialog event={event} onSave={(data) => updateEvent(event.id, data)} />
                    </div>
                    <CardTitle className="text-xl font-serif mt-2 line-clamp-1 group-hover:text-slate-900 transition-colors">
                      {event.title}
                    </CardTitle>
                    <p className="text-sm text-slate-500 font-medium">{event.client_name || "No Client Assigned"}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <CalendarIcon className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Date</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {eventDate ? format(eventDate, "MMM dd, yyyy") : "TBD"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Time</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {eventDate ? format(eventDate, "hh:mm a") : "TBD"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Users className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Guests</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900">{event.guest_count || 0} pax</span>
                        </div>
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <DollarSign className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Budget</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            ₱{(event.budget || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-medium truncate">{event.venue || "No Venue Set"}</span>
                      </div>

                      <Link href={`/events/${event.id}/live`} className="block w-full">
                        <Button className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold h-10 gap-2 transition-all group-hover:shadow-md group-hover:scale-[1.02] active:scale-95">
                          {isLive ? "Enter Command Center" : "Production Overview"}
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center px-4">
          <div className="p-4 rounded-full bg-slate-50 mb-4">
            <CalendarIcon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your Production Calendar is Empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">Schedule your first event or seed sample data to explore the Orchestrix production hub.</p>
          <div className="flex flex-col sm:flex-row gap-3">
             <Button variant="outline" onClick={handleSeedData} className="gap-2 border-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Seed Sample Event
            </Button>
            <CreateEventDialog />
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  MoreVertical, 
  Edit,
  Trash2,
  ExternalLink,
  ChefHat,
  Music,
  Camera,
  Star,
  Sparkles,
  Gift,
  Mic2,
  Info,
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEvent } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsDashboardView() {
  const { events, loading, createEvent, updateEvent } = useEvent();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.client_name?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesStatus = filterStatus === "all" || event.status === filterStatus;
      if (filterStatus === "active") {
        matchesStatus = event.status === "in_progress" || event.status === "confirmed";
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, filterStatus]);

  const EventForm = ({ event, onSubmit, onCancel, title }: { event?: any, onSubmit: (data: any) => void, onCancel: () => void, title: string }) => {
    const [formData, setFormData] = useState({
      title: event?.title || "",
      client_name: event?.client_name || "",
      event_date: event?.event_date || "",
      call_time: event?.call_time || "",
      venue: event?.venue || "",
      guest_count: event?.guest_count || 0,
      budget: event?.budget || 0,
      hmu_artist: event?.hmu_artist || "",
      lights_sounds: event?.lights_sounds || "",
      catering: event?.catering || "",
      photo_video: event?.photo_video || "",
      coordination_team: event?.coordination_team || "",
      backdrop_styling: event?.backdrop_styling || "",
      souvenirs: event?.souvenirs || "",
      host_mc: event?.host_mc || "",
      description: event?.description || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    };

    return (
      <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Info className="w-3 h-3" /> Core Details
            </h3>
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Santos-Reyes Wedding" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input id="client_name" name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Main Contact Person" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input id="event_date" name="event_date" type="date" value={formData.event_date} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="call_time">Call Time</Label>
                <Input id="call_time" name="call_time" type="time" value={formData.call_time} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" name="venue" value={formData.venue} onChange={handleChange} placeholder="Hotel, Garden, or Hall name" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="guest_count">Target Pax</Label>
                <Input id="guest_count" name="guest_count" type="number" value={formData.guest_count} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Initial Budget (₱)</Label>
                <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-600 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Production & Vendors
            </h3>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Star className="w-3 h-3" /> HMU Artist</Label>
              <Input name="hmu_artist" value={formData.hmu_artist} onChange={handleChange} placeholder="Hair & Makeup Artist" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Music className="w-3 h-3" /> Lights & Sounds</Label>
              <Input name="lights_sounds" value={formData.lights_sounds} onChange={handleChange} placeholder="Provider Name" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><ChefHat className="w-3 h-3" /> Catering</Label>
              <Input name="catering" value={formData.catering} onChange={handleChange} placeholder="Caterer Name" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Camera className="w-3 h-3" /> Photo & Video</Label>
              <Input name="photo_video" value={formData.photo_video} onChange={handleChange} placeholder="Studio / Freelancer" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mic2 className="w-3 h-3" /> Host / MC</Label>
              <Input name="host_mc" value={formData.host_mc} onChange={handleChange} placeholder="Program Host" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Auxiliary Services & Notes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Coordination Team</Label>
              <Input name="coordination_team" value={formData.coordination_team} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Backdrops / Styling</Label>
              <Input name="backdrop_styling" value={formData.backdrop_styling} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Souvenirs</Label>
              <Input name="souvenirs" value={formData.souvenirs} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>General Notes</Label>
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Any special requirements, mood board links, or client preferences..." 
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-white pt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSubmit(formData)}>{event ? "Update Production" : "Create Production"}</Button>
        </DialogFooter>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Production Hub
            <Badge className="bg-rose-500">Live</Badge>
          </h1>
          <p className="text-slate-500 mt-1">Manage and track all event logistics and vendor coordination.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-11 px-6">
                <Plus className="w-5 h-5" /> Schedule Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" /> Schedule New Production
                </DialogTitle>
                <DialogDescription>
                  Create a detailed event profile. All initial projects start in the Planning phase.
                </DialogDescription>
              </DialogHeader>
              <EventForm 
                onSubmit={async (data) => {
                  const success = await createEvent(data);
                  if (success) setIsCreateOpen(false);
                }} 
                onCancel={() => setIsCreateOpen(false)} 
                title="Create New Production"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search events, clients, or venues..." 
                className="pl-10 h-11 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-11 gap-2">
                <Filter className="w-4 h-4" /> Filters
              </Button>
              <div className="h-11 flex items-center bg-slate-100 rounded-lg p-1">
                {['all', 'planning', 'active', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 h-full rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                      filterStatus === status 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group overflow-hidden border-slate-200 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 relative">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={cn(
                    "capitalize font-bold border-none px-0 text-[10px] tracking-widest",
                    (event.status === 'in_progress' || event.status === 'confirmed') ? "text-rose-500" : "text-slate-400"
                  )}>
                    {event.status === 'in_progress' ? 'Active' : event.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Production
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-rose-500">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl font-black group-hover:text-primary transition-colors mt-2">{event.title}</CardTitle>
                <CardDescription className="font-medium text-slate-500">{event.client_name || "Private Event"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{event.event_date ? format(new Date(event.event_date), "MMM dd, yyyy") : "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{event.call_time || "TBD"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{event.venue || "No Venue Assigned"}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.guest_count || 0} Pax</span>
                    <span className="flex items-center gap-1 text-primary"><DollarSign className="w-3 h-3" /> ₱{(event.budget || 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-3 gap-2">
                <Button className="w-full bg-white text-slate-900 hover:bg-primary hover:text-white border-slate-200 shadow-none font-bold text-xs uppercase tracking-widest h-9" variant="outline">
                  Live Dashboard
                </Button>
                <Button size="icon" variant="outline" className="shrink-0 h-9 w-9 bg-white border-slate-200">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
              <CalendarIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">No active productions</h2>
            <p className="text-slate-500 max-w-sm mt-2">Every masterpiece starts with a schedule. Create your first production to begin tracking vendors and logistics.</p>
            <Button className="mt-8 bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsCreateOpen(true)}>
              Schedule Your First Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="w-6 h-6 text-primary" /> Edit Production Details
            </DialogTitle>
            <DialogDescription>
              Update event logistics, vendor assignments, and production notes.
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EventForm 
              event={editingEvent}
              onSubmit={async (data) => {
                await updateEvent(editingEvent.id, data);
                setEditingEvent(null);
              }} 
              onCancel={() => setEditingEvent(null)} 
              title="Update Production"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Filter,
  MoreVertical,
  Clock,
  ExternalLink,
  Edit2,
  CheckCircle2,
  LayoutGrid,
  List,
  Sparkles,
  Palette,
  Camera,
  Music,
  Utensils,
  Gift,
  Mic2,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvent } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function EventsDashboardView() {
  const { events, loading, createEvent, updateEvent } = useEvent();
  const { activeOrg } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || event.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, filterStatus]);

  const CreateEventDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
      title: "",
      client_name: "",
      event_date: "",
      call_time: "",
      venue: "",
      pax: 100,
      budget: 0,
      hmu_artist: "",
      lights_sounds: "",
      catering: "",
      photo_video: "",
      coordination_team: "",
      backdrop_styling: "",
      souvenirs: "",
      host_mc: "",
      event_notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await createEvent({
          ...formData,
          status: "planning" // Always default to planning
        });
        setIsOpen(false);
        setFormData({
          title: "", client_name: "", event_date: "", call_time: "", venue: "",
          pax: 100, budget: 0, hmu_artist: "", lights_sounds: "", catering: "",
          photo_video: "", coordination_team: "", backdrop_styling: "",
          souvenirs: "", host_mc: "", event_notes: ""
        });
      } catch (error) {
        console.error("Failed to create event:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Schedule Event
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              Schedule New Production
            </DialogTitle>
            <DialogDescription>
              Create a detailed event profile. All initial projects start in the Planning phase.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Core Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Core Details
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Title</label>
                    <Input 
                      placeholder="e.g., The Wedding of Alex & Sam" 
                      required 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Client Name</label>
                    <Input 
                      placeholder="Full Name" 
                      required 
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-indigo-600 font-bold">Event Date</label>
                      <Input 
                        type="date" 
                        required 
                        value={formData.event_date}
                        onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Call Time</label>
                      <Input 
                        type="time" 
                        required 
                        value={formData.call_time}
                        onChange={(e) => setFormData({...formData, call_time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Venue</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Location Name / Address" 
                        required 
                        value={formData.venue}
                        onChange={(e) => setFormData({...formData, venue: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target Pax</label>
                      <Input 
                        type="number" 
                        placeholder="Guest count" 
                        value={formData.pax}
                        onChange={(e) => setFormData({...formData, pax: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Initial Budget (₱)</label>
                      <Input 
                        type="number" 
                        placeholder="Budget amount" 
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                {/* Production & Vendors */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Palette className="h-4 w-4 text-purple-500" />
                    Production & Vendors
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-3 w-3" /> HMU Artist
                      </label>
                      <Input 
                        placeholder="Hair & Makeup Artist" 
                        value={formData.hmu_artist}
                        onChange={(e) => setFormData({...formData, hmu_artist: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Music className="h-3 w-3" /> Lights & Sounds
                      </label>
                      <Input 
                        placeholder="Provider Name" 
                        value={formData.lights_sounds}
                        onChange={(e) => setFormData({...formData, lights_sounds: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Utensils className="h-3 w-3" /> Catering
                      </label>
                      <Input 
                        placeholder="Caterer Name" 
                        value={formData.catering}
                        onChange={(e) => setFormData({...formData, catering: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Camera className="h-3 w-3" /> Photo & Video
                      </label>
                      <Input 
                        placeholder="Studio / Freelancer" 
                        value={formData.photo_video}
                        onChange={(e) => setFormData({...formData, photo_video: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Auxiliary Services</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Coordination Team</label>
                      <Input 
                        placeholder="Team Name / Lead" 
                        value={formData.coordination_team}
                        onChange={(e) => setFormData({...formData, coordination_team: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Backdrop & Styling</label>
                      <Input 
                        placeholder="Event Stylist / Florist" 
                        value={formData.backdrop_styling}
                        onChange={(e) => setFormData({...formData, backdrop_styling: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Extras</h3>
                   <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mic2 className="h-3 w-3" /> Host / MC
                      </label>
                      <Input 
                        placeholder="Host Name" 
                        value={formData.host_mc}
                        onChange={(e) => setFormData({...formData, host_mc: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gift className="h-3 w-3" /> Souvenirs
                      </label>
                      <Input 
                        placeholder="Souvenir Supplier" 
                        value={formData.souvenirs}
                        onChange={(e) => setFormData({...formData, souvenirs: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-3 w-3" /> Additional Notes
                </label>
                <Textarea 
                  placeholder="Special requirements, dietary restrictions, or important reminders..."
                  className="min-h-[120px] bg-muted/30"
                  value={formData.event_notes}
                  onChange={(e) => setFormData({...formData, event_notes: e.target.value})}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="p-6 border-t bg-muted/10">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const QuickEditDialog = ({ event }: { event: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ ...event });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await updateEvent(event.id, formData);
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to update event:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            <Edit2 className="h-4 w-4 mr-2" /> Quick Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Edit Production Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(v: any) => setFormData({...formData, status: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Venue</label>
                    <Input 
                      value={formData.venue}
                      onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HMU Artist</label>
                    <Input 
                      value={formData.hmu_artist || ""}
                      onChange={(e) => setFormData({...formData, hmu_artist: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lights & Sounds</label>
                    <Input 
                      value={formData.lights_sounds || ""}
                      onChange={(e) => setFormData({...formData, lights_sounds: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea 
                    value={formData.event_notes || ""}
                    onChange={(e) => setFormData({...formData, event_notes: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="p-6 border-t">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const EventCard = ({ event }: { event: any }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-indigo-500/50 transition-colors shadow-sm hover:shadow-xl group">
        <CardHeader className="pb-4 relative">
          <div className="flex justify-between items-start mb-2">
            <Badge 
              variant={
                event.status === 'active' ? 'default' : 
                event.status === 'completed' ? 'secondary' : 
                event.status === 'cancelled' ? 'destructive' : 'outline'
              }
              className={`capitalize ${event.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}`}
            >
              {event.status}
            </Badge>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors leading-tight">
            {event.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 font-medium text-foreground/80">
            <Users className="h-3 w-3" /> {event.client_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-indigo-500 leading-none mb-1">Date</p>
                <p className="font-semibold text-foreground">{format(new Date(event.event_date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-500 leading-none mb-1">Call Time</p>
                <p className="font-semibold text-foreground">{event.call_time}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
            <MapPin className="h-4 w-4 mt-0.5 text-indigo-500 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-400" />
              <span className="font-medium">{event.pax} Pax</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
              <DollarSign className="h-4 w-4" />
              <span>₱{event.budget?.toLocaleString()}</span>
            </div>
          </div>

          {/* New Vendor Summaries in Card */}
          {(event.hmu_artist || event.catering || event.photo_video) && (
            <div className="pt-2 border-t flex flex-wrap gap-2">
              {event.hmu_artist && <Badge variant="outline" className="text-[10px] h-5 bg-purple-50">HMU: {event.hmu_artist}</Badge>}
              {event.catering && <Badge variant="outline" className="text-[10px] h-5 bg-orange-50">Cater: {event.catering}</Badge>}
              {event.photo_video && <Badge variant="outline" className="text-[10px] h-5 bg-blue-50">P/V: {event.photo_video}</Badge>}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0 border-t bg-muted/5 p-4 flex gap-2">
          <QuickEditDialog event={event} />
          <Button variant="outline" size="sm" className="flex-1">
            Production Hub <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Production Hub
            <Badge variant="outline" className="text-indigo-600 bg-indigo-50 border-indigo-200">
              {events.length} Active Events
            </Badge>
          </h1>
          <p className="text-muted-foreground">Manage, schedule, and oversee your event production timeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateEventDialog />
        </div>
      </div>

      {/* Toolbar */}
      <Card className="p-4 shadow-sm border-border/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, client or venue..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg p-1 bg-muted/30">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-8 px-3"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" /> Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-8 px-3"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" /> List
              </Button>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-[300px] animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          <AnimatePresence mode="popLayout">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border-2 border-dashed border-muted">
          <div className="p-4 rounded-full bg-indigo-50 text-indigo-500 mb-4">
            <Calendar className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold">No productions found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs text-center">
            Start by scheduling your first event to see it here in the production hub.
          </p>
          <div className="mt-6">
            <CreateEventDialog />
          </div>
        </div>
      )}
    </div>
  );
}
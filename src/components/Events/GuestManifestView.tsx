import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Clock, 
  Star, 
  Filter,
  UserCheck,
  MoreVertical,
  AlertCircle,
  Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { lifecycleService } from "@/services/lifecycleService";
import { useEvent } from "@/contexts/EventContext";
import { cn } from "@/lib/utils";

export function GuestManifestView() {
  const { event: currentEvent } = useEvent();
  const { toast } = useToast();
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (currentEvent) {
      loadGuests();
    }
  }, [currentEvent]);

  async function loadGuests() {
    if (!currentEvent) return;
    setLoading(true);
    const { data, error } = await lifecycleService.getEventGuests(currentEvent.id);
    if (!error) setGuests(data || []);
    setLoading(false);
  }

  async function handleCheckIn(guestId: string, currentStatus: string) {
    const nextStatus = currentStatus === 'checked-in' ? 'waiting' : 'checked-in';
    const { error } = await lifecycleService.checkInGuest(guestId, nextStatus);
    
    if (error) {
      toast({
        title: "Check-in Failed",
        description: "Could not update guest status.",
        variant: "destructive"
      });
    } else {
      setGuests(guests.map(g => g.id === guestId ? { ...g, attendance_status: nextStatus } : g));
      toast({
        title: nextStatus === 'checked-in' ? "Guest Checked In" : "Check-in Reverted",
        description: "Manifest updated successfully."
      });
    }
  }

  const filteredGuests = guests.filter(g => {
    const nameMatch = (g.name || "").toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === "all" || 
                       (filter === "vip" && g.is_vip) || 
                       (filter === "checked-in" && g.attendance_status === "checked-in") ||
                       (filter === "waiting" && g.attendance_status === "waiting");
    return nameMatch && filterMatch;
  });

  const stats = {
    total: guests.length,
    checkedIn: guests.filter(g => g.attendance_status === 'checked-in').length,
    vips: guests.filter(g => g.is_vip).length,
    pending: guests.filter(g => g.attendance_status === 'waiting').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-50/50">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Venue</p>
            <h3 className="text-2xl font-black text-blue-600">{stats.checkedIn} <span className="text-sm font-medium text-slate-400">/ {stats.total}</span></h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-black text-orange-500">{stats.pending}</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">VIPs On-Site</p>
            <h3 className="text-2xl font-black text-purple-600">{guests.filter(g => g.is_vip && g.attendance_status === 'checked-in').length}</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check-In Rate</p>
            <h3 className="text-2xl font-black text-green-600">{stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Live Guest Manifest
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by name..." 
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['all', 'vip', 'checked-in', 'waiting'].map((f) => (
              <Button 
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize rounded-full text-xs"
              >
                {f.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading manifest...</div>
            ) : filteredGuests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No guests found matching criteria.</div>
            ) : (
              filteredGuests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm",
                      guest.is_vip ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {guest.name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{guest.name}</span>
                        {guest.is_vip && <Star className="h-3 w-3 fill-purple-600 text-purple-600" />}
                        {guest.is_vip && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-[10px] font-black border-none px-1 h-4">VIP</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {guest.table_number || "No Table"}</span>
                        <span className="flex items-center gap-1 capitalize"><Badge variant="outline" className="text-[10px] py-0">{guest.ticket_type || "General"}</Badge></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={guest.attendance_status === 'checked-in' ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleCheckIn(guest.id, guest.attendance_status)}
                      className={cn(
                        "rounded-full px-4 h-8 text-xs font-bold",
                        guest.attendance_status === 'checked-in' ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {guest.attendance_status === 'checked-in' ? (
                        <span className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> Checked In</span>
                      ) : (
                        "Check In"
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
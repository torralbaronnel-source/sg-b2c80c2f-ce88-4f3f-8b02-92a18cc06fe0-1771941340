import React, { useState, useEffect, useMemo } from "react";
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
  Package,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { lifecycleService } from "@/services/lifecycleService";
import { useEvent } from "@/contexts/EventContext";
import { cn } from "@/lib/utils";

type SortKey = "name" | "status" | "type" | "vip";
type SortOrder = "asc" | "desc";

export function GuestManifestView() {
  const { activeEvent } = useEvent();
  const currentEvent = activeEvent;
  const { toast } = useToast();
  
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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
      setGuests(prev => prev.map(g => g.id === guestId ? { ...g, attendance_status: nextStatus } : g));
      toast({
        title: nextStatus === 'checked-in' ? "Guest Checked In" : "Check-in Reverted",
        description: "Manifest updated successfully."
      });
    }
  }

  const filteredAndSortedGuests = useMemo(() => {
    // 1. Filter
    let result = guests.filter(g => {
      const nameMatch = (g.name || "").toLowerCase().includes(search.toLowerCase()) ||
                       (g.organization || "").toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === "all" || g.attendance_status === statusFilter;
      const typeMatch = typeFilter === "all" || g.ticket_type === typeFilter;
      
      return nameMatch && statusMatch && typeMatch;
    });

    // 2. Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
        case "status":
          comparison = (a.attendance_status || "").localeCompare(b.attendance_status || "");
          break;
        case "type":
          comparison = (a.ticket_type || "").localeCompare(b.ticket_type || "");
          break;
        case "vip":
          comparison = (a.is_vip === b.is_vip) ? 0 : a.is_vip ? -1 : 1;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [guests, search, statusFilter, typeFilter, sortKey, sortOrder]);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    guests.forEach(g => { if (g.ticket_type) types.add(g.ticket_type); });
    return Array.from(types);
  }, [guests]);

  const stats = {
    total: guests.length,
    checkedIn: guests.filter(g => g.attendance_status === 'checked-in').length,
    pending: guests.filter(g => g.attendance_status === 'waiting').length
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
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
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">VIPs</p>
            <h3 className="text-2xl font-black text-purple-600">{guests.filter(g => g.is_vip).length}</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion</p>
            <h3 className="text-2xl font-black text-green-600">{stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 shrink-0">
              <Users className="h-5 w-5 text-blue-600" />
              Guest Manifest
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search name or org..." 
                  className="pl-9 bg-slate-50 border-slate-200 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {(statusFilter !== "all" || typeFilter !== "all") && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1 bg-blue-100 text-blue-700">!</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                    <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="checked-in">Checked In</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="waiting">Waiting</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Ticket Type</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={typeFilter} onValueChange={setTypeFilter}>
                    <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
                    {uniqueTypes.map(type => (
                      <DropdownMenuRadioItem key={type} value={type}>{type}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setStatusFilter("all"); setTypeFilter("all"); }} className="text-destructive">
                    <X className="mr-2 h-4 w-4" /> Reset Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="type">Ticket Type</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="vip">VIP Priority</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
                    <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {statusFilter !== "all" && (
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 capitalize py-1">
                Status: {statusFilter}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
              </Badge>
            )}
            {typeFilter !== "all" && (
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 capitalize py-1">
                Type: {typeFilter}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setTypeFilter("all")} />
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none capitalize py-1">
              Sorted by: {sortKey} ({sortOrder})
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading manifest...</div>
            ) : filteredAndSortedGuests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <Users className="h-10 w-10 opacity-20" />
                <p>No guests found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              filteredAndSortedGuests.map((guest) => (
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
                        <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {guest.table_number ? `Table ${guest.table_number}` : "No Table"}</span>
                        <span className="flex items-center gap-1 capitalize"><Badge variant="outline" className="text-[10px] py-0 border-slate-200">{guest.ticket_type || "General"}</Badge></span>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Guest Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleCheckIn(guest.id, guest.attendance_status)}>
                          {guest.attendance_status === 'checked-in' ? "Revert Check-in" : "Mark as Checked-in"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit registration</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
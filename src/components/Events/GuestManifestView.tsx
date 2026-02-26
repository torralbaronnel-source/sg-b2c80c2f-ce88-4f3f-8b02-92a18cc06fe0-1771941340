import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Users, 
  Search, 
  Star, 
  Filter,
  UserCheck,
  MoreVertical,
  Package,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Building2,
  Ticket
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  
  // Data State
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter/Sort State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.ceil(totalCount / pageSize);

  const loadGuests = useCallback(async () => {
    if (!currentEvent) return;
    setLoading(true);
    
    const { data, error, count } = await lifecycleService.getEventGuests(
      currentEvent.id,
      page,
      pageSize,
      { search, status: statusFilter, type: typeFilter },
      { key: sortKey, order: sortOrder }
    );

    if (error) {
      toast({
        title: "Error loading guests",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setGuests(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [currentEvent, page, pageSize, search, statusFilter, typeFilter, sortKey, sortOrder, toast]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter, sortKey, sortOrder]);

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

  const uniqueTypes = ["VIP", "General", "Speaker", "Staff", "Exhibitor"];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Section - Grid adaptive for mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-slate-50/50 border-none shadow-none">
          <CardContent className="p-3 md:p-4">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Guests</p>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">{totalCount}</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50 border-none shadow-none">
          <CardContent className="p-3 md:p-4">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Current Page</p>
            <h3 className="text-xl md:text-2xl font-black text-blue-600">{page} <span className="text-xs md:text-sm font-medium text-slate-400">/ {totalPages || 1}</span></h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50 border-none shadow-none hidden sm:block">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Size</p>
            <h3 className="text-2xl font-black text-purple-600">{pageSize}</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50 border-none shadow-none">
          <CardContent className="p-3 md:p-4">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Status</p>
            <h3 className="text-xl md:text-2xl font-black text-green-600 flex items-center gap-2">
              {loading ? <RefreshCw className="h-4 w-4 md:h-5 md:w-5 animate-spin" /> : "Live"}
            </h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Manifest
              </CardTitle>
              
              <div className="flex items-center gap-1.5 md:hidden">
                 <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => loadGuests()}>
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                 </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search guest or company..." 
                  className="pl-9 bg-slate-50 border-slate-200 h-10 md:h-9 text-base md:text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 md:h-9 gap-2 flex-1 sm:flex-none justify-center">
                      <Filter className="h-4 w-4" />
                      <span className="md:inline">Filters</span>
                      {(statusFilter !== "all" || typeFilter !== "all") && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1 bg-blue-100 text-blue-700">!</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                      <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="checked-in">Checked In</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="waiting">Waiting</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Ticket Type</DropdownMenuLabel>
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
                    <Button variant="outline" className="h-10 md:h-9 gap-2 flex-1 sm:flex-none justify-center">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="md:inline">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
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
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 min-h-[400px]">
            {loading ? (
              <div className="p-12 text-center text-slate-500 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <RefreshCw className="h-10 w-10 animate-spin text-blue-600 opacity-20" />
                    <RefreshCw className="h-10 w-10 animate-spin text-blue-600 absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
                  </div>
                  <p className="font-medium animate-pulse">Syncing Cloud Manifest...</p>
                </div>
              </div>
            ) : guests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center h-[400px] gap-4">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 opacity-20" />
                </div>
                <div className="max-w-[200px]">
                  <p className="font-bold text-slate-900">No guests found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search term.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}>
                  Reset all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                {guests.map((guest) => (
                  <div key={guest.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={cn(
                        "h-12 w-12 sm:h-10 sm:w-10 rounded-xl sm:rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm",
                        guest.is_vip ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                      )}>
                        {guest.name?.split(' ').slice(0, 2).map((n: string) => n[0]).join('') || "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 truncate">{guest.name}</span>
                          {guest.is_vip && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                          {guest.is_vip && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-[9px] font-black border-none px-1 h-4 uppercase tracking-tighter">VIP Priority</Badge>}
                        </div>
                        <div className="grid grid-cols-1 sm:flex sm:items-center gap-y-1 sm:gap-x-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1.5"><Package className="h-3 w-3 text-slate-400" /> {guest.table_number ? `Table ${guest.table_number}` : "Unassigned"}</span>
                          <span className="flex items-center gap-1.5"><Ticket className="h-3 w-3 text-slate-400" /> <span className="capitalize">{guest.ticket_type || "General"}</span></span>
                          {guest.organization && <span className="flex items-center gap-1.5 truncate"><Building2 className="h-3 w-3 text-slate-400" /> {guest.organization}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                      <Button
                        variant={guest.attendance_status === 'checked-in' ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleCheckIn(guest.id, guest.attendance_status)}
                        className={cn(
                          "flex-1 sm:flex-none rounded-lg px-6 h-10 sm:h-9 text-xs font-bold transition-all active:scale-95",
                          guest.attendance_status === 'checked-in' ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-100" : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
                        )}
                      >
                        {guest.attendance_status === 'checked-in' ? (
                          <span className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Arrived</span>
                        ) : (
                          "Check In"
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-9 sm:w-9 text-slate-400 hover:bg-slate-100">
                            <MoreVertical className="h-5 w-5 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleCheckIn(guest.id, guest.attendance_status)} className="font-medium">
                            {guest.attendance_status === 'checked-in' ? "Revert Status" : "Mark as Arrived"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Full Profile</DropdownMenuItem>
                          <DropdownMenuItem>Update Table</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Flag Entry</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Bar - Mobile Optimized */}
          <div className="bg-slate-50/50 border-t border-slate-100 p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-[11px] md:text-sm text-slate-500">
                <span className="font-bold text-slate-900">{guests.length > 0 ? (page - 1) * pageSize + 1 : 0}</span>-
                <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalCount)}</span> of 
                <span className="font-bold text-slate-900 ml-1">{totalCount}</span>
              </span>
              
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
                <SelectTrigger className="w-[85px] md:w-[100px] h-8 md:h-9 bg-white border-slate-200 text-[11px] md:text-xs">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / pg</SelectItem>
                  <SelectItem value="25">25 / pg</SelectItem>
                  <SelectItem value="50">50 / pg</SelectItem>
                  <SelectItem value="100">100 / pg</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 md:h-8 md:w-8 p-0" 
                disabled={page === 1 || loading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1.5 px-4 bg-white border border-slate-200 rounded-lg h-9 md:h-8 min-w-[80px] justify-center shadow-sm">
                <span className="text-xs font-bold text-blue-600">{page}</span>
                <span className="text-[10px] text-slate-300">of</span>
                <span className="text-xs text-slate-500">{totalPages || 1}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 md:h-8 md:w-8 p-0" 
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
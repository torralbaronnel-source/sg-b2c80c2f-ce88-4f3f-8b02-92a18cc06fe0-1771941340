import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Users, 
  Search, 
  Star, 
  Filter,
  MoreVertical,
  Package,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Building2,
  Ticket,
  Users2,
  Heart,
  Smile,
  CheckCircle2,
  Circle,
  X,
  AlertTriangle,
  LayoutGrid,
  ListFilter,
  UserPlus,
  ArrowUpDown,
  UserCheck,
  UserX,
  UserMinus
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
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { lifecycleService } from "@/services/lifecycleService";
import { useEvent } from "@/contexts/EventContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type SortKey = "name" | "status" | "type" | "vip" | "table_number";
type SortOrder = "asc" | "desc";

type TableCategory = "General" | "Family" | "Best Friends" | "Friends" | "Relatives" | "VIP" | "Staff";

interface TableInfo {
  id: number;
  category: TableCategory;
  capacity: number;
}

export function GuestManifestView() {
  const { activeEvent } = useEvent();
  const currentEvent = activeEvent;
  const { toast } = useToast();
  
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [vipOnly, setVipOnly] = useState(false);
  const [unseatedOnly, setUnseatedOnly] = useState(false);
  
  // Sorting State
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [isTableSheetOpen, setIsTableSheetOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  const tableConfig: TableInfo[] = useMemo(() => [
    { id: 1, category: "VIP", capacity: 8 },
    { id: 2, category: "Family", capacity: 10 },
    { id: 3, category: "Best Friends", capacity: 8 },
    { id: 4, category: "Relatives", capacity: 12 },
    { id: 5, category: "Friends", capacity: 10 },
    { id: 6, category: "Staff", capacity: 6 },
  ], []);

  // Fetch occupancy for heatmap separately or derive from a full list if needed
  // For true scale, we'd fetch table stats from an RPC or separate query
  const tableOccupancy = useMemo(() => {
    const occupancy: Record<number, number> = {};
    // Note: In a real large manifest, we'd fetch these counts from a summary service
    guests.forEach(guest => {
      if (guest.table_number) {
        occupancy[guest.table_number] = (occupancy[guest.table_number] || 0) + 1;
      }
    });
    return occupancy;
  }, [guests]);

  const tablesWithCounts = useMemo(() => {
    return tableConfig.map(table => ({
      ...table,
      currentCount: tableOccupancy[table.id] || 0
    }));
  }, [tableConfig, tableOccupancy]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const loadGuests = useCallback(async () => {
    if (!currentEvent) return;
    setLoading(true);
    
    const filters = { 
      search, 
      status: statusFilter, 
      type: typeFilter,
      is_vip: vipOnly ? true : undefined,
      unseated: unseatedOnly ? true : undefined
    };

    const { data, error, count } = await lifecycleService.getEventGuests(
      currentEvent.id,
      page,
      pageSize,
      filters,
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
  }, [currentEvent, page, pageSize, search, statusFilter, typeFilter, vipOnly, unseatedOnly, sortKey, sortOrder, toast]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  // Reset to first page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter, vipOnly, unseatedOnly, sortKey, sortOrder]);

  const handleCheckIn = async (guestId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'checked-in' ? 'waiting' : 'checked-in';
    const { error } = await lifecycleService.checkInGuest(guestId, nextStatus);
    
    if (error) {
      toast({
        title: "Check-in Failed",
        variant: "destructive"
      });
    } else {
      setGuests(prev => prev.map(g => g.id === guestId ? { ...g, attendance_status: nextStatus } : g));
      toast({
        title: nextStatus === 'checked-in' ? "Arrived" : "Status Reset",
        description: "Guest status updated."
      });
    }
  };

  const validateAssignment = (guest: any, table: any) => {
    const errors = [];
    if (table.currentCount >= table.capacity && guest.table_number !== table.id) {
      errors.push(`Table ${table.id} is full.`);
    }
    if (table.category === "VIP" && !guest.is_vip) {
      errors.push("VIP Table: Restricted access.");
    }
    return { isValid: errors.length === 0, errors };
  };

  const handleTableAssign = async (guest: any, table: any) => {
    const validation = validateAssignment(guest, table);
    if (!validation.isValid) {
      toast({ title: "Restricted", description: validation.errors[0], variant: "destructive" });
      return;
    }

    const { error } = await lifecycleService.updateGuestTable(guest.id, table.id);
    if (error) {
      toast({ title: "Error", description: "Failed to assign table.", variant: "destructive" });
    } else {
      setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, table_number: table.id } : g));
      setIsTableSheetOpen(false);
      toast({ title: "Seated", description: `Assigned to Table ${table.id}` });
    }
  };

  const getTableStatusColor = (current: number, capacity: number) => {
    if (current === 0) return "text-slate-400 bg-slate-50 border-slate-100";
    if (current >= capacity) return "text-rose-600 bg-rose-50 border-rose-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  const getTableIcon = (category: TableCategory) => {
    switch (category) {
      case "Family": return <Heart className="h-4 w-4" />;
      case "VIP": return <Star className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden pb-10">
      {/* Table Heatmap Header */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {tablesWithCounts.map(table => (
          <motion.div 
            key={table.id}
            className={cn(
              "flex-shrink-0 min-w-[140px] p-4 rounded-[2rem] border-2 transition-all shadow-sm",
              getTableStatusColor(table.currentCount, table.capacity)
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{table.category}</span>
              {getTableIcon(table.category)}
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-black">T{table.id}</p>
              <p className="text-xs font-black">{table.currentCount}/{table.capacity}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Quick-Bar */}
      <div className="flex flex-wrap gap-2 px-1">
        <Button 
          variant={vipOnly ? "default" : "outline"} 
          size="sm" 
          onClick={() => setVipOnly(!vipOnly)}
          className={cn("rounded-full h-10 px-5 font-black text-[10px] uppercase tracking-widest gap-2", vipOnly && "bg-indigo-600 shadow-lg")}
        >
          <Star className={cn("h-3.5 w-3.5", vipOnly && "fill-white")} />
          VIP Only
        </Button>
        <Button 
          variant={unseatedOnly ? "default" : "outline"} 
          size="sm" 
          onClick={() => setUnseatedOnly(!unseatedOnly)}
          className={cn("rounded-full h-10 px-5 font-black text-[10px] uppercase tracking-widest gap-2", unseatedOnly && "bg-indigo-600 shadow-lg")}
        >
          <UserMinus className="h-3.5 w-3.5" />
          Unseated
        </Button>
        <div className="flex-1" />
        <Badge variant="outline" className="h-10 px-4 rounded-full bg-white border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
          {totalCount} Guests Found
        </Badge>
      </div>

      <Card className="border-slate-100 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 p-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-black tracking-tight">Guest Manifest</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => loadGuests()}>
                <RefreshCw className={cn("h-5 w-5 text-slate-400", loading && "animate-spin")} />
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Search guests..." 
                  className="pl-12 bg-slate-50 border-none h-14 text-base font-bold rounded-2xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-14 gap-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-100">
                      <ListFilter className="h-4 w-4" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                      <DropdownMenuRadioItem value="all" className="rounded-xl py-3 px-3 font-bold">All Guests</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="checked-in" className="rounded-xl py-3 px-3 font-bold text-emerald-600">Checked In</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="waiting" className="rounded-xl py-3 px-3 font-bold text-amber-600">Waiting List</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-14 gap-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-100">
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuRadioGroup value={sortKey} onValueChange={(val) => setSortKey(val as SortKey)}>
                      <DropdownMenuRadioItem value="name" className="rounded-xl py-3 px-3 font-bold">A-Z</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="vip" className="rounded-xl py-3 px-3 font-bold">VIP Priority</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="table_number" className="rounded-xl py-3 px-3 font-bold">Table #</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50 min-h-[400px]">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center opacity-20">
                <RefreshCw className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                <p className="font-black text-xs uppercase tracking-widest">Indexing...</p>
              </div>
            ) : guests.length === 0 ? (
              <div className="p-20 text-center">
                <UserX className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-900">No Guests Found</h3>
                <p className="text-slate-400 font-bold">Try adjusting your filters.</p>
              </div>
            ) : (
              <AnimatePresence>
                {guests.map((guest) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={guest.id} 
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 bg-white hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center font-black text-lg",
                        guest.is_vip ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        {guest.name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-slate-900 truncate tracking-tight">{guest.name}</span>
                          {guest.is_vip && <Badge className="bg-amber-400 text-amber-950 h-5 px-2 font-black text-[9px] uppercase tracking-tighter rounded-full">VIP</Badge>}
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => { setSelectedGuest(guest); setIsTableSheetOpen(true); }}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                              guest.table_number ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                            )}
                          >
                            {guest.table_number ? `Table ${guest.table_number}` : "Not Seated"}
                          </button>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate max-w-[120px]">
                            {guest.organization || "Private"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant={guest.attendance_status === 'checked-in' ? "secondary" : "default"}
                        size="lg"
                        onClick={() => handleCheckIn(guest.id, guest.attendance_status)}
                        className={cn(
                          "flex-1 sm:flex-none rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest",
                          guest.attendance_status === 'checked-in' ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"
                        )}
                      >
                        {guest.attendance_status === 'checked-in' ? "Checked In" : "Arrived"}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-12 w-12 border-slate-100 rounded-xl text-slate-400">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-2xl">
                          <DropdownMenuItem onClick={() => { setSelectedGuest(guest); setIsTableSheetOpen(true); }} className="rounded-lg py-3 px-3 font-black">
                            Modify Seating
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-600 rounded-lg py-3 px-3 font-black">
                            Flag Guest
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Premium Pagination Controls */}
          <div className="p-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white">
             <div className="flex items-center gap-3">
               <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-xl h-12 w-12 border-slate-100 shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Page</span>
                  <span className="text-sm font-black text-indigo-600">{page} / {totalPages || 1}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl h-12 w-12 border-slate-100 shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
             </div>

             <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">View</span>
               <select 
                 value={pageSize}
                 onChange={(e) => setPageSize(Number(e.target.value))}
                 className="bg-slate-50 border-none rounded-xl px-4 py-2 font-black text-xs text-indigo-600 outline-none h-10"
               >
                 <option value={10}>10</option>
                 <option value={25}>25</option>
                 <option value={50}>50</option>
                 <option value={100}>100</option>
               </select>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Seating Sheet (Simplified for Context) */}
      <Sheet open={isTableSheetOpen} onOpenChange={setIsTableSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-[2.5rem] border-none px-6 bg-slate-50/95 backdrop-blur-xl">
          <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto my-6" />
          <SheetHeader className="text-left mb-8">
            <SheetTitle className="text-3xl font-black tracking-tight">Table Assignment</SheetTitle>
            <SheetDescription className="text-base font-bold text-slate-500">
              Seating <span className="text-indigo-600">{selectedGuest?.name}</span>
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[60vh] pb-10 scrollbar-hide">
            {tablesWithCounts.map(table => {
              const validation = selectedGuest ? validateAssignment(selectedGuest, table) : { isValid: true };
              const isCurrent = selectedGuest?.table_number === table.id;
              return (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={table.id}
                  disabled={!validation.isValid && !isCurrent}
                  onClick={() => handleTableAssign(selectedGuest, table)}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all text-left",
                    isCurrent ? "bg-indigo-600 border-indigo-600 text-white shadow-xl" : 
                    !validation.isValid ? "opacity-30 bg-slate-100 border-slate-100 cursor-not-allowed" : 
                    "bg-white border-slate-100 hover:border-indigo-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl", isCurrent ? "bg-white/20" : "bg-slate-50")}>
                      {table.id}
                    </div>
                    <div>
                      <p className="font-black text-lg tracking-tight">{table.category}</p>
                      <p className={cn("text-[9px] font-black uppercase tracking-widest", isCurrent ? "text-indigo-100" : "text-slate-400")}>
                        {table.capacity - table.currentCount} Seats Free
                      </p>
                    </div>
                  </div>
                  {isCurrent && <CheckCircle2 className="h-6 w-6" />}
                </motion.button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
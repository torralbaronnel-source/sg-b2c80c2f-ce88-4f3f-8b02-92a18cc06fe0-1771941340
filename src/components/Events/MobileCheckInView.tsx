import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Search, 
  QrCode, 
  CheckCircle2, 
  UserPlus, 
  Users, 
  MoreHorizontal,
  X,
  Loader2,
  RefreshCcw,
  Filter,
  Check,
  UserCheck,
  UserMinus,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Guest {
  id: string;
  name: string;
  organization: string;
  type: string;
  status: string;
  table?: string;
  is_vip: boolean;
}

type FilterStatus = "all" | "arrived" | "waiting";
type FilterTier = "all" | "vip" | "standard";

export function MobileCheckInView() {
  const [search, setSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // Advanced Filter State
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [tierFilter, setTierFilter] = useState<FilterTier>("all");
  const [tableFilter, setTableFilter] = useState<string>("all");

  const { toast } = useToast();

  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("current_server_id")
        .eq("id", user.id)
        .single();

      if (!userProfile?.current_server_id) return;

      const { data: latestEvent } = await supabase
        .from("events")
        .select("id")
        .eq("server_id", userProfile.current_server_id)
        .order("event_date", { ascending: false })
        .limit(1)
        .single();

      if (!latestEvent) {
        setGuests([]);
        return;
      }

      const { data: guestData, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", latestEvent.id)
        .order("name", { ascending: true });

      if (error) throw error;

      const formattedGuests: Guest[] = (guestData || []).map(g => ({
        id: g.id,
        name: g.name,
        organization: g.notes || "Individual",
        type: g.ticket_type || "General",
        status: g.attendance_status || "waiting",
        table: g.table_number ? `T-${g.table_number}` : undefined,
        is_vip: g.is_vip || false
      }));

      setGuests(formattedGuests);
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast({
        title: "Connection Error",
        description: "Failed to load guest list.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleCheckIn = async (id: string) => {
    try {
      setIsUpdating(id);
      const { error } = await supabase
        .from("guests")
        .update({ 
          attendance_status: "arrived",
          check_in_time: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      setGuests(prev => prev.map(g => 
        g.id === id ? { ...g, status: "arrived" } : g
      ));

      toast({
        title: "Checked In",
        description: "Guest marked as arrived.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const resetCheckIn = async (id: string) => {
    try {
      setIsUpdating(id);
      const { error } = await supabase
        .from("guests")
        .update({ 
          attendance_status: "waiting",
          check_in_time: null
        })
        .eq("id", id);

      if (error) throw error;

      setGuests(prev => prev.map(g => 
        g.id === id ? { ...g, status: "waiting" } : g
      ));

      toast({
        title: "Status Reset",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // Get unique tables for filtering
  const uniqueTables = useMemo(() => {
    const tables = new Set<string>();
    guests.forEach(g => {
      if (g.table) tables.add(g.table);
    });
    return Array.from(tables).sort();
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                           g.organization.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || g.status === statusFilter;
      const matchesTier = tierFilter === "all" || (tierFilter === "vip" ? g.is_vip : !g.is_vip);
      const matchesTable = tableFilter === "all" || g.table === tableFilter;

      return matchesSearch && matchesStatus && matchesTier && matchesTable;
    });
  }, [guests, search, statusFilter, tierFilter, tableFilter]);

  const checkedInCount = guests.filter(g => g.status === "arrived").length;
  const occupancyRate = guests.length > 0 ? Math.round((checkedInCount / guests.length) * 100) : 0;
  
  const hasActiveFilters = statusFilter !== "all" || tierFilter !== "all" || tableFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setTierFilter("all");
    setTableFilter("all");
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg">Live Check-In</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchGuests} disabled={isLoading}>
              <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
          <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/20">
            {checkedInCount} / {guests.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Overall Occupancy</span>
            <span>{occupancyRate}%</span>
          </div>
          <Progress value={occupancyRate} className="h-1.5" />
        </div>
      </div>

      {/* Search & Advanced Filters */}
      <div className="p-4 space-y-3 bg-background border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search guests..." 
              className="pl-10 bg-muted/50 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={hasActiveFilters ? "default" : "outline"} size="icon" className="h-10 w-10 relative">
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-6">
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle>Filter Guests</SheetTitle>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive h-8 px-2">
                      Clear All
                    </Button>
                  )}
                </div>
              </SheetHeader>

              <div className="space-y-6">
                <section>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Attendance Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["all", "arrived", "waiting"] as const).map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? "default" : "outline"}
                        className="capitalize h-12"
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Guest Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["all", "vip", "standard"] as const).map((tier) => (
                      <Button
                        key={tier}
                        variant={tierFilter === tier ? "default" : "outline"}
                        className="capitalize h-12"
                        onClick={() => setTierFilter(tier)}
                      >
                        {tier}
                      </Button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Table Assignment</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                    <Button
                      variant={tableFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTableFilter("all")}
                    >
                      All Tables
                    </Button>
                    {uniqueTables.map((table) => (
                      <Button
                        key={table}
                        variant={tableFilter === table ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTableFilter(table)}
                      >
                        {table}
                      </Button>
                    ))}
                  </div>
                </section>
              </div>

              <SheetFooter className="mt-8 pt-4 border-t">
                <SheetClose asChild>
                  <Button className="w-full h-12 text-lg">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 gap-2 h-10 shadow-sm"
            onClick={() => setIsScanning(true)}
          >
            <QrCode className="h-4 w-4" />
            Scan QR
          </Button>
          <Button variant="outline" className="flex-1 gap-2 h-10 shadow-sm">
            <UserPlus className="h-4 w-4" />
            Manual Add
          </Button>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Badge variant="secondary" className="bg-destructive/10 text-destructive border-none whitespace-nowrap">
              Active Filters
            </Badge>
            {statusFilter !== "all" && (
              <Badge variant="outline" className="capitalize whitespace-nowrap">
                {statusFilter}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
              </Badge>
            )}
            {tierFilter !== "all" && (
              <Badge variant="outline" className="capitalize whitespace-nowrap">
                {tierFilter}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setTierFilter("all")} />
              </Badge>
            )}
            {tableFilter !== "all" && (
              <Badge variant="outline" className="whitespace-nowrap">
                {tableFilter}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setTableFilter("all")} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Guest List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="animate-pulse">Syncing guest list...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <Users className="h-12 w-12 mb-4 opacity-20" />
            <p className="font-medium">No matching guests found</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters} className="mt-2 h-auto p-0">
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              layout
            >
              <Card className={cn(
                "p-4 border-l-4 transition-all duration-200",
                guest.status === "arrived" 
                  ? "border-l-green-500 bg-green-50/5 shadow-sm" 
                  : "border-l-transparent"
              )}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[15px] truncate">{guest.name}</span>
                      {guest.is_vip && (
                        <div className="bg-amber-100 text-amber-700 p-0.5 rounded">
                          <Star className="h-3 w-3 fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{guest.organization}</span>
                      {guest.table && (
                        <>
                          <span className="opacity-30">•</span>
                          <span className="font-mono text-primary font-bold">{guest.table}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {guest.status === "arrived" ? (
                      <div className="flex flex-col items-end">
                        <Badge className="bg-green-500 hover:bg-green-600 border-none h-7 px-3">
                          <Check className="h-3.5 w-3.5 mr-1" />
                          IN
                        </Badge>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        disabled={isUpdating === guest.id}
                        onClick={() => handleCheckIn(guest.id)}
                        className="h-8 px-4 font-bold shadow-sm"
                      >
                        {isUpdating === guest.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Check In"
                        )}
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Guest Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <UserCheck className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Edit Group
                        </DropdownMenuItem>
                        {guest.status === "arrived" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => resetCheckIn(guest.id)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Reset Status
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* QR Scanner Modal Simulation */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-6 right-6 rounded-full bg-white/10 text-white border-white/20"
              onClick={() => setIsScanning(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="w-full max-w-sm aspect-square border-2 border-primary/50 rounded-3xl relative overflow-hidden mb-8 shadow-[0_0_50px_rgba(var(--primary),0.3)]">
              <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                <QrCode className="h-32 w-32 text-primary/20 animate-pulse" />
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-scan-line" />
              </div>
            </div>

            <div className="text-center text-white">
              <h2 className="font-bold text-xl mb-2">Scan Guest QR</h2>
              <p className="text-zinc-400 text-sm">Align the digital ticket within the frame</p>
              <Button 
                variant="ghost" 
                className="mt-8 text-primary font-bold"
                onClick={() => setIsScanning(false)}
              >
                Cancel Scanning
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
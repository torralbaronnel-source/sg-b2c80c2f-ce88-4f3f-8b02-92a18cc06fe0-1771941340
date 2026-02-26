import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  QrCode, 
  CheckCircle2, 
  UserPlus, 
  Users, 
  MoreHorizontal,
  X,
  UserCheck,
  Clock,
  Loader2,
  RefreshCcw
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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

export function MobileCheckInView() {
  const [search, setSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get current profile to find the active server/event context
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) return;

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("current_server_id")
        .eq("id", profile.user.id)
        .single();

      if (!userProfile?.current_server_id) return;

      // For this view, we'll fetch guests for the latest event in the current server
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
        organization: g.notes || "Individual", // Using notes as a fallback for org for now
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
        description: "Failed to load guest list. Please check your connection.",
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
        description: "Guest has been successfully marked as arrived.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update check-in status.",
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
        description: "Guest status reset to waiting.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not reset guest status.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.organization.toLowerCase().includes(search.toLowerCase())
  );

  const checkedInCount = guests.filter(g => g.status === "arrived").length;
  const occupancyRate = guests.length > 0 ? Math.round((checkedInCount / guests.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Stats */}
      <div className="p-4 border-b bg-card/50 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg">Live Check-In</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchGuests} disabled={isLoading}>
              <RefreshCcw className={cn("h-3 w-3", isLoading && "animate-spin")} />
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

      {/* Search & Actions */}
      <div className="p-4 space-y-3 bg-background/95 sticky top-[113px] z-10 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search guests..." 
            className="pl-10 bg-muted/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 gap-2"
            onClick={() => setIsScanning(true)}
          >
            <QrCode className="h-4 w-4" />
            Scan QR
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Guest List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Syncing guest list...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <Users className="h-12 w-12 mb-4 opacity-20" />
            <p>{search ? "No matching guests found" : "Guest list is empty"}</p>
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card className={cn(
                "p-4 transition-colors",
                guest.status === "arrived" ? "bg-primary/5 border-primary/20" : "bg-card"
              )}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">{guest.name}</span>
                      {guest.is_vip && (
                        <Badge variant="default" className="text-[10px] h-4 px-1.5 bg-amber-500 hover:bg-amber-600 border-none">
                          VIP
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5 uppercase tracking-tighter">
                        {guest.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{guest.organization}</span>
                      {guest.table && (
                        <>
                          <span className="opacity-30">•</span>
                          <span className="font-mono text-primary">{guest.table}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {guest.status === "arrived" ? (
                      <div className="flex items-center text-green-500 gap-1 pr-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-[10px] font-bold">IN</span>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        disabled={isUpdating === guest.id}
                        onClick={() => handleCheckIn(guest.id)}
                        className="h-8 px-3"
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {guest.status === "arrived" && (
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => resetCheckIn(guest.id)}
                          >
                            Reset Check-in
                          </DropdownMenuItem>
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
              className="absolute top-6 right-6 rounded-full bg-white/10 text-white hover:bg-white/20"
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
                className="mt-8 text-primary"
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
      `}</style>
    </div>
  );
}
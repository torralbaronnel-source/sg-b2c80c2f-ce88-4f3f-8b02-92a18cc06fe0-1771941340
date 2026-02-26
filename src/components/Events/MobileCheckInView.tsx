import React, { useState, useEffect } from "react";
import { 
  Search, 
  QrCode, 
  CheckCircle2, 
  UserPlus, 
  Users, 
  ChevronLeft, 
  MoreHorizontal,
  X,
  UserCheck,
  Clock
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

interface Guest {
  id: string;
  name: string;
  organization: string;
  type: "VIP" | "General" | "Staff" | "Speaker";
  status: "pending" | "arrived";
  table?: string;
}

const MOCK_GUESTS: Guest[] = [
  { id: "1", name: "Alexander Wright", organization: "Solaire Resort", type: "VIP", status: "pending", table: "T-01" },
  { id: "2", name: "Maria Garcia", organization: "Ayala Land", type: "Speaker", status: "arrived", table: "T-05" },
  { id: "3", name: "James Bond", organization: "MI6", type: "VIP", status: "pending", table: "T-07" },
  { id: "4", name: "Sarah Chen", organization: "Tech Horizons", type: "General", status: "pending", table: "T-12" },
  { id: "5", name: "Robert Wilson", organization: "Grand Opera", type: "Staff", status: "arrived" },
];

export function MobileCheckInView() {
  const [search, setSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [checkedInCount, setCheckedInCount] = useState(0);

  useEffect(() => {
    setCheckedInCount(guests.filter(g => g.status === "arrived").length);
  }, [guests]);

  const handleCheckIn = (id: string) => {
    setGuests(prev => prev.map(g => 
      g.id === id ? { ...g, status: "arrived" as const } : g
    ));
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col safe-area-inset">
      {/* Header with Stats */}
      <header className="p-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">Guest Check-In</h1>
          </div>
          <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/20">
            {checkedInCount} / {guests.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Overall Occupancy</span>
            <span>{Math.round((checkedInCount / guests.length) * 100)}%</span>
          </div>
          <Progress value={(checkedInCount / guests.length) * 100} className="h-1.5" />
        </div>
      </header>

      {/* Search & Actions */}
      <div className="p-4 space-y-3 bg-background/95 backdrop-blur-sm sticky top-[113px] z-10 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or company..." 
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
            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setIsScanning(true)}
          >
            <QrCode className="h-4 w-4" />
            Scan QR
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <UserPlus className="h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Guest List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <Users className="h-12 w-12 mb-4 opacity-20" />
            <p>No guests found matching your search.</p>
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
                "p-4 transition-all duration-300",
                guest.status === "arrived" ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-accent/5"
              )}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">{guest.name}</span>
                      <Badge 
                        variant={guest.type === "VIP" ? "default" : "secondary"} 
                        className={cn(
                          "text-[10px] h-4 px-1.5",
                          guest.type === "VIP" && "bg-amber-500 hover:bg-amber-600",
                          guest.type === "Speaker" && "bg-blue-500 hover:bg-blue-600 text-white"
                        )}
                      >
                        {guest.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{guest.organization}</p>
                    {guest.table && (
                      <p className="text-[10px] mt-1 font-mono text-primary/70">Table: {guest.table}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {guest.status === "arrived" ? (
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/5 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Checked In
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> 18:43
                        </span>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleCheckIn(guest.id)}
                        className="bg-primary hover:bg-primary/90 h-9 px-4"
                      >
                        Check In
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Detail</DropdownMenuItem>
                        <DropdownMenuItem>Print Badge</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Reset Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </main>

      {/* QR Scanner Modal Simulation */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="absolute top-6 left-6 z-[110]">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setIsScanning(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-12">
              <div className="w-full aspect-square border-2 border-primary/50 rounded-3xl relative overflow-hidden">
                {/* Scanner View Simulation */}
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-primary/20 animate-pulse" />
                </div>
                {/* Scanner Framing */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-scan-line" />
                </div>
              </div>
            </div>

            <div className="p-8 pb-12 bg-black text-center">
              <h2 className="text-white font-bold text-xl mb-2">Scan Guest Ticket</h2>
              <p className="text-zinc-400 text-sm">Align the QR code within the frame to automatically check in the guest.</p>
              
              <div className="mt-8 flex justify-center">
                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-white/60 text-xs">
                  <UserCheck className="h-4 w-4" />
                  Ready to scan...
                </div>
              </div>
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
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
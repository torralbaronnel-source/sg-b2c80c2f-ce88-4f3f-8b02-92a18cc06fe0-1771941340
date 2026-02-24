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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  MapPin, 
  Users, 
  Clock, 
  Calendar as CalendarIcon, 
  Activity, 
  ChevronRight, 
  Search,
  Filter,
  Pin,
  PinOff
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;

const INITIAL_EVENTS = [
  {
    id: "1",
    title: "The Santos-Cruz Nuptials",
    client: "Juan & Maria",
    date: "2026-06-15",
    time: "15:00",
    venue: "Palacio de Memoria, Manila",
    guests: 250,
    status: "UPCOMING",
    type: "Wedding",
    isPinned: true
  },
  {
    id: "2",
    title: "Tech Summit 2026",
    client: "Global Innovations Inc.",
    date: "2026-02-24",
    time: "09:00",
    venue: "SMX Convention Center",
    guests: 1200,
    status: "LIVE",
    type: "Corporate",
    isPinned: false
  },
  {
    id: "3",
    title: "18th Birthday: Sofia's Grand Debut",
    client: "Sofia Rodriguez",
    date: "2026-02-24",
    time: "18:00",
    venue: "Shangri-La at the Fort",
    guests: 350,
    status: "SETUP",
    type: "Debut",
    isPinned: false
  },
  {
    id: "4",
    title: "Arroyo-Tan Anniversary",
    client: "David & Elena Arroyo",
    date: "2026-03-10",
    time: "17:00",
    venue: "The Farm at San Benito",
    guests: 80,
    status: "UPCOMING",
    type: "Anniversary",
    isPinned: false
  },
  {
    id: "5",
    title: "Corporate Gala Dinner",
    client: "Bank of Philippines",
    date: "2026-02-23",
    time: "19:00",
    venue: "Marriott Grand Ballroom",
    guests: 500,
    status: "COMPLETED",
    type: "Corporate",
    isPinned: false
  },
  {
    id: "6",
    title: "Project Launch: Aqua-Marine",
    client: "Villar Group",
    date: "2026-04-12",
    time: "10:00",
    venue: "Conrad Manila",
    guests: 150,
    status: "UPCOMING",
    type: "Launch",
    isPinned: false
  },
  {
    id: "7",
    title: "Legacy Awards 2026",
    client: "National Arts Council",
    date: "2026-05-20",
    time: "18:30",
    venue: "CCP Main Theater",
    guests: 800,
    status: "UPCOMING",
    type: "Award Show",
    isPinned: false
  }
];

const STATUS_PRIORITY = {
  "LIVE": 1,
  "SETUP": 2,
  "UPCOMING": 3,
  "COMPLETED": 4
};

export function EventsDashboardView() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const togglePin = (id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, isPinned: !event.isPinned } : event
    ));
  };

  const filteredAndSortedEvents = useMemo(() => {
    const result = events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      // 1. Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // 2. Status priority (Live > Setup > Upcoming > Completed)
      const priorityA = STATUS_PRIORITY[a.status as keyof typeof STATUS_PRIORITY];
      const priorityB = STATUS_PRIORITY[b.status as keyof typeof STATUS_PRIORITY];
      if (priorityA !== priorityB) return priorityA - priorityB;

      // 3. Date & Time
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });
  }, [events, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedEvents, currentPage]);

  const stats = useMemo(() => ({
    live: filteredAndSortedEvents.filter(e => e.status === "LIVE").length,
    upcoming: filteredAndSortedEvents.filter(e => e.status === "UPCOMING").length,
    setup: filteredAndSortedEvents.filter(e => e.status === "SETUP").length,
    totalGuests: filteredAndSortedEvents.reduce((acc, curr) => acc + curr.guests, 0)
  }), [filteredAndSortedEvents]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE": return "bg-rose-500 hover:bg-rose-600 text-white animate-pulse";
      case "SETUP": return "bg-amber-500 hover:bg-amber-600 text-white";
      case "UPCOMING": return "bg-blue-500 hover:bg-blue-600 text-white";
      case "COMPLETED": return "bg-slate-500 hover:bg-slate-600 text-white";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-full">
      {/* Header & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Production Hub</h1>
          <p className="text-slate-500 mt-1">Real-time command center for active events</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
          {[
            { label: "Live Now", value: stats.live, color: "text-rose-600", icon: Activity },
            { label: "In Setup", value: stats.setup, color: "text-amber-600", icon: Clock },
            { label: "Upcoming", value: stats.upcoming, color: "text-blue-600", icon: CalendarIcon },
            { label: "Total Capacity", value: stats.totalGuests.toLocaleString(), color: "text-slate-900", icon: Users }
          ].map((stat, i) => (
            <Card key={i} className="bg-white border-none shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-slate-50", stat.color)}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{stat.label}</p>
                  <p className={cn("text-lg font-bold leading-none", stat.color)}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search events, clients, venues..." 
              className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1); // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-[180px] bg-white border-slate-200">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="LIVE">Live Now</SelectItem>
              <SelectItem value="SETUP">Setting Up</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white gap-2">
          <CalendarIcon className="w-4 h-4" />
          Calendar View
        </Button>
      </div>

      {/* Event Cards Grid */}
      {paginatedEvents.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map((event) => (
              <Card 
                key={event.id} 
                className={cn(
                  "group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300",
                  event.isPinned && "ring-2 ring-blue-500/50 shadow-blue-100"
                )}
              >
                {/* Pin Button */}
                <button 
                  onClick={() => togglePin(event.id)}
                  className={cn(
                    "absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-200",
                    event.isPinned 
                      ? "bg-blue-500 text-white opacity-100" 
                      : "bg-black/5 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-black/10"
                  )}
                >
                  {event.isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>

                <CardHeader className="p-0">
                  <div className="relative h-4 w-full bg-slate-100">
                    <div 
                      className={cn(
                        "absolute inset-0 transition-all duration-500", 
                        getStatusColor(event.status).split(' ')[0]
                      )} 
                    />
                  </div>
                  <div className="p-5 pb-0 flex items-start justify-between">
                    <div>
                      <Badge className={cn("mb-2 font-bold", getStatusColor(event.status))}>
                        {event.status === "LIVE" && <Activity className="w-3 h-3 mr-1" />}
                        {event.status}
                      </Badge>
                      <CardTitle className="text-xl font-serif text-slate-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </CardTitle>
                      <p className="text-sm font-medium text-slate-500 mt-1">{event.client}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <div className="p-1.5 rounded-md bg-slate-100">
                        <CalendarIcon className="w-4 h-4" />
                      </div>
                      <span>{new Date(event.date).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-start text-sm text-slate-600 gap-2">
                      <div className="p-1.5 rounded-md bg-slate-100">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>

                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <div className="p-1.5 rounded-md bg-slate-100">
                        <Users className="w-4 h-4" />
                      </div>
                      <span>{event.guests} Guests Confirmed</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1,2,3].map((_, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />
                      ))}
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        +5
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "text-sm font-bold gap-2 group/btn",
                        event.status === "LIVE" ? "text-rose-600 hover:text-rose-700" : "text-blue-600 hover:text-blue-700"
                      )}
                    >
                      {event.status === "LIVE" ? "Live Dashboard" : "View Production"}
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4 pb-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="p-4 rounded-full bg-slate-50 mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No events found</h3>
          <p className="text-slate-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setCurrentPage(1);
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
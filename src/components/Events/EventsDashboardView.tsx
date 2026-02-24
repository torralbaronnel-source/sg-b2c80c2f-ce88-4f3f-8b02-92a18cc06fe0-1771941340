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
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEvent } from "@/contexts/EventContext";

const ITEMS_PER_PAGE = 6;

const STATUS_PRIORITY = {
  "LIVE": 1,
  "SETUP": 2,
  "UPCOMING": 3,
  "COMPLETED": 4
};

const EventCard = ({ event }: { event: any }) => {
  const isLive = event.status === "LIVE";
  const isSetup = event.status === "SETUP";

  return (
    <Card className={`group transition-all duration-300 border-slate-200 hover:border-slate-300 hover:shadow-xl relative overflow-hidden ${event.isPinned ? 'ring-1 ring-amber-400 shadow-md' : ''}`}>
      <div className={`h-2 w-full ${
        isLive ? "bg-rose-500" : isSetup ? "bg-amber-500" : "bg-slate-200"
      }`} />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={isLive ? "destructive" : "secondary"} className={`${isLive ? "animate-pulse" : ""} text-[10px] font-bold uppercase tracking-widest px-1.5 py-0`}>
            {isLive && <Activity className="h-3 w-3 mr-1 inline-block" />}
            {event.status}
          </Badge>
        </div>
        <CardTitle className="text-lg font-serif line-clamp-1">{event.title}</CardTitle>
        <p className="text-xs text-slate-500">{event.client}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-2 rounded-lg">
              <Users className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{event.guests} Guests</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-2 rounded-lg">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{event.venue}</span>
            </div>
          </div>

          <Link href={`/events/${event.id}/live`} className="block w-full">
            <Button 
              className={`w-full group/btn transition-all duration-300 font-bold ${
                isLive 
                  ? "bg-slate-900 hover:bg-black text-white" 
                  : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2">
                {isLive ? "Enter Command Center" : "Production Overview"}
                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export function EventsDashboardView() {
  const { events, loading, setEvents } = useEvent();
  const [searchTerm, setSearchTerm] = useState("");
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
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const priorityA = STATUS_PRIORITY[a.status as keyof typeof STATUS_PRIORITY] || 99;
      const priorityB = STATUS_PRIORITY[b.status as keyof typeof STATUS_PRIORITY] || 99;
      if (priorityA !== priorityB) return priorityA - priorityB;

      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });
  }, [events, searchTerm, statusFilter]);

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
  };

  if (loading) {
    return <div className="p-8">Loading events...</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-full">
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

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search events, clients, venues..." 
              className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
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

      {paginatedEvents.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
              />
            ))}
          </div>

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
              setSearchTerm("");
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
import React, { createContext, useContext, useEffect, useState } from "react";
import { eventService, Event, UpdateEvent } from "@/services/eventService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EventContextType {
  events: Event[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
  updateEvent: (id: string, updates: UpdateEvent) => Promise<void>;
  createEvent: (event: Omit<Event, "id" | "created_at" | "updated_at">) => Promise<Event>;
  activeEvent: Event | null;
  recentEvents: Event[];
  setActiveEvent: (event: Event | null) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const { activeOrg, user } = useAuth();
  const { toast } = useToast();

  const refreshEvents = async () => {
    if (!activeOrg?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await eventService.getEvents(activeOrg.id);
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching events",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, "id" | "created_at" | "updated_at">) => {
    try {
      const newEvent = await eventService.createEvent({
        description: "", // Default empty description
        ...eventData,
        created_by: user?.id,
        organization_id: activeOrg?.id
      });
      setEvents(prev => [newEvent, ...prev]);
      toast({
        title: "Event Scheduled",
        description: `${newEvent.title} has been added to your production calendar.`,
      });
      return newEvent;
    } catch (error: any) {
      toast({
        title: "Scheduling failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: UpdateEvent) => {
    try {
      const updated = await eventService.updateEvent(id, updates);
      setEvents(prev => prev.map(e => e.id === id ? updated : e));
      toast({
        title: "Event Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const recentEvents = events.slice(0, 5);

  useEffect(() => {
    refreshEvents();
  }, [activeOrg?.id]);

  return (
    <EventContext.Provider value={{ events, loading, refreshEvents, updateEvent, createEvent, activeEvent, recentEvents, setActiveEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}
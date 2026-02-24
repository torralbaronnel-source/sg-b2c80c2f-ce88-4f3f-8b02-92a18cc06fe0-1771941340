import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { eventService, type Event, type UpdateEvent } from "@/services/eventService";
import { useAuth } from "@/contexts/AuthContext";

interface EventContextType {
  events: Event[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
  updateEvent: (id: string, updates: UpdateEvent) => Promise<void>;
  createEvent: (event: Omit<Event, "id" | "created_at" | "updated_at" | "created_by" | "organization_id">) => Promise<Event>;
  activeEvent: Event | null;
  setActiveEvent: (event: Event | null) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const { activeOrg, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const refreshEvents = useCallback(async () => {
    if (!activeOrg?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await eventService.getEvents(activeOrg.id);
      // Map database names to our cleaner UI type names
      const mappedEvents = (data || []).map((e: any) => ({
        ...e,
        pax: e.guest_count || 0,
        call_time: e.call_time || "00:00"
      })) as Event[];
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [activeOrg?.id]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const updateEvent = async (id: string, updates: UpdateEvent) => {
    try {
      const data = await eventService.updateEvent(id, updates);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data, pax: (data as any).guest_count || 0 } as Event : e));
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  const createEvent = async (eventData: Omit<Event, "id" | "created_at" | "updated_at" | "created_by" | "organization_id">) => {
    if (!activeOrg?.id) throw new Error("No active organization");

    try {
      // Map UI pax back to DB guest_count
      const dbData = {
        ...eventData,
        guest_count: eventData.pax,
        organization_id: activeOrg.id,
        created_by: user?.id,
        description: eventData.event_notes || ""
      };
      
      const data = await eventService.createEvent(dbData);
      const newEvent = { ...data, pax: (data as any).guest_count || 0, call_time: (data as any).call_time || "00:00" } as Event;
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      loading, 
      refreshEvents, 
      updateEvent, 
      createEvent,
      activeEvent,
      setActiveEvent 
    }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
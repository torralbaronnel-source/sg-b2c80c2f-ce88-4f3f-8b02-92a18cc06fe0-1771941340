import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { eventService, type Event, type CreateEvent, type UpdateEvent } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

interface EventContextType {
  events: Event[];
  loading: boolean;
  createEvent: (eventData: CreateEvent) => Promise<Event | null>;
  updateEvent: (id: string, updates: UpdateEvent) => Promise<void>;
  activeEvent: Event | null;
  setActiveEvent: (event: Event | null) => void;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const { activeOrg, user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    if (!activeOrg?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await eventService.getEvents(activeOrg.id);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [activeOrg?.id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (eventData: CreateEvent) => {
    if (!activeOrg?.id || !user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in and have an active organization selected.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const newEvent = await eventService.createEvent({
        ...eventData,
        organization_id: activeOrg.id,
        created_by: user.id,
        status: 'planning', // Force planning status for new events
        description: eventData.description || ""
      });
      
      await fetchEvents();
      toast({
        title: "Success",
        description: "Event scheduled successfully!",
      });
      return newEvent;
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create event. Please check all fields.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateEvent = async (id: string, updates: UpdateEvent) => {
    try {
      await eventService.updateEvent(id, updates);
      await fetchEvents();
      
      // Update active event if it's the one being modified
      if (activeEvent?.id === id) {
        const updated = events.find(e => e.id === id);
        if (updated) setActiveEvent({ ...updated, ...updates });
      }

      toast({
        title: "Success",
        description: "Event updated successfully!",
      });
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update event.",
        variant: "destructive",
      });
    }
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      loading, 
      createEvent, 
      updateEvent,
      activeEvent, 
      setActiveEvent,
      refreshEvents: fetchEvents
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
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { eventService, type Event, type CreateEvent, type UpdateEvent } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EventContextType {
  events: Event[];
  loading: boolean;
  createEvent: (eventData: CreateEvent) => Promise<Event | null>;
  updateEvent: (id: string, updates: UpdateEvent) => Promise<void>;
  activeEvent: Event | null;
  setActiveEvent: (event: Event | null) => void;
  refreshEvents: () => Promise<void>;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  subscribeToLiveUpdates: (eventId: string, callback: (payload: any) => void) => () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user, currentServer } = useAuth();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    if (!currentServer) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [currentServer?.id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const subscribeToLiveUpdates = useCallback((eventId: string, callback: (payload: any) => void) => {
    const channel = supabase
      .channel(`live_updates_${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guests',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createEvent = async (eventData: CreateEvent) => {
    if (!currentServer?.id || !user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in and have an active organization selected.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const newEvent = await eventService.createEvent(eventData);
      
      if (newEvent) {
        await fetchEvents();
        toast({
          title: "Success",
          description: "Event scheduled successfully!",
        });
        return newEvent;
      }
      return null;
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
      const { error } = await eventService.updateEvent(id, updates);
      if (error) throw error;
      
      await fetchEvents();
      
      if (activeEvent?.id === id) {
        const updated = events.find(e => e.id === id);
        if (updated) {
          setActiveEvent({ ...updated, ...updates } as Event);
        }
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
      refreshEvents: fetchEvents,
      isCreateDialogOpen,
      setIsCreateDialogOpen,
      subscribeToLiveUpdates
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
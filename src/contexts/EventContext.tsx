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
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organization_id", activeOrg.id)
        .order("event_date", { ascending: true });

      if (error) throw error;
      
      const typedData = (data || []).map((e: any) => {
        // We create the object with explicit type to avoid any mismatch
        const mapped = {
          id: e.id,
          title: e.title || "",
          client_name: e.client_name || "",
          event_date: e.event_date || "",
          call_time: e.call_time || "",
          venue: e.venue || "",
          status: (e.status || "planning") as Event["status"],
          guest_count: Number(e.guest_count) || 0,
          budget: Number(e.budget) || 0,
          created_at: e.created_at || "",
          organization_id: e.organization_id || "",
          created_by: e.created_by || "",
          description: e.description || "",
          hmu_artist: e.hmu_artist || "",
          lights_sounds: e.lights_sounds || "",
          catering: e.catering || "",
          photo_video: e.photo_video || "",
          coordination_team: e.coordination_team || "",
          backdrop_styling: e.backdrop_styling || "",
          souvenirs: e.souvenirs || "",
          host_mc: e.host_mc || ""
        };
        return (mapped as unknown) as Event;
      });
      
      setEvents(typedData);
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
      const payload = {
        ...eventData,
        organization_id: activeOrg.id,
        created_by: user.id,
        status: 'planning' as const,
        description: eventData.description || ""
      };

      const newEvent = await eventService.createEvent(payload);
      
      if (newEvent) {
        await fetchEvents();
        toast({
          title: "Success",
          description: "Event scheduled successfully!",
        });
        return newEvent as Event;
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
      await eventService.updateEvent(id, updates);
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
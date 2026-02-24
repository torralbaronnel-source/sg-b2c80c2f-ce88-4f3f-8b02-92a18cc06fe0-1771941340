import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user, currentOrganization: activeOrg } = useAuth();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    if (!activeOrg?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await eventService.getEvents(activeOrg.id);
      if (error) throw error;
      setEvents(data || []);
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
      const payload: CreateEvent = {
        ...eventData,
        organization_id: activeOrg.id,
        created_by: user.id,
        status: 'planning',
        description: eventData.description || ""
      };

      const { data: newEvent, error } = await eventService.createEvent(payload);
      
      if (error) throw error;

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
      setIsCreateDialogOpen
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
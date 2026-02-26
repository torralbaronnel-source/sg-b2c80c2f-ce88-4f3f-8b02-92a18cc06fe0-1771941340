import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EventContextType {
  events: any[];
  currentEvent: any | null;
  setCurrentEvent: (event: any) => void;
  loading: boolean;
  currentServer: any | null;
  setCurrentServer: (server: any) => void;
  createEvent: (eventData: any) => Promise<any>;
  subscribeToLiveUpdates: (eventId: string, callback: (payload: any) => void) => () => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null);
  const [currentServer, setCurrentServer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setCurrentEvent(null);
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEvents(data || []);
        if (data && data.length > 0 && !currentEvent) {
          setCurrentEvent(data[0]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const createEvent = async (eventData: any) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      setEvents(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  };

  const subscribeToLiveUpdates = (eventId: string, callback: (payload: any) => void) => {
    const channel = supabase
      .channel(`event-updates-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${eventId}`,
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <EventContext.Provider 
      value={{ 
        events, 
        currentEvent, 
        setCurrentEvent, 
        loading,
        currentServer,
        setCurrentServer,
        createEvent,
        subscribeToLiveUpdates,
        isCreateDialogOpen,
        setIsCreateDialogOpen
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
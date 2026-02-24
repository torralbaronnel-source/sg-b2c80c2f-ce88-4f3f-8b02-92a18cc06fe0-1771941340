import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventContextType {
  activeEvent: Event | null;
  events: Event[];
  loading: boolean;
  setActiveEvent: (event: Event | null) => void;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [activeEvent, setActiveEventState] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      
      // If there's an active event, make sure it's still in the list and updated
      if (activeEvent) {
        const updatedActive = data?.find(e => e.id === activeEvent.id);
        if (updatedActive) setActiveEventState(updatedActive);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const setActiveEvent = (event: Event | null) => {
    setActiveEventState(event);
    if (event) {
      localStorage.setItem("orchestrix_active_event_id", event.id);
    } else {
      localStorage.removeItem("orchestrix_active_event_id");
    }
  };

  useEffect(() => {
    refreshEvents().then(() => {
      const savedId = localStorage.getItem("orchestrix_active_event_id");
      if (savedId && events.length > 0) {
        const found = events.find(e => e.id === savedId);
        if (found) setActiveEventState(found);
      }
    });
  }, []);

  return (
    <EventContext.Provider value={{ activeEvent, events, loading, setActiveEvent, refreshEvents }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventHub() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEventHub must be used within an EventProvider");
  }
  return context;
}
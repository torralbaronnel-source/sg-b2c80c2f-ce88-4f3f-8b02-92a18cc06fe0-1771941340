import React, { createContext, useContext, useState, useEffect } from "react";

type EventStatus = "LIVE" | "SETUP" | "UPCOMING" | "COMPLETED";

interface Event {
  id: string;
  title: string;
  client: string;
  date: string;
  status: EventStatus;
}

interface EventContextType {
  activeEvent: Event | null;
  setActiveEvent: (event: Event | null) => void;
  recentEvents: Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  // Mock recent events for context
  const recentEvents: Event[] = [
    { id: "1", title: "Santos-Cruz Wedding", client: "Juan & Maria", date: "2026-06-15", status: "UPCOMING" },
    { id: "2", title: "Tech Summit 2026", client: "Global Innovations", date: "2026-02-24", status: "LIVE" },
  ];

  return (
    <EventContext.Provider value={{ activeEvent, setActiveEvent, recentEvents }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvent must be used within an EventProvider");
  return context;
};
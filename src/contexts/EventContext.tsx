import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Event {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  venue: string;
  guests: number;
  status: string;
  type: string;
  isPinned: boolean;
}

interface EventContextType {
  events: Event[];
  recentEvents: Event[];
  loading: boolean;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  activeEvent: Event | null;
  setActiveEvent: (event: Event | null) => void;
}

const INITIAL_EVENTS: Event[] = [
  {
    id: "1",
    title: "The Santos-Cruz Nuptials",
    client: "Juan & Maria",
    date: "2026-06-15",
    time: "15:00",
    venue: "Palacio de Memoria, Manila",
    guests: 250,
    status: "UPCOMING",
    type: "Wedding",
    isPinned: true
  },
  {
    id: "2",
    title: "Tech Summit 2026",
    client: "Global Innovations Inc.",
    date: "2026-02-24",
    time: "09:00",
    venue: "SMX Convention Center",
    guests: 1200,
    status: "LIVE",
    type: "Corporate",
    isPinned: false
  },
  {
    id: "3",
    title: "18th Birthday: Sofia's Grand Debut",
    client: "Sofia Rodriguez",
    date: "2026-02-24",
    time: "18:00",
    venue: "Shangri-La at the Fort",
    guests: 350,
    status: "SETUP",
    type: "Debut",
    isPinned: false
  }
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [loading, setLoading] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const recentEvents = events.slice(0, 5);

  return (
    <EventContext.Provider value={{ events, recentEvents, loading, setEvents, activeEvent, setActiveEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvent must be used within an EventProvider");
  return context;
};
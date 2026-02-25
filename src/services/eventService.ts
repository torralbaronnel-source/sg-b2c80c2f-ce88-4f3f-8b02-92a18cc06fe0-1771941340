import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  call_time: string | null;
  location: string | null;
  status: string;
  type: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  budget: number;
  coordinator_id: string;
  server_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEvent = Omit<Event, "id" | "created_at" | "updated_at">;
export type UpdateEvent = Partial<CreateEvent>;

export const eventService = {
  async getEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data as Event[];
  },

  async createEvent(event: CreateEvent) {
    const { data, error } = await supabase
      .from("events")
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  async updateEvent(id: string, updates: UpdateEvent) {
    return await supabase
      .from("events")
      .update(updates)
      .eq("id", id);
  },

  async deleteEvent(id: string) {
    return await supabase
      .from("events")
      .delete()
      .eq("id", id);
  }
};
import { supabase } from "@/integrations/supabase/client";

export type Event = {
  id: string;
  coordinator_id: string;
  title: string;
  event_date: string;
  location: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  status: 'Planning' | 'Confirmed' | 'Live' | 'Completed' | 'Cancelled';
  package_type: string | null;
  budget: number;
  description: string | null;
  call_time: string | null;
  server_id: string | null;
  type: string | null;
  production_status: string | null;
  delivery_status: string | null;
  billing_status: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEvent = Omit<Event, "id" | "created_at" | "updated_at">;

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

  async updateEvent(id: string, updates: Partial<CreateEvent>) {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
};
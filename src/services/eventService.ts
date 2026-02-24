import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export interface Event {
  id: string;
  title: string;
  client_name: string;
  event_date: string;
  call_time: string;
  venue: string;
  status: "planning" | "confirmed" | "in_progress" | "completed" | "cancelled";
  guest_count: number;
  budget: number;
  created_at: string;
  organization_id: string;
  created_by: string;
  description: string;
  // New comprehensive fields
  hmu_artist?: string;
  lights_sounds?: string;
  catering?: string;
  photo_video?: string;
  coordination_team?: string;
  backdrop_styling?: string;
  souvenirs?: string;
  host_mc?: string;
  event_notes?: string;
}

export type CreateEvent = Omit<Event, "id" | "created_at" | "created_by" | "organization_id">;
export type UpdateEvent = Database["public"]["Tables"]["events"]["Update"];

export const eventService = {
  async getEvents() {
    // Explicitly select columns to avoid recursive type depth issues with '*' on large schemas
    const { data, error } = await supabase
      .from("events")
      .select("id, title, date, start_time, end_time, location, description, status, call_time, organization_id, coordinator_id, created_at, updated_at")
      .order("date", { ascending: true });
    
    return { data, error };
  },

  async createEvent(event: any) {
    const { data, error } = await supabase
      .from("events")
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, updates: UpdateEvent) {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
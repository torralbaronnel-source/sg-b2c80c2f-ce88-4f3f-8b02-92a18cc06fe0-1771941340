import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  client_name: string;
  event_date: string;
  call_time: string;
  venue: string;
  status: "planning" | "active" | "completed" | "cancelled";
  guest_count: number;
  budget: number;
  created_at: string;
  organization_id: string;
  created_by: string;
  description: string;
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

export type CreateEvent = Omit<Event, "id" | "created_at">;
export type UpdateEvent = Partial<CreateEvent>;

/**
 * Event Service
 * Uses a type-erased internal query to prevent TypeScript TS2589 (Excessively deep type instantiation).
 * This maintains strict typing for the rest of the application while satisfying the compiler.
 */
export const eventService = {
  async getEvents(organizationId: string): Promise<{ data: Event[], error: any }> {
    try {
      // Casting to any to stop recursive type checking, then casting back to our known Event[]
      const query = supabase
        .from("events")
        .select("*")
        .eq("organization_id", organizationId)
        .order("event_date", { ascending: true });
      
      const { data, error } = await (query as any);
      
      return { data: (data || []) as Event[], error };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  async createEvent(event: CreateEvent): Promise<{ data: Event | null, error: any }> {
    try {
      const query = supabase
        .from("events")
        .insert(event as any)
        .select()
        .single();
        
      const { data, error } = await (query as any);
      
      return { data: data as Event, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async updateEvent(id: string, updates: UpdateEvent): Promise<{ data: Event | null, error: any }> {
    try {
      const query = supabase
        .from("events")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
        
      const { data, error } = await (query as any);
      
      return { data: data as Event, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }
};
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
 * Fixed TS2589: "Type instantiation is excessively deep" 
 * by isolating the supabase table access behind a type-erased proxy.
 */
export const eventService = {
  async getEvents(organizationId: string): Promise<{ data: Event[], error: any }> {
    try {
      // Use any to bypass infinite recursion in Supabase's generated types
      const { data, error } = await (supabase as any)
        .from("events")
        .select("*")
        .eq("organization_id", organizationId)
        .order("event_date", { ascending: true });
      
      return { data: (data || []) as Event[], error };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  async createEvent(event: CreateEvent): Promise<{ data: Event | null, error: any }> {
    try {
      const { data, error } = await (supabase as any)
        .from("events")
        .insert(event)
        .select()
        .single();
        
      return { data: data as Event, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async updateEvent(id: string, updates: UpdateEvent): Promise<{ data: Event | null, error: any }> {
    try {
      const { data, error } = await (supabase as any)
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
        
      return { data: data as Event, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }
};
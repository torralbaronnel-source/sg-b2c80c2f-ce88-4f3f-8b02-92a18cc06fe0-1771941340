import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

export interface Event extends EventRow {}

export type CreateEvent = Omit<Event, "id" | "created_at">;
export type UpdateEvent = Partial<CreateEvent>;

/**
 * Event Service
 * Fixed TS2589: "Type instantiation is excessively deep" 
 * by isolating the supabase table access behind a type-erased proxy.
 */
export const eventService = {
  async getEvents() {
    const serverId = typeof window !== "undefined" ? localStorage.getItem("selectedServerId") : null;
    if (!serverId) return [];

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("server_id", serverId)
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createEvent(event: Omit<EventInsert, "id" | "created_at" | "updated_at" | "server_id">) {
    const serverId = typeof window !== "undefined" ? localStorage.getItem("selectedServerId") : null;
    
    const { data, error } = await supabase
      .from("events")
      .insert([{ ...event, server_id: serverId } as any])
      .select()
      .single();

    if (error) throw error;
    return data;
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
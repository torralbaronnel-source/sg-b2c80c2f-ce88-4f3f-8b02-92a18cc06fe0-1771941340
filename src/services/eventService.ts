import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type UpdateEvent = Database["public"]["Tables"]["events"]["Update"];

export const eventService = {
  async getEvents(organizationId: string) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("organization_id", organizationId)
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data;
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
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Itinerary = Database["public"]["Tables"]["itineraries"]["Row"];
export type InsertItinerary = Database["public"]["Tables"]["itineraries"]["Insert"];

export const itineraryService = {
  async getByEventId(eventId: string) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("event_id", eventId)
      .order("start_time", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*, events(title)")
      .order("start_time", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(itinerary: InsertItinerary) {
    const { data, error } = await supabase
      .from("itineraries")
      .insert(itinerary)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<InsertItinerary>) {
    const { data, error } = await supabase
      .from("itineraries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("itineraries")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
};
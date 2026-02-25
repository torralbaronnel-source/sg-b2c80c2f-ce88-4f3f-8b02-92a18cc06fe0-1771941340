import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type RunOfShowItem = Database["public"]["Tables"]["run_of_show"]["Row"];
export type ResourceAllocation = Database["public"]["Tables"]["resource_allocations"]["Row"];
export type CallSheet = Database["public"]["Tables"]["call_sheets"]["Row"];

export const productionService = {
  async getRunOfShow(eventId: string) {
    const { data, error } = await supabase
      .from("run_of_show")
      .select("*")
      .eq("event_id", eventId)
      .order("start_time", { ascending: true });
    if (error) throw error;
    return data;
  },

  async createRunOfShowItem(item: Database["public"]["Tables"]["run_of_show"]["Insert"]) {
    const { data, error } = await supabase
      .from("run_of_show")
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getResourceAllocations(eventId: string) {
    const { data, error } = await supabase
      .from("resource_allocations")
      .select("*")
      .eq("event_id", eventId);
    if (error) throw error;
    return data;
  },

  async generateCallSheet(eventId: string) {
    // Basic call sheet generation logic
    const { data, error } = await supabase
      .from("call_sheets")
      .insert({ event_id: eventId, status: "Draft" })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
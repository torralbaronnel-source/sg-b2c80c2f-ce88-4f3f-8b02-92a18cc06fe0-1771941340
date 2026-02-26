import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type RunOfShowItem = Database["public"]["Tables"]["run_of_show"]["Row"];
export type ResourceAllocation = Database["public"]["Tables"]["resource_allocations"]["Row"];
export type CallSheet = Database["public"]["Tables"]["call_sheets"]["Row"];
export type ProductionArchetype = 'Wedding' | 'Corporate' | 'Production' | 'General';

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
  },

  async generateBlueprint(eventId: string, eventType: string, eventDate: string) {
    const archetypes: Record<string, any[]> = {
      'Wedding': [
        { title: 'HMU Start', offset_hours: -5, duration: 120, team: 'Stylists' },
        { title: 'Photography Arrival', offset_hours: -3, duration: 60, team: 'Media' },
        { title: 'Ceremony Start', offset_hours: 0, duration: 60, team: 'Coordinators' },
        { title: 'Reception Kickoff', offset_hours: 1.5, duration: 240, team: 'Catering' }
      ],
      'Corporate': [
        { title: 'AV & Stage Setup', offset_hours: -4, duration: 180, team: 'Technical' },
        { title: 'Speaker Rehearsal', offset_hours: -1, duration: 45, team: 'Production' },
        { title: 'General Session', offset_hours: 0, duration: 120, team: 'Whole Team' },
        { title: 'Networking Mixer', offset_hours: 2.5, duration: 90, team: 'Catering' }
      ]
    };

    const blueprint = archetypes[eventType] || archetypes['Corporate'];
    const baseDate = new Date(eventDate);
    
    const items = blueprint.map(item => ({
      event_id: eventId,
      title: item.title,
      responsible_team: item.team,
      start_time: new Date(baseDate.getTime() + item.offset_hours * 60 * 60 * 1000).toISOString(),
      status: 'Pending'
    }));

    const { data, error } = await supabase
      .from("run_of_show")
      .insert(items)
      .select();

    if (error) throw error;
    return data;
  }
};
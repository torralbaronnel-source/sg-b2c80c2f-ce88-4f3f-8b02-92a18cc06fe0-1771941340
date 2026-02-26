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
        // Compliance & Planning (PH Specific)
        { title: 'Filscap Music Licensing', offset_hours: -720, duration: 0, team: 'Admin/Legal' }, // 30 days before
        { title: 'LGU/Barangay Permit Review', offset_hours: -336, duration: 0, team: 'Admin' },   // 14 days before
        { title: 'Final Guest Protocol Check (VIPs)', offset_hours: -48, duration: 60, team: 'Coordination' },
        
        // Day of Execution
        { title: 'Ingress & LED Wall Setup', offset_hours: -6, duration: 180, team: 'Technical/S&L' },
        { title: 'HMU Start - Bridal Suite', offset_hours: -5, duration: 120, team: 'Stylists' },
        { title: 'Crew Meal Distribution (Staff Packs)', offset_hours: -3.5, duration: 30, team: 'Logistics' },
        { title: 'Photo/Video Team Arrival', offset_hours: -3, duration: 60, team: 'Media' },
        { title: 'Ninong/Ninang Orientation', offset_hours: -0.5, duration: 15, team: 'Coordination' },
        { title: 'Ceremony Proper', offset_hours: 0, duration: 60, team: 'Whole Team' },
        { title: 'Cocktail Hour & Photobooth', offset_hours: 1, duration: 60, team: 'Coordination' },
        { title: 'Grand Reception Entrance', offset_hours: 2, duration: 180, team: 'Whole Team' },
        { title: 'Egress & Gear Load-out', offset_hours: 5, duration: 120, team: 'Technical' }
      ],
      'Corporate': [
        { title: 'Technical Ocular (Power/Breakers)', offset_hours: -168, duration: 120, team: 'Technical' },
        { title: 'Ingress: Stage & Backdrop', offset_hours: -8, duration: 240, team: 'Production' },
        { title: 'Sound & Light Check (Dry Run)', offset_hours: -4, duration: 90, team: 'Technical' },
        { title: 'Crew Meal distribution', offset_hours: -3, duration: 45, team: 'Logistics' },
        { title: 'Speaker Technical Rehearsal', offset_hours: -1.5, duration: 60, team: 'Production' },
        { title: 'Main Program Start', offset_hours: 0, duration: 120, team: 'Whole Team' },
        { title: 'Networking & Buffet', offset_hours: 2, duration: 90, team: 'Catering' },
        { title: 'Post-Event Wrap & Egress', offset_hours: 4, duration: 60, team: 'Logistics' }
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
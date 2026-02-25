import { supabase } from "@/integrations/supabase/client";

export const lifecycleService = {
  // Run of Show (ROS) Methods
  async getEventCues(eventId: string) {
    const { data, error } = await supabase
      .from("event_cues")
      .select("*")
      .eq("event_id", eventId)
      .order("start_time", { ascending: true });
    return { data, error };
  },

  async updateCueStatus(cueId: string, status: string) {
    const { data, error } = await supabase
      .from("event_cues")
      .update({ status } as any)
      .eq("id", cueId)
      .select()
      .single();
    return { data, error };
  },

  // Guest Manifest & Check-in Methods
  async getEventGuests(eventId: string) {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("event_id", eventId)
      .order("name", { ascending: true });
    return { data, error };
  },

  async checkInGuest(guestId: string, status: string = 'checked-in') {
    const { data, error } = await supabase
      .from("guests")
      .update({ 
        attendance_status: status,
        check_in_time: status === 'checked-in' ? new Date().toISOString() : null
      } as any)
      .eq("id", guestId)
      .select()
      .single();
    return { data, error };
  }
};

// Re-export ProjectStage if needed by CRM or other views
export type ProjectStage = 'Discovery' | 'Proposal' | 'Contract' | 'Pre-Production' | 'Live' | 'Post-Show' | 'Archived';
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
  async getEventGuests(
    eventId: string, 
    page: number = 1, 
    pageSize: number = 25,
    filters: { search?: string, status?: string, type?: string } = {},
    sort: { key: string, order: 'asc' | 'desc' } = { key: 'name', order: 'asc' }
  ) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("guests")
      .select("*", { count: 'exact' })
      .eq("event_id", eventId);

    // Apply Filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,organization.ilike.%${filters.search}%`);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('attendance_status', filters.status);
    }
    if (filters.type && filters.type !== 'all') {
      query = query.eq('ticket_type', filters.type);
    }

    // Apply Sorting
    const sortColumn = sort.key === 'vip' ? 'is_vip' : 
                       sort.key === 'status' ? 'attendance_status' :
                       sort.key === 'type' ? 'ticket_type' : 'name';
    
    query = query.order(sortColumn, { ascending: sort.order === 'asc' });

    const { data, error, count } = await query.range(from, to);
    
    return { data, error, count };
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
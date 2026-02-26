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
    filters: { search?: string, status?: string, type?: string, is_vip?: boolean, unseated?: boolean } = {},
    sort: { key: string, order: 'asc' | 'desc' } = { key: 'name', order: 'asc' }
  ) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Use 'guests' as the base table (or event_guests if it exists as a view)
    // Casting to 'any' to avoid "excessively deep" type instantiation errors
    let query = (supabase.from('guests') as any)
      .select('*', { count: 'exact' })
      .eq('event_id', eventId);

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,organization.ilike.%${filters.search}%,group_name.ilike.%${filters.search}%`);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('attendance_status', filters.status);
    }

    if (filters.is_vip !== undefined) {
      query = query.eq('is_vip', filters.is_vip);
    }

    if (filters.unseated) {
      query = query.is('table_number', null);
    }

    // Apply sorting
    const sortKey = sort.key === 'vip' ? 'is_vip' : sort.key;
    const ascending = sort.order === 'asc';
    
    if (sort.key === 'vip') {
      query = query.order('is_vip', { ascending: false }).order('name', { ascending: true });
    } else {
      query = query.order(sortKey, { ascending });
    }

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
  },

  async updateGuestTable(guestId: string, tableNumber: number | null) {
    const { data, error } = await supabase
      .from("guests")
      .update({ table_number: tableNumber } as any)
      .eq("id", guestId)
      .select()
      .single();
    return { data, error };
  },

  async updateRSVPStatus(guestId: string, status: 'accepted' | 'declined' | 'no_response') {
    const { data, error } = await supabase
      .from('guests')
      .update({ rsvp_status: status, updated_at: new Date().toISOString() })
      .eq('id', guestId)
      .select()
      .single();

    if (!error && status === 'accepted') {
      console.log("PIPELINE: RSVP Accepted - Updating Production Manifest...");
    }
    return { data, error };
  },

  async getEventGuestStats(eventId: string) {
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId);

    if (error) return { data: null, error };

    const stats = {
      total: guests.length,
      checkedIn: guests.filter(g => g.attendance_status === 'checked-in').length,
      pending: guests.filter(g => g.attendance_status === 'waiting' && g.rsvp_status === 'accepted').length,
      vips: guests.filter(g => g.is_vip).length,
      vipsArrived: guests.filter(g => g.is_vip && g.attendance_status === 'checked-in').length,
      seated: guests.filter(g => g.table_number).length,
      unseated: guests.filter(g => !g.table_number && g.attendance_status === 'checked-in').length,
      tableOccupancy: guests.reduce((acc: any, g) => {
        if (g.table_number) {
          acc[g.table_number] = (acc[g.table_number] || 0) + 1;
        }
        return acc;
      }, {})
    };

    return { data: stats, error: null };
  }
};

export type ProjectStage = 'Discovery' | 'Proposal' | 'Contract' | 'Pre-Production' | 'Live' | 'Post-Show' | 'Archived';
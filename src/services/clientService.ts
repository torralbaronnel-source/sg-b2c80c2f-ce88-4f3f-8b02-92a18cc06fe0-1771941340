import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export interface ClientData {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  email: string;
  phone?: string;
  alternate_contact?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  source?: string;
  lead_status?: string;
  type?: string;
}

export const clientService = {
  async getClients() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_server_id")
        .eq("id", user.id)
        .single();

      if (!profile?.current_server_id) return [];

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("server_id", profile.current_server_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching clients:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("Error in getClients:", err);
      return [];
    }
  },

  async createClient(clientData: ClientData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_server_id")
      .eq("id", user.id)
      .single();

    if (!profile?.current_server_id) throw new Error("No active server");

    const { data, error } = await supabase
      .from("clients")
      .insert({
        server_id: profile.current_server_id,
        type: clientData.type || "individual",
        first_name: clientData.first_name,
        last_name: clientData.last_name,
        company_name: clientData.company_name,
        email: clientData.email,
        phone: clientData.phone,
        alternate_contact: clientData.alternate_contact,
        address: clientData.address,
        city: clientData.city,
        country: clientData.country,
        notes: clientData.notes,
        source: clientData.source || "website",
        lead_status: clientData.lead_status || "new",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateClient(clientId: string, clientData: Partial<ClientData>) {
    const { data, error } = await supabase
      .from("clients")
      .update(clientData)
      .eq("id", clientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClient(clientId: string) {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId);

    if (error) throw error;
    return true;
  },

  async getClientStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { total: 0, byStatus: {} as Record<string, number>, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_server_id")
        .eq("id", user.id)
        .single();

      if (!profile?.current_server_id) return { total: 0, byStatus: {} as Record<string, number>, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };

      const { data: clients, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("server_id", profile.current_server_id);

      if (clientError || !clients) return { total: 0, byStatus: {} as Record<string, number>, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };

      let { data: events, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("server_id", profile.current_server_id);

      if (eventError) events = [];

      // Calculate stats
      const total = clients.length;
      const byStatus: Record<string, number> = {};
      let totalSpent = 0;
      let totalEvents = (events || []).length;

      clients.forEach((client) => {
        const status = (client as any)?.lead_status || "new";
        byStatus[status] = (byStatus[status] || 0) + 1;
        totalSpent += (client as any)?.total_spent || 0;
      });

      const bookedCount = byStatus["booked"] || 0;
      const conversionRate = total > 0 ? (bookedCount / total) * 100 : 0;
      const avgEventValue = totalEvents > 0 ? totalSpent / totalEvents : 0;

      return { 
        total, 
        byStatus, 
        totalSpent, 
        totalEvents,
        conversionRate,
        avgEventValue
      };
    } catch (err) {
      console.error("Error calculating stats:", err);
      return { total: 0, byStatus: {} as Record<string, number>, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };
    }
  },
};
import { supabase } from "@/integrations/supabase/client";

export interface ClientData {
  full_name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  source?: string;
  status?: string;
  assigned_user_id?: string;
  total_events?: number;
  total_spent?: number;
}

interface StatResponse {
  total: number;
  byStatus: Record<string, number>;
  totalSpent: number;
  totalEvents: number;
  conversionRate: number;
  avgEventValue: number;
}

interface ClientDetailsResponse {
  client: any;
  events: any[];
  quotes: any[];
  invoices: any[];
  communications: any[];
  tasks: any[];
}

export const clientService = {
  async getClients(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_server_id")
        .eq("id", user.id)
        .single();

      if (!profile?.current_server_id) return [];

      const { data } = await (supabase
        .from("clients")
        .select("*")
        .eq("server_id", profile.current_server_id)
        .order("created_at", { ascending: false }) as any);

      return data || [];
    } catch (err) {
      console.error("Error fetching clients:", err);
      return [];
    }
  },

  async createClient(clientData: ClientData): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_server_id")
      .eq("id", user.id)
      .single();

    if (!profile?.current_server_id) throw new Error("No active server");

    const { data } = await (supabase
      .from("clients")
      .insert({
        server_id: profile.current_server_id,
        coordinator_id: user.id,
        full_name: clientData.full_name,
        email: clientData.email,
        phone: clientData.phone,
        company_name: clientData.company_name,
        address: clientData.address,
        city: clientData.city,
        country: clientData.country,
        notes: clientData.notes,
        source: clientData.source || "Direct",
        status: clientData.status || "Lead",
        assigned_user_id: clientData.assigned_user_id,
        total_spent: 0,
        total_events: 0,
      })
      .select()
      .single() as any);

    return data;
  },

  async updateClient(clientId: string, clientData: Partial<ClientData>): Promise<any> {
    const { data } = await (supabase
      .from("clients")
      .update(clientData)
      .eq("id", clientId)
      .select()
      .single() as any);

    return data;
  },

  async deleteClient(clientId: string): Promise<boolean> {
    await (supabase
      .from("clients")
      .delete()
      .eq("id", clientId) as any);

    return true;
  },

  async getClientStats(): Promise<StatResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { total: 0, byStatus: {}, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_server_id")
        .eq("id", user.id)
        .single();

      if (!profile?.current_server_id) {
        return { total: 0, byStatus: {}, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };
      }

      const { data: clients } = await (supabase
        .from("clients")
        .select("*")
        .eq("server_id", profile.current_server_id) as any);

      const { data: events } = await (supabase
        .from("events")
        .select("*")
        .eq("server_id", profile.current_server_id) as any);

      const total = (clients || []).length;
      const byStatus: Record<string, number> = {};
      let totalSpent = 0;
      let totalEvents = (events || []).length;

      (clients || []).forEach((client: any) => {
        const status = client.status || "Lead";
        byStatus[status] = (byStatus[status] || 0) + 1;
        totalSpent += client.total_spent || 0;
      });

      const activeCount = byStatus["Active"] || 0;
      const conversionRate = total > 0 ? (activeCount / total) * 100 : 0;
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
      return { total: 0, byStatus: {}, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };
    }
  },

  async getClientDetails(clientId: string): Promise<ClientDetailsResponse | null> {
    try {
      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .match({ id: clientId })
        .maybeSingle();

      if (!client) return null;

      const { data: events } = await supabase
        .from("events")
        .select("*")
        .match({ client_id: clientId });

      const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .match({ client_id: clientId });

      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .match({ client_id: clientId });

      const { data: communications } = await supabase
        .from("communications")
        .select("*")
        .match({ client_id: clientId });

      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .limit(100);

      const eventIds = (events || []).map((e: any) => e.id);
      const filteredTasks = (tasks || []).filter((t: any) => eventIds.includes(t.event_id));

      return {
        client,
        events: events || [],
        quotes: quotes || [],
        invoices: invoices || [],
        communications: communications || [],
        tasks: filteredTasks,
      };
    } catch (err) {
      console.error("Error fetching client details:", err);
      return null;
    }
  },
};
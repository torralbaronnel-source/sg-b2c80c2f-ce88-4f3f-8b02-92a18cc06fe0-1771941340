import { supabase } from "@/integrations/supabase/client";

// Simplified interfaces to prevent deep recursion in inferred Supabase types
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

      const profileData = profile as any;
      if (!profileData?.current_server_id) return [];

      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("server_id", profileData.current_server_id)
        .order("created_at", { ascending: false });

      return (data as any[]) || [];
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

    const profileData = profile as any;
    if (!profileData?.current_server_id) throw new Error("No active server");

    const { data } = await supabase
      .from("clients")
      .insert({
        server_id: profileData.current_server_id,
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
      } as any)
      .select()
      .single();

    return data;
  },

  async updateClient(clientId: string, clientData: Partial<ClientData>): Promise<any> {
    const { data } = await supabase
      .from("clients")
      .update(clientData as any)
      .eq("id", clientId)
      .select()
      .single();

    return data;
  },

  async deleteClient(clientId: string): Promise<boolean> {
    await supabase
      .from("clients")
      .delete()
      .eq("id", clientId);

    return true;
  },

  async getGlobalClientStats(): Promise<StatResponse> {
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

      const profileData = profile as any;
      if (!profileData?.current_server_id) {
        return { total: 0, byStatus: {}, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };
      }

      const [clientsRes, eventsRes] = await Promise.all([
        supabase.from("clients").select("*").eq("server_id", profileData.current_server_id),
        supabase.from("events").select("*").eq("server_id", profileData.current_server_id)
      ]);

      const clientList = (clientsRes.data || []) as any[];
      const eventList = (eventsRes.data || []) as any[];

      const total = clientList.length;
      const byStatus: Record<string, number> = {};
      let totalSpent = 0;
      let totalEventsCount = eventList.length;

      clientList.forEach((client: any) => {
        const status = client.status || "Lead";
        byStatus[status] = (byStatus[status] || 0) + 1;
        totalSpent += Number(client.total_spent) || 0;
      });

      const activeCount = byStatus["Active"] || 0;
      const conversionRate = total > 0 ? (activeCount / total) * 100 : 0;
      const avgEventValue = totalEventsCount > 0 ? totalSpent / totalEventsCount : 0;

      return { 
        total, 
        byStatus, 
        totalSpent, 
        totalEvents: totalEventsCount,
        conversionRate,
        avgEventValue
      };
    } catch (err) {
      console.error("Error calculating stats:", err);
      return { total: 0, byStatus: {}, totalSpent: 0, totalEvents: 0, conversionRate: 0, avgEventValue: 0 };
    }
  },

  async getClientStats(clientId: string) {
    try {
      const [eventsRes, invoicesRes] = await Promise.all([
        supabase.from("events").select("id, status").eq("client_id", clientId),
        supabase.from("invoices").select("amount, status").eq("client_id", clientId)
      ]);

      const eventList = (eventsRes.data || []) as any[];
      const invoiceList = (invoicesRes.data || []) as any[];

      return {
        eventCount: eventList.length,
        totalRevenue: invoiceList.reduce((acc: number, inv: any) => acc + (Number(inv.amount) || 0), 0),
        activeEvents: eventList.filter((e: any) => e.status === "active").length
      };
    } catch (err) {
      return { eventCount: 0, totalRevenue: 0, activeEvents: 0 };
    }
  },

  async getClientDetails(clientId: string): Promise<ClientDetailsResponse | null> {
    try {
      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .maybeSingle();

      if (!client) return null;

      const [eventsRes, quotesRes, invoicesRes, communicationsRes] = await Promise.all([
        supabase.from("events").select("*").eq("client_id", clientId),
        supabase.from("quotes").select("*").eq("client_id", clientId),
        supabase.from("invoices").select("*").eq("client_id", clientId),
        supabase.from("communications").select("*").eq("client_id", clientId)
      ]);

      const eventList = (eventsRes.data || []) as any[];
      const eventIds = eventList.map((e: any) => e.id);

      let filteredTasks: any[] = [];
      if (eventIds.length > 0) {
        const { data: tasks } = await supabase
          .from("tasks")
          .select("*")
          .in("event_id", eventIds.slice(0, 50)) as any;
        filteredTasks = tasks || [];
      }

      return {
        client,
        events: eventList,
        quotes: (quotesRes.data || []) as any[],
        invoices: (invoicesRes.data || []) as any[],
        communications: (communicationsRes.data || []) as any[],
        tasks: filteredTasks
      };
    } catch (err) {
      console.error("Error fetching client details:", err);
      return null;
    }
  },
};
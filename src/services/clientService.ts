import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export const clientService = {
  async getClients(serverId: string, filters?: { search?: string; status?: string }) {
    let query = supabase
      .from("clients")
      .select("*")
      .eq("server_id", serverId)
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }

    return data || [];
  },

  async getClientById(clientId: string) {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching client:", error);
      return null;
    }

    return data;
  },

  async createClient(client: ClientInsert) {
    const { data, error } = await supabase
      .from("clients")
      .insert(client)
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      throw error;
    }

    return data;
  },

  async updateClient(clientId: string, updates: ClientUpdate) {
    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", clientId)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      throw error;
    }

    return data;
  },

  async deleteClient(clientId: string) {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId);

    if (error) {
      console.error("Error deleting client:", error);
      throw error;
    }

    return true;
  },

  async getClientStats(serverId: string) {
    const { data, error } = await supabase
      .from("clients")
      .select("status, total_spent, total_events")
      .eq("server_id", serverId);

    if (error) {
      console.error("Error fetching client stats:", error);
      return { total: 0, byStatus: {}, totalSpent: 0, totalEvents: 0 };
    }

    const clients = data || [];
    const total = clients.length;
    const byStatus = clients.reduce(
      (acc, client) => {
        const status = client.status || "Lead";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalSpent = clients.reduce(
      (sum, client) => sum + (Number(client.total_spent) || 0),
      0
    );

    const totalEvents = clients.reduce(
      (sum, client) => sum + (client.total_events || 0),
      0
    );

    return { total, byStatus, totalSpent, totalEvents };
  }
};
import { supabase } from "@/integrations/supabase/client";

export const invoiceService = {
  async getInvoices(serverId?: string) {
    try {
      let query = supabase.from("invoices").select("*");
      
      if (serverId) {
        query = query.eq("server_id", serverId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching invoices:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("Error in getInvoices:", err);
      return [];
    }
  },

  async createInvoice(invoiceData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_server_id")
      .eq("id", user.id)
      .single();

    if (!profile?.current_server_id) throw new Error("No active server");

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        server_id: profile.current_server_id,
        ...invoiceData,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getInvoiceStats(serverId: string) {
    try {
      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .eq("server_id", serverId);

      if (!invoices) return { total: 0, byStatus: {}, totalAmount: 0 };

      const total = invoices.length;
      const byStatus: Record<string, number> = {};
      let totalAmount = 0;

      invoices.forEach((invoice) => {
        byStatus[invoice.status || "unpaid"] = (byStatus[invoice.status || "unpaid"] || 0) + 1;
        totalAmount += invoice.total || 0;
      });

      return { total, byStatus, totalAmount };
    } catch (err) {
      console.error("Error calculating invoice stats:", err);
      return { total: 0, byStatus: {}, totalAmount: 0 };
    }
  },
};
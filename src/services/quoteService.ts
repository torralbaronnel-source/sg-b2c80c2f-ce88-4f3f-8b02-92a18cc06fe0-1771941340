import { supabase } from "@/integrations/supabase/client";

export const quoteService = {
  async getQuotes(serverId?: string) {
    try {
      let query = supabase.from("quotes").select("*");
      
      if (serverId) {
        query = query.eq("server_id", serverId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching quotes:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("Error in getQuotes:", err);
      return [];
    }
  },

  async createQuote(quoteData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_server_id")
      .eq("id", user.id)
      .single();

    if (!profile?.current_server_id) throw new Error("No active server");

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        server_id: profile.current_server_id,
        ...quoteData,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getQuoteStats(serverId: string) {
    try {
      const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .eq("server_id", serverId);

      if (!quotes) return { total: 0, byStatus: {}, totalValue: 0 };

      const total = quotes.length;
      const byStatus: Record<string, number> = {};
      let totalValue = 0;

      quotes.forEach((quote) => {
        byStatus[quote.status || "draft"] = (byStatus[quote.status || "draft"] || 0) + 1;
        totalValue += quote.total || 0;
      });

      return { total, byStatus, totalValue };
    } catch (err) {
      console.error("Error calculating quote stats:", err);
      return { total: 0, byStatus: {}, totalValue: 0 };
    }
  },
};
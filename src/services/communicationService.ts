import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Communication = Database["public"]["Tables"]["communications"]["Row"];
export type CommunicationMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];

export const communicationService = {
  async getCommunications() {
    const serverId = typeof window !== "undefined" ? localStorage.getItem("selectedServerId") : null;
    if (!serverId) return [];

    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .eq("server_id", serverId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMessages(communicationId: string) {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("communication_id", communicationId)
      .order("timestamp", { ascending: true });
    
    return { data, error };
  },

  async sendMessage(communicationId: string, content: string, senderName: string) {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .insert({
        communication_id: communicationId,
        content,
        sender_name: senderName,
        is_from_me: true
      })
      .select()
      .single();
    
    if (!error) {
      await supabase
        .from("communications")
        .update({ last_message: content, updated_at: new Date().toISOString() })
        .eq("id", communicationId);
    }
    
    return { data, error };
  },

  async createCommunication(comm: any) {
    const serverId = typeof window !== "undefined" ? localStorage.getItem("selectedServerId") : null;
    
    const { data, error } = await supabase
      .from("communications")
      .insert([{ ...comm, server_id: serverId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
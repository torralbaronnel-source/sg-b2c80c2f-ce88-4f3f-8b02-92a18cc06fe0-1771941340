import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Communication = Database["public"]["Tables"]["communications"]["Row"];
export type CommunicationMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];

export const communicationService = {
  async getCommunications(coordinatorId: string) {
    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .eq("coordinator_id", coordinatorId)
      .order("updated_at", { ascending: false });
    
    return { data, error };
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

  async createCommunication(payload: any) {
    const { data, error } = await supabase
      .from("communications")
      .insert(payload)
      .select()
      .single();
    
    return { data, error };
  }
};
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type WhatsAppMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];
export type Communication = Database["public"]["Tables"]["communications"]["Row"];

export interface WhatsAppConversation extends Communication {
  // Mapping the database record to what the UI expects if names differ
  // In our case, we added 'vendor' and 'priority' to the table
  display_name?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string; // The UI expects 'content' instead of 'body'
  category: string;
}

export const whatsappService = {
  async getConversations(coordinatorId: string) {
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

  async sendTextMessage(communicationId: string, content: string, senderName: string) {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .insert({
        communication_id: communicationId,
        content,
        sender_name: senderName,
        is_from_me: true,
        direction: "outbound"
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
  }
};
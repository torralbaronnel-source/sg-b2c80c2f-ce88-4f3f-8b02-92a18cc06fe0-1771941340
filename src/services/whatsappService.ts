import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type WhatsAppMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];

export interface WhatsAppConversation {
  id: string;
  contact_name: string;
  last_message: string;
  updated_at: string;
  unread_count: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  body: string;
  category: string;
}

export const whatsappService = {
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
  }
};
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Communication = Database["public"]["Tables"]["communications"]["Row"];
export type CommunicationMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];

export const communicationService = {
  async getCommunications() {
    return await supabase
      .from("communications")
      .select("*")
      .order("updated_at", { ascending: false });
  },

  async getMessages(communicationId: string) {
    return await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("communication_id", communicationId)
      .order("created_at", { ascending: true });
  },

  async sendMessage(params: {
    communicationId: string;
    senderId: string;
    content: string;
    platform: string;
  }) {
    return await supabase.from("whatsapp_messages").insert({
      communication_id: params.communicationId,
      sender_name: "You", // Fallback since sender_id isn't in the table schema currently
      content: params.content,
      is_from_me: true,
      status: "Sent"
    });
  },

  subscribeToMessages(communicationId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`chat:${communicationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `communication_id=eq.${communicationId}`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
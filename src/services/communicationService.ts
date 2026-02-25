import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Communication = Database["public"]["Tables"]["communications"]["Row"];
export type CommunicationMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];

export const communicationService = {
  async getCommunications() {
    const { data: profile } = await supabase.auth.getUser();
    if (!profile.user) return [];

    const { data: profileData } = await supabase
      .from("profiles")
      .select("current_server_id")
      .eq("id", profile.user.id)
      .single();

    if (!profileData?.current_server_id) return [];

    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .eq("server_id", profileData.current_server_id)
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
    
    if (error) throw error;
    return data || [];
  },

  async sendMessage(communicationId: string, content: string, senderName: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("whatsapp_messages")
      .insert({
        communication_id: communicationId,
        content,
        sender_name: senderName,
        is_from_me: true,
        status: 'sent'
      })
      .select()
      .single();
    
    if (!error) {
      await supabase
        .from("communications")
        .update({ 
          last_message: content, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", communicationId);
    }
    
    if (error) throw error;
    return data;
  },

  subscribeToMessages(communicationId: string, onMessage: (message: CommunicationMessage) => void) {
    return supabase
      .channel(`messages:${communicationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "whatsapp_messages",
          filter: `communication_id=eq.${communicationId}`,
        },
        (payload) => {
          onMessage(payload.new as CommunicationMessage);
        }
      )
      .subscribe();
  },

  subscribeToCommunications(serverId: string, onUpdate: () => void) {
    return supabase
      .channel(`communications:${serverId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "communications",
          filter: `server_id=eq.${serverId}`,
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();
  }
};
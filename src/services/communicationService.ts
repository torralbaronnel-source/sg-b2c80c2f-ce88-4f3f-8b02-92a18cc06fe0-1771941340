import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Helper types since auto-gen might take a moment to reflect in linting
export type Communication = Database["public"]["Tables"]["communications"]["Row"] & {
  type?: string;
  category?: string;
  pinned_message_id?: string | null;
};

export type CommunicationMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"] & {
  reactions?: any;
  reply_to_id?: string | null;
  reply_to?: any;
};

export const communicationService = {
  async getCommunications() {
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth.user) return [];

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_server_id")
      .eq("id", userAuth.user.id)
      .single();

    if (!profile?.current_server_id) return [];

    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .eq("server_id", profile.current_server_id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Communication[];
  },

  async getMessages(communicationId: string) {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .select(`
        *,
        reply_to:reply_to_id(*)
      `)
      .eq("communication_id", communicationId)
      .order("timestamp", { ascending: true });
    
    if (error) throw error;
    return (data || []) as CommunicationMessage[];
  },

  async sendMessage(params: {
    communicationId: string;
    content: string;
    senderName: string;
    replyToId?: string;
  }) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("whatsapp_messages")
      .insert({
        communication_id: params.communicationId,
        content: params.content,
        sender_name: params.senderName,
        is_from_me: true,
        status: 'sent',
        reply_to_id: params.replyToId
      } as any)
      .select()
      .single();
    
    if (!error) {
      await supabase
        .from("communications")
        .update({ 
          last_message: params.content, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", params.communicationId);
    }
    
    if (error) throw error;
    return data;
  },

  async addReaction(messageId: string, emoji: string) {
    const { data: msg } = await supabase
      .from("whatsapp_messages")
      .select("reactions")
      .eq("id", messageId)
      .single();
    
    const reactions = ((msg as any)?.reactions as Record<string, number>) || {};
    reactions[emoji] = (reactions[emoji] || 0) + 1;

    const { error } = await supabase
      .from("whatsapp_messages")
      .update({ reactions } as any)
      .eq("id", messageId);
    
    return { error };
  }
};
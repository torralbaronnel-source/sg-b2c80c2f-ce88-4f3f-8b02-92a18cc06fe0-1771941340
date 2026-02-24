import { supabase } from "@/integrations/supabase/client";

export interface Communication {
  id: string;
  coordinator_id: string;
  contact_name: string;
  contact_type: 'Client' | 'Vendor' | 'Staff';
  platform: 'WhatsApp' | 'Slack' | 'Email';
  last_message: string;
  status: 'Active' | 'Archived';
  unread_count: number;
  created_at: string;
  updated_at: string;
  vendor?: string;
  priority: 'Low' | 'Medium' | 'High';
}

export const whatsappService = {
  async getChats(): Promise<Communication[]> {
    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      return [];
    }

    return (data as any[]) || [];
  },
  
  async sendMessage(contactName: string, message: string, coordinatorId: string, platform: 'WhatsApp' | 'Slack' | 'Email' = 'WhatsApp') {
    // First, find or create the communication thread
    const { data: existingChat } = await supabase
      .from("communications")
      .select("id")
      .eq("contact_name", contactName)
      .eq("coordinator_id", coordinatorId)
      .maybeSingle();

    let chatId = existingChat?.id;

    if (!chatId) {
      const { data: newChat, error: chatError } = await supabase
        .from("communications")
        .insert([{
          contact_name: contactName,
          coordinator_id: coordinatorId,
          platform: platform,
          last_message: message,
          status: 'Active'
        }])
        .select()
        .single();
      
      if (chatError) return { success: false, error: chatError };
      chatId = newChat.id;
    }

    // Then insert the message into whatsapp_messages
    const { error: msgError } = await supabase
      .from("whatsapp_messages")
      .insert([{
        communication_id: chatId,
        sender_name: "Admin", // Or fetch from profile
        content: message,
        is_from_me: true,
        direction: 'outbound'
      }]);

    if (msgError) {
      console.error("Error sending message:", msgError);
      return { success: false, error: msgError };
    }

    // Update the last message in communications
    await supabase
      .from("communications")
      .update({ last_message: message, updated_at: new Date().toISOString() })
      .eq("id", chatId);

    return { success: true };
  }
};
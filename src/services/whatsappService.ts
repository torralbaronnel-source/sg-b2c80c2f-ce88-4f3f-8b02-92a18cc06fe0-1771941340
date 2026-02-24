import { supabase } from "@/integrations/supabase/client";

export interface Communication {
  id: string;
  sender_name: string;
  sender_type: 'client' | 'vendor' | 'admin';
  message_body: string;
  status: 'pending' | 'responded' | 'urgent';
  platform: 'whatsapp' | 'slack' | 'email';
  created_at: string;
}

export const whatsappService = {
  async getChats(): Promise<Communication[]> {
    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      return [];
    }

    return data as Communication[];
  },
  
  async sendMessage(senderName: string, message: string, userId: string) {
    const { data, error } = await supabase
      .from("communications")
      .insert([
        { 
          sender_name: senderName, 
          message_body: message, 
          sender_type: 'admin',
          status: 'responded',
          platform: 'whatsapp',
          user_id: userId
        }
      ]);

    if (error) {
      console.error("Error sending message:", error);
      return { success: false, error };
    }

    return { success: true, data };
  }
};
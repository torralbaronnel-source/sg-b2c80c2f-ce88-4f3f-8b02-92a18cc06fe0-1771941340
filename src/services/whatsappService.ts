import { supabase } from "@/integrations/supabase/client";

export const whatsappService = {
  async getChats() {
    // Mock for now, will connect to DB later
    return [
      { id: "1", name: "Maria Clara", lastMessage: "Confirming...", status: "urgent" },
    ];
  },
  
  async sendMessage(chatId: string, message: string) {
    console.log(`Sending WhatsApp to ${chatId}: ${message}`);
    // Future integration point for Twilio/Cloud API
    return { success: true };
  }
};
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type Vendor = Database['public']['Tables']['event_vendors']['Row'];

export interface WhatsAppMessage {
  id: string;
  wa_message_id: string;
  content: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  metadata: {
    media_url?: string;
    media_name?: string;
    voice_duration?: number;
    file_size?: number;
    message_type?: 'text' | 'image' | 'voice' | 'document';
  };
  priority?: 'low' | 'normal' | 'urgent' | 'critical';
  vendor_id: string;
  event_id: string;
}

export interface WhatsAppConversation {
  vendor: {
    id: string;
    name: string;
    phone_number: string;
    company?: string;
    role: string;
  };
  last_message: {
    content: string;
    timestamp: string;
    direction: 'inbound' | 'outbound';
    status: string;
  };
  unread_count: number;
  event_id: string;
  event_name: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  category: 'urgent' | 'schedule' | 'payment' | 'vendor' | 'general';
  variables?: string[];
}

class WhatsAppService {
  private baseURL: string;
  private accessToken: string;
  private phoneId: string;

  constructor() {
    // WhatsApp Business API configuration
    this.baseURL = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneId = process.env.WHATSAPP_PHONE_ID || '';
  }

  // Core WhatsApp Business API methods
  async sendMessage(to: string, content: string, messageType: 'text' | 'template' = 'text'): Promise<WhatsAppMessage | null> {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to.replace(/[^0-9]/g, ''), // Clean phone number
        type: messageType,
        [messageType]: {
          body: content
        }
      };

      const response = await fetch(`${this.baseURL}/${this.phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Store message in our database
      const messageData = {
        event_id: '', // Will be set by caller
        vendor_id: null, // Will be set by caller
        platform: 'whatsapp',
        sender_name: 'Coordinator',
        sender_type: 'coordinator',
        content,
        message_type: 'text',
        external_id: data.messages[0].id,
        direction: 'outbound',
        status: 'sent',
        created_at: new Date().toISOString()
      };

      const { data: storedMessage } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (!storedMessage) return null;

      return {
        id: storedMessage.id,
        wa_message_id: storedMessage.external_id || '',
        from: '',
        to: to,
        content: storedMessage.content,
        message_type: storedMessage.message_type as 'text' | 'image' | 'document' | 'voice' | 'video',
        timestamp: storedMessage.created_at,
        status: storedMessage.status as 'sent' | 'delivered' | 'read' | 'failed',
        direction: storedMessage.direction as 'inbound' | 'outbound',
        vendor_id: storedMessage.vendor_id,
        event_id: storedMessage.event_id
      };

    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return null;
    }
  }

  async sendMediaMessage(
    to: string, 
    mediaUrl: string, 
    mediaType: 'image' | 'document' | 'video',
    caption?: string
  ): Promise<WhatsAppMessage | null> {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to.replace(/[^0-9]/g, ''),
        type: mediaType,
        [mediaType]: {
          link: mediaUrl,
          ...(caption && { caption })
        }
      };

      const response = await fetch(`${this.baseURL}/${this.phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Store message in database
      const messageData = {
        event_id: '', // Will be set by caller
        vendor_id: null, // Will be set by caller
        platform: 'whatsapp',
        sender_name: 'Coordinator',
        sender_type: 'coordinator',
        content: caption || `Sent ${mediaType}`,
        message_type: mediaType,
        external_id: data.messages[0].id,
        direction: 'outbound',
        status: 'sent',
        created_at: new Date().toISOString()
      };

      const { data: storedMessage } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (!storedMessage) return null;

      return {
        id: storedMessage.id,
        wa_message_id: storedMessage.external_id || '',
        from: '',
        to: to,
        content: storedMessage.content,
        message_type: storedMessage.message_type as 'text' | 'image' | 'document' | 'voice' | 'video',
        timestamp: storedMessage.created_at,
        status: storedMessage.status as 'sent' | 'delivered' | 'read' | 'failed',
        direction: storedMessage.direction as 'inbound' | 'outbound',
        vendor_id: storedMessage.vendor_id,
        event_id: storedMessage.event_id
      };

    } catch (error) {
      console.error('Error sending WhatsApp media:', error);
      return null;
    }
  }

  // Webhook handler for incoming messages
  async handleIncomingMessage(webhookData: any): Promise<void> {
    try {
      if (webhookData.object !== 'whatsapp_business_account') return;

      const entry = webhookData.entry[0];
      const changes = entry.changes[0];
      const messages = changes.value.messages;

      if (!messages || messages.length === 0) return;

      const message = messages[0];

      // Store inbound message
      const messageData = {
        event_id: '', // TODO: Match to ongoing event
        vendor_id: null, // TODO: Match to vendor
        platform: 'whatsapp',
        sender_name: message.from,
        sender_type: 'vendor',
        content: message.text?.body || message.image?.caption || 'Media message',
        message_type: message.type,
        external_id: message.id,
        direction: 'inbound',
        status: 'delivered',
        created_at: new Date().toISOString()
      };

      await supabase.from('messages').insert(messageData);

    } catch (error) {
      console.error('Error handling WhatsApp webhook:', error);
    }
  }

  // Tablet View - Conversation List
  async getConversations(eventId: string): Promise<WhatsAppConversation[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          event_vendors!messages_vendor_id_fkey(*)
        `)
        .eq('event_id', eventId)
        .eq('platform', 'whatsapp')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by vendor and get latest message
      const conversations = new Map<string, WhatsAppConversation>();

      data?.forEach((message: any) => {
        const vendorId = message.vendor_id;
        if (!vendorId || !message.event_vendors || Array.isArray(message.event_vendors)) return;

        if (!conversations.has(vendorId)) {
          conversations.set(vendorId, {
            vendor: {
              id: message.event_vendors.id,
              name: message.event_vendors.vendor_name,
              phone_number: message.event_vendors.contact_phone || '',
              company: message.event_vendors.vendor_type,
              role: message.event_vendors.vendor_type
            },
            last_message: {
              content: message.content,
              timestamp: message.created_at,
              direction: message.direction,
              status: message.status
            },
            unread_count: message.direction === 'inbound' && message.status === 'delivered' ? 1 : 0,
            event_id: message.event_id,
            event_name: '' // TODO: Join with events table
          });
        } else {
          const existing = conversations.get(vendorId);
          if (existing && message.direction === 'inbound' && message.status === 'delivered') {
            existing.unread_count++;
          }
        }
      });

      // Convert Map to array and sort
      const sortedConversations: WhatsAppConversation[] = [];
      conversations.forEach((conv) => {
        sortedConversations.push(conv);
      });

      return sortedConversations.sort((a, b) => 
        new Date(b.last_message.timestamp).getTime() - new Date(a.last_message.timestamp).getTime()
      );

    } catch (error) {
      console.error('Error fetching WhatsApp conversations:', error);
      return [];
    }
  }

  // Manager View - Full conversation history
  async getConversationHistory(vendorId: string, eventId: string): Promise<WhatsAppMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .eq('vendor_id', vendorId)
        .eq('platform', 'whatsapp')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map(msg => {
        const messageObj: WhatsAppMessage = {
          id: msg.id,
          wa_message_id: msg.external_id || '',
          from: msg.direction === 'inbound' ? msg.sender_name : '',
          to: msg.direction === 'outbound' ? msg.sender_name : '',
          content: msg.content,
          message_type: msg.message_type as 'text' | 'image' | 'document' | 'voice' | 'video',
          timestamp: msg.created_at,
          status: msg.status as 'sent' | 'delivered' | 'read' | 'failed',
          direction: msg.direction as 'inbound' | 'outbound',
          vendor_id: msg.vendor_id,
          event_id: msg.event_id
        };

        // Add metadata if it exists
        if (msg.metadata && typeof msg.metadata === 'object' && !Array.isArray(msg.metadata)) {
          messageObj.metadata = {
            media_url: msg.metadata.media_url as string,
            media_name: msg.metadata.media_name as string,
            voice_duration: msg.metadata.voice_duration as number,
            file_size: msg.metadata.file_size as number
          };
        }

        return messageObj;
      }) || [];

    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  // Quick Reply Templates
  async getQuickReplyTemplates(): Promise<WhatsAppTemplate[]> {
    // Pre-defined templates for Philippine event coordination
    return [
      {
        id: '1',
        name: 'Schedule Confirmation',
        content: 'Hi {vendor_name}! Confirming your schedule for {event_name} on {date} at {time}. Please acknowledge. Thank you!',
        category: 'schedule',
        variables: ['vendor_name', 'event_name', 'date', 'time']
      },
      {
        id: '2',
        name: 'Urgent Setup Change',
        content: '🚨 URGENT: Setup location changed from {old_location} to {new_location}. Please proceed immediately. Contact coordinator if issues.',
        category: 'urgent',
        variables: ['old_location', 'new_location']
      },
      {
        id: '3',
        name: 'Payment Confirmation',
        content: 'Good day! We have processed your payment of {amount} for {service}. Receipt attached. Thank you for your service!',
        category: 'payment',
        variables: ['amount', 'service']
      },
      {
        id: '4',
        name: 'Arrival Instructions',
        content: 'Hi {vendor_name}! Please arrive at {venue} via {entrance} at {arrival_time}. Look for {contact_person}. Parking available at {parking_area}.',
        category: 'vendor',
        variables: ['vendor_name', 'venue', 'entrance', 'arrival_time', 'contact_person', 'parking_area']
      },
      {
        id: '5',
        name: 'Event Cancellation',
        content: 'Due to {reason}, the {event_name} scheduled on {date} has been {status}. We apologize for the inconvenience.',
        category: 'urgent',
        variables: ['reason', 'event_name', 'date', 'status']
      },
      {
        id: '6',
        name: 'Final Briefing',
        content: 'Final briefing for {event_name} tomorrow {time} at {location}. Please bring {requirements}. Contact {coordinator} for questions.',
        category: 'schedule',
        variables: ['event_name', 'time', 'location', 'requirements', 'coordinator']
      },
      {
        id: '7',
        name: 'Emergency Contact',
        content: 'EMERGENCY: Please call coordinator immediately at {phone_number}. {emergency_details}. Reply ASAP.',
        category: 'urgent',
        variables: ['phone_number', 'emergency_details']
      },
      {
        id: '8',
        name: 'Thank You & Follow-up',
        content: 'Thank you for your excellent service at {event_name}! Your professionalism was greatly appreciated. Hope to work with you again!',
        category: 'general',
        variables: ['event_name']
      }
    ];
  }

  // Search conversations
  async searchConversations(eventId: string, query: string): Promise<WhatsAppConversation[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          event_vendors!messages_vendor_id_fkey(*)
        `)
        .eq('event_id', eventId)
        .eq('platform', 'whatsapp')
        .or(`content.ilike.%${query}%,sender_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Similar to getConversations, group by vendor
      const conversations = new Map<string, WhatsAppConversation>();

      data?.forEach((message: any) => {
        const vendorId = message.vendor_id;
        if (!vendorId || !message.event_vendors || Array.isArray(message.event_vendors)) return;

        if (!conversations.has(vendorId)) {
          conversations.set(vendorId, {
            vendor: {
              id: message.event_vendors.id,
              name: message.event_vendors.vendor_name,
              phone_number: message.event_vendors.contact_phone || '',
              company: message.event_vendors.vendor_type,
              role: message.event_vendors.vendor_type
            },
            last_message: {
              content: message.content,
              timestamp: message.created_at,
              direction: message.direction,
              status: message.status
            },
            unread_count: message.direction === 'inbound' && message.status === 'delivered' ? 1 : 0,
            event_id: message.event_id,
            event_name: ''
          });
        }
      });

      // Convert Map to array and return
      const searchResults: WhatsAppConversation[] = [];
      conversations.forEach((conv) => {
        searchResults.push(conv);
      });

      return searchResults;

    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }

  // Export conversations for manager view
  async exportConversationHistory(vendorId: string, eventId: string): Promise<string> {
    try {
      const conversations = await this.getConversationHistory(vendorId, eventId);
      
      const csvContent = [
        'Timestamp,Direction,Sender,Content,Status',
        ...conversations.map(conv => 
          `"${conv.timestamp}","${conv.direction}","${conv.from}","${conv.content.replace(/"/g, '""')}","${conv.status}"`
        )
      ].join('\n');

      return csvContent;

    } catch (error) {
      console.error('Error exporting conversation:', error);
      return '';
    }
  }

  // Update message status (from webhook)
  async updateMessageStatus(messageId: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status })
        .eq('external_id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
      }

    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }
}

export const whatsAppService = new WhatsAppService();
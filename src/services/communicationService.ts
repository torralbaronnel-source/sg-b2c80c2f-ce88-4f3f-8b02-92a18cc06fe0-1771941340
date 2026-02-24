import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type Vendor = Database['public']['Tables']['event_vendors']['Row'];

export interface CommunicationMessage extends Message {
  vendor?: Vendor;
}

export interface EventWithDetails extends Event {
  vendor_count?: number;
  message_count?: number;
  vendors?: Vendor[];
}

class CommunicationService {
  // Events
  async getEvents(coordinatorId: string): Promise<EventWithDetails[]> {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        event_vendors(count),
        messages(count)
      `)
      .eq('created_by', coordinatorId)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return events.map(event => ({
      ...event,
      vendor_count: event.event_vendors?.[0]?.count || 0,
      message_count: event.messages?.[0]?.count || 0
    }));
  }

  async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'created_by'>): Promise<Event | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return null;
    }

    return data;
  }

  // Vendors
  async getEventVendors(eventId: string): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('event_vendors')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching vendors:', error);
      return [];
    }

    return data || [];
  }

  async addVendorToEvent(eventId: string, vendorData: Omit<Vendor, 'id' | 'created_at'>): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from('event_vendors')
      .insert(vendorData)
      .select()
      .single();

    if (error) {
      console.error('Error adding vendor:', error);
      return null;
    }

    return data;
  }

  // Messages
  async getEventMessages(eventId: string): Promise<CommunicationMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        event_vendors(*)
      `)
      .eq('event_id', eventId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  }

  async createMessage(messageData: Omit<Message, 'id' | 'timestamp'>): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return null;
    }

    return data;
  }

  // Platform-specific methods
  async sendWhatsAppMessage(eventId: string, vendorId: string, content: string): Promise<boolean> {
    // TODO: Integrate with WhatsApp Business API
    const messageData = {
      event_id: eventId,
      vendor_id: vendorId,
      platform: 'whatsapp' as const,
      sender_name: 'Coordinator',
      sender_type: 'coordinator' as const,
      content,
      message_type: 'text' as const,
      external_id: null,
      direction: 'outbound' as const,
      status: 'sent' as const,
      created_at: new Date().toISOString()
    };

    const result = await this.createMessage(messageData);
    return result !== null;
  }

  async sendSlackMessage(eventId: string, channelId: string, content: string): Promise<boolean> {
    // TODO: Integrate with Slack API
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const messageData = {
      event_id: eventId,
      vendor_id: null,
      platform: 'slack' as const,
      sender_name: user.user_metadata?.full_name || 'Coordinator',
      sender_type: 'coordinator' as const,
      content,
      message_type: 'text' as const,
      external_id: channelId,
      direction: 'outbound' as const,
      status: 'sent' as const,
      created_at: new Date().toISOString()
    };

    const result = await this.createMessage(messageData);
    return result !== null;
  }

  async sendEmail(eventId: string, recipientEmail: string, subject: string, content: string): Promise<boolean> {
    // TODO: Integrate with email service (SendGrid, etc.)
    const messageData = {
      event_id: eventId,
      vendor_id: null,
      platform: 'email' as const,
      sender_name: 'Coordinator',
      sender_type: 'coordinator' as const,
      content: `Subject: ${subject}\n\n${content}`,
      message_type: 'text' as const,
      external_id: recipientEmail,
      direction: 'outbound' as const,
      status: 'sent' as const,
      created_at: new Date().toISOString()
    };

    const result = await this.createMessage(messageData);
    return result !== null;
  }

  async logCall(eventId: string, vendorId: string, duration: number, notes: string): Promise<boolean> {
    const messageData = {
      event_id: eventId,
      vendor_id: vendorId,
      platform: 'call' as const,
      sender_name: 'Coordinator',
      sender_type: 'coordinator' as const,
      content: `Call duration: ${duration} minutes\n\nNotes: ${notes}`,
      message_type: 'call' as const,
      external_id: null,
      direction: 'outbound' as const,
      status: 'sent' as const,
      created_at: new Date().toISOString()
    };

    const result = await this.createMessage(messageData);
    return result !== null;
  }

  // Enhanced messaging with priority
  async sendMessage(
    eventId: string,
    recipientType: string,
    content: string,
    priority: 'normal' | 'urgent' | 'critical' = 'normal',
    platform: string = 'whatsapp'
  ): Promise<Message | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Detect priority from message content
    const detectedPriority = content.includes('#') ? 'critical' : content.includes('@') ? 'urgent' : priority;

    const messageData = {
      event_id: eventId,
      vendor_id: null,
      platform: platform as any,
      sender_name: user.user_metadata?.full_name || 'Coordinator',
      sender_type: 'coordinator' as const,
      content,
      message_type: 'text' as const,
      external_id: null,
      direction: 'outbound' as const,
      status: 'sent' as const,
      priority: detectedPriority,
      created_at: new Date().toISOString()
    };

    const result = await this.createMessage(messageData);
    return result;
  }

  // Search and filtering
  async searchEvents(coordinatorId: string, query: string): Promise<EventWithDetails[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_vendors(count),
        messages(count)
      `)
      .eq('created_by', coordinatorId)
      .or(`title.ilike.%${query}%,client_name.ilike.%${query}%`)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error searching events:', error);
      return [];
    }

    return data.map(event => ({
      ...event,
      vendor_count: event.event_vendors?.[0]?.count || 0,
      message_count: event.messages?.[0]?.count || 0
    }));
  }

  async filterMessagesByPlatform(eventId: string, platform: string): Promise<CommunicationMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        event_vendors(*)
      `)
      .eq('event_id', eventId)
      .eq('platform', platform)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error filtering messages:', error);
      return [];
    }

    return data || [];
  }

  // Analytics
  async getCommunicationStats(coordinatorId: string): Promise<{
    totalEvents: number;
    totalMessages: number;
    totalVendors: number;
    responseRate: number;
  }> {
    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('created_by', coordinatorId);

    const { data: messages } = await supabase
      .from('messages')
      .select('id')
      .in('event_id', events?.map(e => e.id) || []);

    const { data: vendors } = await supabase
      .from('event_vendors')
      .select('id')
      .in('event_id', events?.map(e => e.id) || []);

    // For now, calculate response rate based on total messages vs vendors
    // TODO: Implement proper inbound/outbound message tracking when direction field is added
    const responseRate = events && events.length > 0 ? 
      ((messages?.length || 0) / (vendors?.length || 1)) * 50 : 0;

    return {
      totalEvents: events?.length || 0,
      totalMessages: messages?.length || 0,
      totalVendors: vendors?.length || 0,
      responseRate: Math.min(Math.round(responseRate), 100)
    };
  }
}

export const communicationService = new CommunicationService();
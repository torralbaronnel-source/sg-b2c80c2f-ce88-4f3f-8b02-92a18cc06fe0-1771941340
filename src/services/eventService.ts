import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { clientService } from "./clientService";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  call_time: string | null;
  location: string | null;
  status: string;
  type: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  budget: number;
  coordinator_id: string;
  server_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEvent = Omit<Event, "id" | "created_at" | "updated_at">;
export type UpdateEvent = Partial<CreateEvent>;

export const eventService = {
  async getEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data as Event[];
  },

  async createEvent(event: CreateEvent) {
    // 1. First, create the event
    const { data: newEvent, error: eventError } = await supabase
      .from("events")
      .insert(event)
      .select()
      .single();

    if (eventError) throw eventError;

    // 2. PIPELINE: Automatic CRM Synchronization
    // If we have client details, check if they exist in CRM, otherwise create them
    if (newEvent && event.client_name) {
      try {
        const clients = await clientService.getClients();
        const existingClient = clients.find(c => 
          c.email === event.client_email || c.full_name === event.client_name
        );

        if (!existingClient) {
          await clientService.createClient({
            full_name: event.client_name,
            email: event.client_email || undefined,
            phone: event.client_phone || undefined,
            status: "Lead",
            source: "Event Creation",
            notes: `Auto-generated from event: ${event.title}`,
            total_events: 1
          });
          console.log("PIPELINE: New CRM Client created automatically.");
        } else {
          // Update existing client stats
          await clientService.updateClient(existingClient.id, {
            total_events: (existingClient.total_events || 0) + 1
          });
          console.log("PIPELINE: Event linked to existing CRM Client.");
        }
      } catch (crmError) {
        console.error("PIPELINE ERROR: CRM Sync failed but event was created.", crmError);
      }
    }

    return newEvent as Event;
  },

  async updateEvent(id: string, updates: UpdateEvent) {
    return await supabase
      .from("events")
      .update(updates)
      .eq("id", id);
  },

  async deleteEvent(id: string) {
    return await supabase
      .from("events")
      .delete()
      .eq("id", id);
  }
};
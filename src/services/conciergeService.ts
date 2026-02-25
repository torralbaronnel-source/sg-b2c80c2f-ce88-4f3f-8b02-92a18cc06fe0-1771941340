import { supabase } from "@/integrations/supabase/client";

export type ConciergeRequestType = "Private Demo" | "Business Consultation" | "Portal Customization";
export type ConciergeStatus = "New" | "Contacted" | "Scheduled" | "In Progress" | "Completed" | "Archived";
export type ConciergePriority = "Low" | "Medium" | "High" | "VIP";

export interface ConciergeRequest {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  request_type: ConciergeRequestType;
  interested_modules?: string[];
  customization_details?: string;
  status?: ConciergeStatus;
  priority?: ConciergePriority;
  user_id?: string;
  created_at?: string;
}

export const conciergeService = {
  async submitRequest(request: ConciergeRequest) {
    const { data, error } = await supabase
      .from("private_concierge_requests")
      .insert([request])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllRequests() {
    const { data, error } = await supabase
      .from("private_concierge_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateRequestStatus(id: string, status: ConciergeStatus) {
    const { data, error } = await supabase
      .from("private_concierge_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRequestPriority(id: string, priority: ConciergePriority) {
    const { data, error } = await supabase
      .from("private_concierge_requests")
      .update({ priority })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
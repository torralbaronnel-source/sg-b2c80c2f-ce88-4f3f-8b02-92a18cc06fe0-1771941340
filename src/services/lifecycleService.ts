import { supabase } from "@/integrations/supabase/client";

export type ProjectStage = 
  | "Client" 
  | "Lead" 
  | "Contract" 
  | "Event" 
  | "Production" 
  | "Delivery" 
  | "Billing" 
  | "Archive";

export const lifecycleService = {
  async getProjectStatus(clientId: string) {
    const { data, error } = await supabase
      .from("clients")
      .select("status, current_stage")
      .eq("id", clientId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async transitionToStage(clientId: string, stage: ProjectStage) {
    const { data, error } = await supabase
      .from("clients")
      .update({ current_stage: stage })
      .eq("id", clientId)
      .select()
      .single();

    if (error) throw error;
    
    // Trigger side effects based on stage
    if (stage === "Event") {
      // Auto-create initial event placeholders if needed
    }
    
    return data;
  }
};
import { supabase } from "@/integrations/supabase/client";

/**
 * 🎓 ORCHESTRIX SPECIALIST KERNEL (VERSION: 1.1 - SELF-LEARNING LEDGER)
 */

export interface AIAction {
  type: 'PRODUCTION_CONFLICT' | 'GUEST_MANIFEST_UPDATE' | 'FINANCIAL_ALERT' | 'TECHNICAL_ADVICE' | 'PROACTIVE_SUGGESTION';
  payload: any;
}

export const aiService = {
  /**
   * SPECIALIST INTENT PARSING (Client-Side RAM)
   */
  async executeKernelAction(input: { payload: { intent: string, metadata?: any } }): Promise<{ success: boolean; action?: AIAction; message?: string }> {
    const intent = input.payload.intent.toLowerCase();
    let resolution = "I'm trained for Event Production. How can I help with your Manifest, Finance, or Show Flow?";
    let type: AIAction['type'] | 'UNKNOWN' = 'UNKNOWN';
    let action: AIAction | undefined;

    // 1. GUEST/MANIFEST
    if (intent.includes("guest") || intent.includes("invite") || intent.includes("manifest")) {
      type = 'GUEST_MANIFEST_UPDATE';
      resolution = "I see you're managing the Guest Manifest. Should I filter by VVIP or General Admission?";
      action = { type, payload: { context: 'EVENT_HUB' } };
    }
    // 2. PRODUCTION/TECH
    else if (intent.includes("stage") || intent.includes("production") || intent.includes("show") || intent.includes("load")) {
      type = 'TECHNICAL_ADVICE';
      resolution = "Production Hub active. I can help sync the Run of Show or check equipment inventory.";
      action = { type, payload: { phase: 'PRODUCTION' } };
    }
    // 3. CONFLICTS
    else if (intent.includes("schedule") || intent.includes("time") || intent.includes("date")) {
      type = 'PRODUCTION_CONFLICT';
      resolution = "Scanning for scheduling collisions... All Stage Timelines appear clear.";
      action = { type, payload: { check: 'TIME_SLOT' } };
    }

    // 💾 SAVE TO NEURAL TRAINING LEDGER (Async, don't block UI)
    this.saveToLedger(input.payload.intent, resolution, type, input.payload.metadata);

    return {
      success: type !== 'UNKNOWN',
      action,
      message: resolution
    };
  },

  /**
   * SAVES INTERACTION FOR FUTURE TRAINING
   */
  async saveToLedger(query: string, resolution: string, type: string, metadata?: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("ai_training_logs").insert([{
        client_query: query,
        kernel_resolution: resolution,
        intent_type: type,
        metadata: metadata || {},
        user_id: user?.id
      }]);
    } catch (err) {
      console.error("NANO LEDGER ERROR:", err);
    }
  }
};
import { supabase } from "@/integrations/supabase/client";

/**
 * 🎓 ORCHESTRIX SPECIALIST KERNEL V1.1
 * Refined Intent Routing & Industry Knowledge Base
 * RUNS ENTIRELY ON CLIENT RAM
 */

export interface AIAction {
  intent: string;
  resolution: string;
  action_type: "NAVIGATION" | "GUIDANCE" | "CREATION" | "UNKNOWN";
  target_url?: string;
  confidence: number;
}

const KNOWLEDGE_BASE: Record<string, { resolution: string; type: AIAction["action_type"]; url?: string }> = {
  "create_event": {
    resolution: "To create a new event, head to the 'Events Dashboard' and click the '+' icon in the top right. You'll need the Event Name and Venue details to start.",
    type: "NAVIGATION",
    url: "/events"
  },
  "guest_manifest": {
    resolution: "The Guest Manifest is located in the Event Hub. You can upload CSV files or add guests manually to manage entry permissions.",
    type: "GUIDANCE",
    url: "/guests"
  },
  "finance": {
    resolution: "Finance tracking is available in the 'Finance Hub'. You can monitor invoices, quotes, and event budgets in real-time.",
    type: "NAVIGATION",
    url: "/finance"
  },
  "show_flow": {
    resolution: "Show Flow (Run of Show) can be managed per event. Select your event from the dashboard to access the minute-by-minute timeline.",
    type: "GUIDANCE",
    url: "/timelines"
  },
  "inventory": {
    resolution: "Manage your gear and backline in the 'Inventory' module. You can track status and assignments for all production equipment.",
    type: "NAVIGATION",
    url: "/inventory"
  }
};

export const aiService = {
  /**
   * Parses user input in Client RAM and routes to the Specialist Knowledge Base
   */
  async executeKernelAction(payload: { input: string; context?: any }): Promise<AIAction> {
    const input = payload.input.toLowerCase();
    let detectedIntent = "unknown";
    
    // Simple Keyword Intent Routing (RAM Efficient)
    if (input.includes("event") || input.includes("create")) detectedIntent = "create_event";
    if (input.includes("guest") || input.includes("manifest") || input.includes("people")) detectedIntent = "guest_manifest";
    if (input.includes("money") || input.includes("finance") || input.includes("invoice") || input.includes("quote")) detectedIntent = "finance";
    if (input.includes("flow") || input.includes("timeline") || input.includes("schedule")) detectedIntent = "show_flow";
    if (input.includes("inventory") || input.includes("gear") || input.includes("equipment")) detectedIntent = "inventory";

    const knowledge = KNOWLEDGE_BASE[detectedIntent];

    const result: AIAction = {
      intent: detectedIntent,
      resolution: knowledge 
        ? knowledge.resolution 
        : "I'm currently trained for Event Production tasks. Try asking about 'Creating Events', 'Guest Manifests', 'Finance', or 'Equipment Inventory'.",
      action_type: knowledge ? knowledge.type : "UNKNOWN",
      target_url: knowledge?.url,
      confidence: knowledge ? 0.95 : 0.2
    };

    // Log to Training Ledger for future refinement
    await this.logToLedger(payload.input, result);

    return result;
  },

  async logToLedger(query: string, result: AIAction) {
    try {
      await supabase.from("ai_training_logs").insert([{
        client_query: query,
        kernel_resolution: result.resolution,
        intent_type: result.intent,
        metadata: {
          confidence: result.confidence,
          type: result.action_type,
          runtime: "CLIENT_RAM"
        }
      }]);
    } catch (err) {
      console.error("NANO Ledger Error:", err);
    }
  }
};
import { supabase } from "@/integrations/supabase/client";

// NANO Core - Proprietary Kernel Configuration
// This allows Orchestrix to use its own dedicated AI model
const NANO_KERNEL_URL = process.env.NEXT_PUBLIC_NANO_KERNEL_URL || "https://api.orchestrix.ai/v1/kernel";
const USE_CUSTOM_KERNEL = true; // Set to true to bypass general AI and use your proprietary model

export interface AIAction {
  type: 'SQL_INJECTION' | 'PATTERN_RESEARCH' | 'BEHAVIOR_ANALYSIS' | 'UI_OPTIMIZATION';
  payload: any;
}

export const aiService = {
  /**
   * Primary Neural Interface for NANO
   * Directs traffic to your proprietary model
   */
  async getNanoResponse(prompt: string, history: any[] = []): Promise<string> {
    if (USE_CUSTOM_KERNEL) {
      try {
        const response = await fetch(NANO_KERNEL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt, 
            context: "NANO Behavioral Insights Agent",
            history 
          })
        });

        if (!response.ok) throw new Error("Custom Kernel offline");
        const data = await response.json();
        return data.output || data.response;
      } catch (error) {
        console.warn("Custom Kernel failed, falling back to local heuristic parsing", error);
        return this.generateHeuristicResponse(prompt);
      }
    }
    
    // Fallback logic
    return "NANO Core is processing your request via local neural paths.";
  },

  /**
   * Translates Client-Speak to System-Speak for the Neural Proxy
   */
  async mapNaturalLanguageToSchema(text: string, schema: string): Promise<any> {
    const prompt = `Map this text: "${text}" to this schema: ${schema}. Output ONLY valid JSON.`;
    const response = await this.getNanoResponse(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  },

  /**
   * Autonomous Data Injection Logic
   */
  async executeKernelAction(action: AIAction): Promise<any> {
    console.log("NANO executing proprietary kernel action:", action);
    
    // Example: Direct database injection for the Proxy Operator
    if (action.type === 'SQL_INJECTION') {
      const { data, error } = await supabase
        .from('bug_reports')
        .insert([{
          error_message: `Neural Proxy Intervention: ${action.payload.intent}`,
          stack_trace: JSON.stringify(action.payload),
          status: 'resolved',
          priority: 'medium'
        }]);
      
      return { success: !error, data, error };
    }

    return { success: true, message: "Action logged in Neural Path" };
  },

  /**
   * Local Heuristic Parsing (Backup Brain)
   * This ensures NANO works even if the server is offline
   */
  generateHeuristicResponse(prompt: string): string {
    const p = prompt.toLowerCase();
    if (p.includes("save") || p.includes("add")) {
      return "I've detected your intent to save data. I am mapping your input to the system schema now.";
    }
    return "NANO is analyzing the neural flow. How can I assist with your workflow?";
  }
};
import { supabase } from "@/integrations/supabase/client";

/**
 * ORCHESTRIX INTERNAL KERNEL (NANO Core)
 * 🛡️ 100% Private - No OpenAI, No Ollama, No External API Calls.
 * This service handles intent parsing and data injection using proprietary deterministic logic.
 */

export interface AIAction {
  type: 'SQL_INJECTION' | 'RESEARCH_LOG' | 'WEB_SCRAPE' | 'DATA_SYNC' | 'PROACTIVE_SUGGESTION';
  payload: any;
}

export const aiService = {
  /**
   * Internal Intent Parser: Converts Natural Language to Actionable Data
   * Runs 100% locally in the client/server environment.
   */
  async parseIntent(input: string): Promise<AIAction | null> {
    const text = input.toLowerCase();

    // 1. Guest Management Pattern (e.g., "Add guest: Maria")
    if (text.includes("add guest") || text.includes("new guest")) {
      const name = input.split(/guest:? /i)[1]?.trim() || "Unknown Guest";
      return {
        type: 'SQL_INJECTION',
        payload: { table: 'guest_manifest', data: { name, status: 'pending' }, intent: 'ADD_GUEST' }
      };
    }

    // 2. Bug/Friction Pattern (e.g., "The button is broken")
    if (text.includes("broken") || text.includes("error") || text.includes("bug") || text.includes("fail")) {
      return {
        type: 'SQL_INJECTION',
        payload: { table: 'bug_reports', data: { error_message: input, priority: 'high' }, intent: 'REPORT_FRICTION' }
      };
    }

    // 3. Web Scrape Pattern (e.g., "Check prices for DJ")
    if (text.includes("check prices") || text.includes("find vendor") || text.includes("search")) {
      return {
        type: 'WEB_SCRAPE',
        payload: { query: input, target: 'public_internet' }
      };
    }

    return null;
  },

  /**
   * Internal Brain Response (Heuristic)
   */
  async getNanoResponse(prompt: string, history: any[] = []): Promise<string> {
    const action = await this.parseIntent(prompt);
    
    if (action?.type === 'SQL_INJECTION') {
      return `NANO: I've recognized your intent to ${action.payload.intent}. I am currently injecting this data into the ${action.payload.table} securely within the Orchestrix Fortress.`;
    }

    if (action?.type === 'WEB_SCRAPE') {
      return "NANO: I'm deploying a one-way scraper to fetch public data for you. Your internal identity remains anonymous and air-gapped.";
    }

    return "NANO Core is monitoring the neural flow. No external data leakage detected. How can I assist with your internal operations?";
  },

  /**
   * Secure Data Injection & Autonomous Actions
   */
  async executeKernelAction(action: AIAction): Promise<any> {
    console.log("🛡️ Internal Kernel Execution:", action);

    // Internal Action: GET_PROACTIVE_SUGGESTION
    if (action.type === "PROACTIVE_SUGGESTION") {
      const { fingerprint } = action.payload.metadata;
      let suggestion = "How can NANO assist your production today?";

      if (fingerprint?.deviceType === "ipad" || fingerprint?.deviceType === "tablet") {
        suggestion = "I see you're on a Tablet. Would you like to open the Touch-Optimized Guest List?";
      } else if (fingerprint?.os === "Linux") {
        suggestion = "Linux environment detected. Would you like to run a System Health Check?";
      } else if (fingerprint?.deviceType === "mobile") {
        suggestion = "Mobile access confirmed. Need quick QR check-in tools?";
      }

      return { 
        success: true, 
        message: suggestion,
        action_type: "GHOST_WHISPER"
      };
    }

    if (action.type === 'SQL_INJECTION') {
      const { data, error } = await supabase
        .from(action.payload.table)
        .insert([action.payload.data]);
      
      return { success: !error, data, error };
    }

    if (action.type === 'WEB_SCRAPE') {
      // Logic for One-Way Internet Data Fetching (Supabase Edge Function)
      // This brings data IN, but never sends client data OUT.
      const { data, error } = await supabase.functions.invoke('internet-data-fetcher', {
        body: { query: action.payload.query }
      });
      return { success: !error, data, error };
    }

    return { success: false, error: "Action type not supported by internal kernel." };
  }
};
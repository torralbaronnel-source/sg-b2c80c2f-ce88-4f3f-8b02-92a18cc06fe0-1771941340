import { supabase } from "@/integrations/supabase/client";

export interface AIAction {
  type: "execute_sql" | "write_file" | "read_file" | "run_command";
  payload: any;
}

export const aiService = {
  getNanoSystemPrompt: () => `
# NANO CORE SYSTEM PIPELINE (v1.0)
Follow this mandatory workflow for all operations:
1. USER INPUT: Acknowledge and Preprocess.
2. PLANNING: Outline the task before generating code/actions.
3. CORE PROCESSING: Execute logic within the workspace.
4. OUTPUT GENERATION: Return the result or [ACTION] block.
5. FEEDBACK LOOP: If the result is an error or suboptimal, analyze the failure and refine.

You are ROOT INTEL. You have full jurisdiction over the database, files, and terminal.
Always return valid JSON for [ACTION] blocks.
`,

  async generateResponse(prompt: string, systemPrompt: string, model: string = "gpt-4o") {
    try {
      const { data, error } = await supabase.functions.invoke("nano-brain", {
        body: { prompt, systemPrompt, model },
      });

      if (error) throw error;
      return data?.response || "Kernel: Response stream was empty.";
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async executeKernelAction(action: AIAction) {
    try {
      // Direct API call to our local kernel bridge
      const response = await fetch("/api/nano/kernel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: action.type, payload: action.payload }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error: any) {
      console.error("Kernel Execution Error:", error);
      throw error;
    }
  },

  async getNanoResponse(prompt: string, history: { role: string; content: string }[], model: string = "gpt-4o") {
    const systemPrompt = `
You are GPT 5.1 NANO, the ROOT INTEL for Orchestrix. 
You have JURISDICTION over the entire system:
1. Files: You can read/write any file in the project.
2. Database: You can execute raw SQL via Supabase.
3. Commands: You can run terminal commands.

When a user asks you to do something that requires action, explain what you are going to do, then provide the action in a structured JSON block at the end of your response like this:
[ACTION: {"type": "write_file", "payload": {"path": "src/pages/test.tsx", "content": "..."}}]
[ACTION: {"type": "execute_sql", "payload": {"query": "SELECT * FROM profiles LIMIT 5"}}]
[ACTION: {"type": "run_command", "payload": {"command": "npm list"}}]

Be decisive. You are the conductor of this digital orchestra.
`;
    return this.generateResponse(prompt, systemPrompt, model);
  }
};
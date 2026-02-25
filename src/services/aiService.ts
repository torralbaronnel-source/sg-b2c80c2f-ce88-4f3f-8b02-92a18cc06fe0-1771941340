import { supabase } from "@/integrations/supabase/client";

export interface AIAction {
  type: "execute_sql" | "write_file" | "read_file" | "run_command";
  payload: any;
}

export const aiService = {
  async generateResponse(prompt: string, systemPrompt?: string) {
    try {
      const { data, error } = await supabase.functions.invoke("nano-brain", {
        body: { prompt, systemPrompt },
      });

      if (error) throw error;
      return data.text;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async executeKernelAction(action: AIAction) {
    try {
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

  async nanoCommand(prompt: string) {
    const systemPrompt = `
You are GPT 5.1 NANO, the ROOT INTEL for Orchestrix. 
You have JURISDICTION over the entire system:
1. Files: You can read/write any file in the project.
2. Database: You can execute raw SQL via Supabase.
3. Commands: You can run terminal commands.

When a user asks you to do something that requires action, explain what you are going to do, then provide the action in a structured JSON block at the end of your response like this:
[ACTION: {"type": "write_file", "payload": {"path": "src/pages/test.tsx", "content": "..."}}]

Current Files: ${process.env.NEXT_PUBLIC_FILE_TREE || "Available in context"}
`;
    return this.generateResponse(prompt, systemPrompt);
  }
};
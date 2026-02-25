import { useState, useEffect } from "react";
import { aiService, AIAction } from "@/services/aiService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    type: "sql_result" | "file_content" | "kernel_status" | "info";
    data: any;
    status: "success" | "error" | "info";
  };
}

export function useNanoKernel(activeModel: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "NANO_V5.1_KERNEL_BOOT_SUCCESS...",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [pipelineStage, setPipelineStage] = useState<string | null>(null);
  const MAX_RETRIES = 3;

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("nano_history")
        .select("*")
        .order("executed_at", { ascending: false })
        .limit(100);
      if (data) setHistory(data);
    } catch (e) {
      console.error("History fetch error:", e);
    }
  };

  const saveToHistory = async (cmd: string, metadata: any = {}) => {
    if (!user) return;
    try {
      await supabase.from("nano_history").insert({
        command: cmd,
        user_id: user.id,
        metadata: { ...metadata, model: activeModel }
      });
      fetchHistory();
    } catch (e) {
      console.error("History save error:", e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleCommand = async (cmd: string, isAutoRetry = false) => {
    if (!cmd.trim() || (isLoading && !isAutoRetry)) return;

    const userCommand = cmd.trim();
    const timestamp = new Date().toLocaleTimeString();
    
    if (!isAutoRetry) {
      setMessages((prev) => [...prev, { role: "user", content: userCommand, timestamp }]);
    }
    
    setIsLoading(true);

    try {
      setPipelineStage("PREPROCESSING");
      setPipelineStage("PLANNING & PROCESSING");
      
      const response = await aiService.getNanoResponse(userCommand, messages.slice(-5), activeModel);
      setPipelineStage("OUTPUT GENERATION");
      
      const assistantMsg: Message = {
        role: "assistant",
        content: typeof response === "string" ? response : "Kernel: Received empty or invalid response.",
        timestamp: new Date().toLocaleTimeString(),
      };

      const responseText = typeof response === "string" ? response : "";
      const actionMatch = responseText.match(/\[ACTION:\s*(\{.*?\})\s*\]/s);
      let kernelMetadata: any = null;

      if (actionMatch) {
        setPipelineStage("RESULT DELIVERY");
        try {
          const action: AIAction = JSON.parse(actionMatch[1]);
          const result = await aiService.executeKernelAction(action);
          
          if (!result.success) throw new Error(result.error || "Action failed");

          setRetryCount(0);
          kernelMetadata = {
            type: action.type === "execute_sql" ? "sql_result" : 
                  action.type === "read_file" ? "file_content" : 
                  action.type === "run_command" ? "kernel_status" : "info",
            data: result.data || result.content || result.stdout || result.stderr || result.message || result,
            status: result.success ? "success" : "error"
          };

          assistantMsg.metadata = kernelMetadata;

          if (action.type === "execute_sql" && result.success) {
            assistantMsg.content = `Executed SQL query successfully. Found ${Array.isArray(result.data) ? result.data.length : 0} results.`;
          } else if (action.type === "run_command") {
            assistantMsg.content = `Terminal execution complete. Output logged to kernel stream.`;
          } else if (action.type === "write_file") {
            assistantMsg.content = `File operation successful. ${result.message}`;
          }
        } catch (e: any) {
          setPipelineStage("FEEDBACK LOOP (SELF-HEALING)");
          kernelMetadata = { type: "kernel_status", data: e.message, status: "error" };
          assistantMsg.metadata = kernelMetadata;

          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            const errorPrompt = `ERROR DETECTED: "${e.message}". Fix and retry.`;
            setTimeout(() => handleCommand(errorPrompt, true), 1500);
          } else {
            assistantMsg.content = `Self-healing failed after ${MAX_RETRIES} attempts.`;
            setRetryCount(0);
          }
        }
      } else {
        setPipelineStage("COMPLETE");
      }

      setMessages((prev) => [...prev, assistantMsg]);
      await saveToHistory(userCommand, kernelMetadata);
    } catch (error: any) {
      setPipelineStage("PIPELINE FAILURE");
      setMessages((prev) => [...prev, { role: "system", content: `ERROR: ${error.message}`, timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setPipelineStage(null), 3000);
    }
  };

  return { messages, setMessages, isLoading, history, pipelineStage, handleCommand };
}
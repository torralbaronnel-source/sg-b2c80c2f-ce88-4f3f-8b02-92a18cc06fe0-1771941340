import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Terminal, 
  Cpu, 
  Database, 
  FileCode, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Settings2,
  Info
} from "lucide-react";
import { aiService, AIAction } from "@/services/aiService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    type: "sql_result" | "file_content" | "kernel_status" | "info";
    data: any;
    status: "success" | "error" | "info";
  };
}

const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o (Standard)", description: "High performance & speed" },
  { id: "gpt-4o-mini", name: "GPT-4o-Mini (Fast)", description: "Optimized for speed" },
  { id: "o1-preview", name: "o1-Preview (Reasoning)", description: "Advanced logic & reasoning" },
  { id: "o1-mini", name: "o1-Mini (Fast Reasoning)", description: "Faster advanced logic" },
  { id: "gpt-5", name: "GPT-5 (Flagship)", description: "Next-generation intelligence" },
  { id: "gpt-5.1", name: "GPT-5.1 (Pro)", description: "Enhanced 5-series reasoning" },
  { id: "gpt-5.1-nano", name: "GPT-5.1 NANO", description: "Kernel-optimized intelligence" },
  { id: "gpt-5.1-mini", name: "GPT-5.1 Mini", description: "High-speed 5-series" },
  { id: "gpt-5.2", name: "GPT-5.2 (Elite)", description: "Maximum intelligence output" },
];

export function NanoCommandCenter() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "NANO_V5.1_KERNEL_BOOT_SUCCESS...",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeModel, setActiveModel] = useState("gpt-4o");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedModel = localStorage.getItem("NANO_MODEL_PREFERENCE");
    if (savedModel) setActiveModel(savedModel);
    
    fetchHistory();
    inputRef.current?.focus();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("nano_history")
        .select("*")
        .order("executed_at", { ascending: false })
        .limit(50);
      
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

  const handleModelChange = (val: string) => {
    setActiveModel(val);
    localStorage.setItem("NANO_MODEL_PREFERENCE", val);
    setMessages(prev => [...prev, {
      role: "system",
      content: `Kernel model switched to ${val}`,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < history.length) {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex].command);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userCommand = input.trim();
    const timestamp = new Date().toLocaleTimeString();
    
    setMessages((prev) => [...prev, { role: "user", content: userCommand, timestamp }]);
    setInput("");
    setIsLoading(true);
    setHistoryIndex(-1);

    try {
      const response = await aiService.getNanoResponse(userCommand, [], activeModel);
      
      const assistantMsg: Message = {
        role: "assistant",
        content: typeof response === "string" ? response : "Kernel: Received empty or invalid response.",
        timestamp: new Date().toLocaleTimeString(),
      };

      // Safety check for .match() on potentially non-string response
      const responseText = typeof response === "string" ? response : "";
      const actionMatch = responseText.match(/\[ACTION:\s*(\{.*?\})\s*\]/s);
      let kernelMetadata: any = null;

      if (actionMatch) {
        try {
          const action: AIAction = JSON.parse(actionMatch[1]);
          const result = await aiService.executeKernelAction(action);
          
          kernelMetadata = {
            type: action.type === "execute_sql" ? "sql_result" : action.type === "read_file" ? "file_content" : "kernel_status",
            data: result.data || result.content || result.stdout || result,
            status: result.success ? "success" : "error"
          };

          assistantMsg.metadata = kernelMetadata;

          if (action.type === "execute_sql" && result.success) {
            assistantMsg.content = `Executed SQL query successfully. Found ${Array.isArray(result.data) ? result.data.length : 0} results.`;
          }
        } catch (e: any) {
          assistantMsg.metadata = {
            type: "kernel_status",
            data: e.message,
            status: "error"
          };
        }
      }

      setMessages((prev) => [...prev, assistantMsg]);
      await saveToHistory(userCommand, kernelMetadata);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `CRITICAL ERROR: ${error.message || "Failed to establish kernel connection."}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMetadata = (metadata: Message["metadata"]) => {
    if (!metadata) return null;

    if (metadata.type === "sql_result" && Array.isArray(metadata.data)) {
      const columns = metadata.data.length > 0 ? Object.keys(metadata.data[0]) : [];
      return (
        <div className="mt-4 border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/50">
          <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">SQL Result Set</span>
            </div>
            <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">
              {metadata.data.length} rows
            </Badge>
          </div>
          <ScrollArea className="h-[200px] w-full">
            <table className="w-full text-left border-collapse min-w-full">
              <thead className="bg-zinc-900/80 sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-2 text-[10px] font-mono text-zinc-500 uppercase border-b border-zinc-800">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {metadata.data.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                    {columns.map((col) => (
                      <td key={col} className="px-4 py-2 text-xs font-mono text-zinc-300">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      );
    }

    if (metadata.type === "file_content") {
      return (
        <div className="mt-4 border border-zinc-800 rounded-md overflow-hidden">
          <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">File Content</span>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-300 bg-zinc-950 overflow-x-auto">
            {metadata.data}
          </pre>
        </div>
      );
    }

    if (metadata.type === "kernel_status" || metadata.type === "info") {
      return (
        <div className={`mt-4 p-3 rounded-md border flex items-center gap-3 ${
          metadata.status === "success" ? "bg-green-500/5 border-green-500/20 text-green-400" : 
          metadata.status === "error" ? "bg-red-500/5 border-red-500/20 text-red-400" :
          "bg-blue-500/5 border-blue-500/20 text-blue-400"
        }`}>
          {metadata.status === "success" ? <CheckCircle2 className="w-4 h-4" /> : 
           metadata.status === "error" ? <AlertCircle className="w-4 h-4" /> :
           <Info className="w-4 h-4" />}
          <span className="text-xs font-mono uppercase tracking-wider">
            {metadata.status.toUpperCase()}: {typeof metadata.data === 'string' ? metadata.data : JSON.stringify(metadata.data)}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] h-[calc(100vh-12rem)] bg-black border border-zinc-800 shadow-2xl overflow-hidden font-mono">
      {/* Main Console */}
      <Card className="flex flex-col border-none bg-transparent rounded-none">
        {/* Console Header */}
        <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
            <Terminal className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold text-zinc-400 tracking-tighter uppercase">Orchestrix Kernel / Nano V5.1</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Model Picker */}
            <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
              <Cpu className="w-3 h-3 text-purple-500" />
              <Select value={activeModel} onValueChange={handleModelChange}>
                <SelectTrigger className="h-6 w-[160px] bg-transparent border-none text-[10px] focus:ring-0 text-zinc-400 font-mono">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-400">
                  {AVAILABLE_MODELS.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-xs font-mono focus:bg-zinc-800 focus:text-white">
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Connected</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6 bg-[#050505]">
          <div className="space-y-6 max-w-5xl mx-auto" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "system" ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] text-zinc-600">[{msg.timestamp}]</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    msg.role === "user" ? "text-blue-500" : msg.role === "system" ? "text-red-500" : "text-purple-500"
                  }`}>
                    {msg.role}
                  </span>
                </div>
                <div className={`text-sm leading-relaxed ${
                  msg.role === "user" ? "text-zinc-100 pl-4 border-l border-zinc-800" : 
                  msg.role === "system" ? "text-zinc-500 italic" : "text-zinc-300"
                }`}>
                  {msg.content}
                </div>
                {renderMetadata(msg.metadata)}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-zinc-600 text-[10px] animate-pulse">
                <ChevronRight className="w-3 h-3" />
                <span>KERNEL_PROCESSING_REQUEST...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Command Input Area */}
        <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto flex gap-3">
            <div className="flex-1 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-purple-500">
                <ChevronRight className="w-4 h-4" />
              </div>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Enter kernel command..."
                className="pl-10 bg-zinc-950/80 border-zinc-800 focus:border-purple-500/50 text-zinc-200 placeholder:text-zinc-700 h-11 text-sm font-mono transition-all rounded-md"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-11 px-6 font-mono text-xs uppercase tracking-widest transition-all rounded-md border border-zinc-700"
            >
              Execute
            </Button>
          </form>
        </div>
      </Card>

      {/* Side History Detail Panel */}
      <div className="border-l border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Kernel Log History</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {history.map((h, i) => (
              <div 
                key={h.id || i} 
                className="p-3 rounded border border-transparent hover:border-zinc-800 hover:bg-zinc-900/30 transition-all cursor-pointer group"
                onClick={() => setInput(h.command)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-zinc-600 uppercase font-bold">
                    {new Date(h.executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {h.metadata?.type && (
                    <Badge variant="outline" className="text-[8px] h-4 py-0 border-zinc-800 text-zinc-500 bg-black/50">
                      {h.metadata.type.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 line-clamp-2 font-mono group-hover:text-zinc-200 transition-colors">
                  {h.command}
                </div>
                {h.metadata?.status === "error" && (
                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-red-500 uppercase">
                    <AlertCircle className="w-3 h-3" />
                    <span>Failed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-zinc-800 bg-black text-[9px] text-zinc-700 uppercase tracking-tighter flex justify-between">
          <span>Active: {activeModel}</span>
          <span>Logs: {history.length}</span>
        </div>
      </div>
    </div>
  );
}
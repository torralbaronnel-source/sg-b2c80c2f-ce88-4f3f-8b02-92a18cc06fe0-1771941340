import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Terminal, Send, History, ArrowUp, ArrowDown, Clock, 
  Database, FileCode, CheckCircle2, XCircle, Info, ChevronRight,
  Maximize2, Minimize2
} from "lucide-react";
import { aiService, AIAction } from "@/services/aiService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    type?: "sql_result" | "file_content" | "kernel_status" | "json";
    data?: any;
    status?: "success" | "error" | "info";
  };
}

export function NanoCommandCenter() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "NANO_V5.1_KERNEL_BOOT_SUCCESS...",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history from Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("nano_history")
        .select("command")
        .order("executed_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setHistory(data.map(h => h.command));
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveToHistory = async (command: string) => {
    if (!user || !command.trim()) return;
    setHistory(prev => [command, ...prev.filter(c => c !== command)].slice(0, 50));
    setHistoryIndex(-1);
    await supabase.from("nano_history").insert({
      user_id: user.id,
      command: command.trim()
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

  const renderStructuredData = (msg: Message) => {
    if (!msg.metadata) return <p className="mt-1 whitespace-pre-wrap leading-relaxed">{msg.content}</p>;

    const { type, data, status } = msg.metadata;

    switch (type) {
      case "sql_result":
        if (!Array.isArray(data) || data.length === 0) return <p className="text-zinc-500 italic">No records returned.</p>;
        const headers = Object.keys(data[0]);
        return (
          <div className="mt-2 border border-zinc-800 rounded-md overflow-hidden bg-zinc-950">
            <div className="bg-zinc-900 px-3 py-1 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Database className="w-3 h-3" /> SQL_QUERY_RESULT ({data.length} rows)
              </span>
            </div>
            <ScrollArea className="max-h-64">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    {headers.map(h => (
                      <TableHead key={h} className="text-zinc-500 font-mono text-[10px] uppercase h-8">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 100).map((row, i) => (
                    <TableRow key={i} className="border-zinc-900 hover:bg-zinc-900/50">
                      {headers.map(h => (
                        <TableCell key={h} className="text-zinc-300 font-mono text-[11px] py-1">
                          {String(row[h])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        );

      case "file_content":
        return (
          <div className="mt-2 border border-zinc-800 rounded-md overflow-hidden bg-zinc-950">
            <div className="bg-zinc-900 px-3 py-1 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <FileCode className="w-3 h-3" /> FILE_CONTENT
              </span>
            </div>
            <pre className="p-3 text-[11px] text-zinc-300 font-mono overflow-x-auto">
              <code>{String(data)}</code>
            </pre>
          </div>
        );

      case "kernel_status":
        return (
          <div className={cn(
            "mt-2 p-3 rounded-md border flex items-center gap-3",
            status === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            {status === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">{status === "success" ? "Execution Successful" : "Execution Failed"}</p>
              <p className="text-[11px] opacity-80">{msg.content}</p>
            </div>
          </div>
        );

      default:
        return <p className="mt-1 whitespace-pre-wrap leading-relaxed">{msg.content}</p>;
    }
  };

  const handleSendCommand = async () => {
    if (!inputValue.trim() || isLoading) return;

    const command = inputValue.trim();
    const userMessage: Message = {
      role: "user",
      content: command,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    await saveToHistory(command);

    try {
      const response = await aiService.nanoCommand(command);
      const actionMatch = response.match(/\[ACTION: (.*?)\]/);
      
      let assistantMsg: Message = {
        role: "assistant",
        content: response.replace(/\[ACTION: .*?\]/, "").trim(),
        timestamp: new Date().toLocaleTimeString(),
      };

      if (actionMatch) {
        try {
          const action: AIAction = JSON.parse(actionMatch[1]);
          const result = await aiService.executeKernelAction(action);
          
          assistantMsg.metadata = {
            type: action.type === "execute_sql" ? "sql_result" : action.type === "read_file" ? "file_content" : "kernel_status",
            data: result.data || result.content || result,
            status: result.success ? "success" : "error"
          };

          if (action.type === "execute_sql" && result.success) {
            assistantMsg.content = `Executed SQL query successfully. Found ${Array.isArray(result.data) ? result.data.length : 0} results.`;
          } else if (action.type === "read_file" && result.success) {
            assistantMsg.content = `Reading file content...`;
          }
          
        } catch (e: any) {
          assistantMsg.metadata = {
            type: "kernel_status",
            status: "error"
          };
          assistantMsg.content = `KERNEL_EXECUTION_FAILURE: ${e.message}`;
        }
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      setMessages((prev) => [...prev, {
        role: "system",
        content: `CRITICAL ERROR: ${error.message || "Failed to communicate with NANO brain."}`,
        timestamp: new Date().toLocaleTimeString(),
        metadata: { type: "kernel_status", status: "error" }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black border-zinc-800 text-green-500 font-mono shadow-2xl h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
      <div className="bg-zinc-900/50 p-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest text-zinc-400">NANO_V5.1_KERNEL_STABLE</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-500 py-0 h-4">ROOT_ACCESS: ENABLED</Badge>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <div ref={scrollRef} className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className="group">
              <div className="flex items-center gap-2 mb-1">
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-wider",
                  msg.role === "user" ? "text-blue-400" : msg.role === "system" ? "text-red-500" : "text-green-500"
                )}>
                  {msg.role}
                </span>
                <span className="text-[9px] text-zinc-700 ml-auto">{msg.timestamp}</span>
              </div>
              <div className={cn(
                "pl-5",
                msg.role === "user" ? "text-zinc-100" : "text-zinc-300"
              )}>
                {renderStructuredData(msg)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="pl-5 flex items-center gap-2 text-green-400 animate-pulse">
              <div className="w-1 h-4 bg-green-500 animate-bounce" />
              <span className="text-xs uppercase tracking-tighter font-bold">Kernel processing request...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">{">"}</span>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                handleKeyDown(e);
                if (e.key === "Enter") handleSendCommand();
              }}
              placeholder="System prompt / Root command..."
              className="bg-black border-zinc-800 text-green-400 pl-8 focus-visible:ring-green-900/50 text-xs h-10 placeholder:text-zinc-700"
              autoFocus
            />
          </div>
          <Button 
            onClick={handleSendCommand} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-black font-bold h-10 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-4 text-[10px] text-zinc-500 uppercase tracking-tighter">
            <span className="flex items-center gap-1"><History className="w-3 h-3" /> session history active</span>
            <span className="flex items-center gap-1 font-bold text-zinc-400"><Info className="w-3 h-3" /> structured output engine v1.0</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
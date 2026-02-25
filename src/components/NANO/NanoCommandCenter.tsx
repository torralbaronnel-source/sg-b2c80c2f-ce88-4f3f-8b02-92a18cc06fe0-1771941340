import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Cpu, ChevronRight } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useNanoKernel } from "./modules/useNanoKernel";
import { NanoMetadataRenderer } from "./modules/NanoMetadataRenderer";
import { NanoSidebar } from "./modules/NanoSidebar";

const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o (Standard)" },
  { id: "gpt-4o-mini", name: "GPT-4o-Mini (Fast)" },
  { id: "o1-preview", name: "o1-Preview (Reasoning)" },
  { id: "o1-mini", name: "o1-Mini (Fast Reasoning)" },
];

export function NanoCommandCenter() {
  const [activeModel, setActiveModel] = useState("gpt-4o");
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, setMessages, isLoading, history, pipelineStage, handleCommand } = useNanoKernel(activeModel);

  useEffect(() => {
    const savedModel = localStorage.getItem("NANO_MODEL_PREFERENCE");
    if (savedModel) setActiveModel(savedModel);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading, pipelineStage]);

  const handleModelChange = (val: string) => {
    setActiveModel(val);
    localStorage.setItem("NANO_MODEL_PREFERENCE", val);
    setMessages(prev => [...prev, {
      role: "system",
      content: `Kernel model switched to ${val}`,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] h-[calc(100vh-4rem)] w-full bg-black/95 text-green-500 font-mono overflow-hidden">
      {/* Main Terminal Area */}
      <div className="flex flex-col h-full border-r border-green-900/30 overflow-hidden">
        <Card className="flex flex-col border-none bg-transparent rounded-none">
          <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <Terminal className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-400 tracking-tighter uppercase">Orchestrix Kernel / Nano V5.2</span>
              {pipelineStage && (
                <Badge variant="outline" className="ml-4 h-5 text-[9px] bg-blue-500/10 border-blue-500/50 text-blue-400 animate-pulse">
                  PIPELINE: {pipelineStage}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                <Cpu className="w-3 h-3 text-purple-500" />
                <Select value={activeModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="h-6 w-[160px] bg-transparent border-none text-[10px] focus:ring-0 text-zinc-400 font-mono">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-400">
                    {AVAILABLE_MODELS.map(m => (
                      <SelectItem key={m.id} value={m.id} className="text-xs font-mono focus:bg-zinc-800 focus:text-white">{m.name}</SelectItem>
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

          <ScrollArea className="flex-1 p-6 bg-[#050505]" ref={scrollRef}>
            <div className="space-y-6 max-w-5xl mx-auto">
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
                  <NanoMetadataRenderer metadata={msg.metadata} />
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
                  disabled={isLoading}
                  placeholder="Enter kernel command..."
                  className="pl-10 bg-zinc-950/80 border-zinc-800 focus:border-purple-500/50 text-zinc-200 placeholder:text-zinc-700 h-11 text-sm font-mono rounded-md"
                />
              </div>
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-11 px-6 font-mono text-xs uppercase tracking-widest rounded-md border border-zinc-700">
                Execute
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <NanoSidebar 
        history={history} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        filterType={filterType} 
        setFilterType={setFilterType} 
        onSelectCommand={setInput}
        activeModel={activeModel}
      />
    </div>
  );
}
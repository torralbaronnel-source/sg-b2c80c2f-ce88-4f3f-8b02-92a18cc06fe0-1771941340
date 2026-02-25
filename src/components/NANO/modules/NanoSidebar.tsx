import React from "react";
import { Clock, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  history: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  onSelectCommand: (cmd: string) => void;
  activeModel: string;
}

export function NanoSidebar({ history, searchQuery, setSearchQuery, filterType, setFilterType, onSelectCommand, activeModel }: SidebarProps) {
  const filteredHistory = history.filter(h => {
    const matchesSearch = h.command.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || h.metadata?.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="border-l border-zinc-800 bg-zinc-950 flex flex-col h-full">
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Kernel Log History</span>
        </div>
        <Badge variant="outline" className="text-[9px] border-zinc-800 text-zinc-500">{filteredHistory.length}</Badge>
      </div>

      <div className="p-2 border-b border-zinc-800 bg-black/40 space-y-2">
        <div className="relative group">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 group-focus-within:text-purple-500" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="h-8 pl-7 bg-zinc-950 border-zinc-800 text-[10px] font-mono focus:ring-0 placeholder:text-zinc-700"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'sql_result', 'file_content', 'kernel_status'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-tighter border transition-all whitespace-nowrap ${
                filterType === type ? "bg-purple-500/10 border-purple-500/50 text-purple-400" : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700"
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredHistory.length === 0 ? (
            <div className="p-4 text-center text-[10px] text-zinc-700 uppercase italic">No matching logs found</div>
          ) : (
            filteredHistory.map((h, i) => (
              <div 
                key={h.id || i} 
                className="p-3 rounded border border-transparent hover:border-zinc-800 hover:bg-zinc-900/30 transition-all cursor-pointer group"
                onClick={() => onSelectCommand(h.command)}
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
                <div className="text-[11px] text-zinc-400 line-clamp-2 font-mono group-hover:text-zinc-200 transition-colors">{h.command}</div>
                {h.metadata?.status === "error" && (
                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-red-500 uppercase">
                    <AlertCircle className="w-3 h-3" />
                    <span>Failed</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-zinc-800 bg-black text-[9px] text-zinc-700 uppercase tracking-tighter flex justify-between">
        <span>Active: {activeModel}</span>
        <span>Logs: {history.length}</span>
      </div>
    </div>
  );
}
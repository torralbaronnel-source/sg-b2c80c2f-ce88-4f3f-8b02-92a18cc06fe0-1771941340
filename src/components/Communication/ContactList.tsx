import React from "react";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ContactList() {
  return (
    <div className="w-80 border-r flex flex-col h-full bg-muted/10">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#6264a7]">Nodes</h2>
          <button className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search neural paths..." className="pl-9 h-9 text-xs bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-[#6264a7]/30" />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={cn(
              "p-4 flex items-center gap-3 cursor-pointer hover:bg-[#6264a7]/5 transition-all border-l-2 border-transparent",
              i === 1 && "bg-[#6264a7]/10 border-[#6264a7]"
            )}>
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-muted text-[10px] font-bold">U{i}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold truncate">Communication_Node_00{i}</span>
                  <span className="text-[9px] text-muted-foreground">12:4{i}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">Syncing neural logs for project Delta...</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
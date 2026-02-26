import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b px-6 flex items-center justify-between bg-background/50 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border shadow-sm">
            <AvatarFallback className="bg-[#6264a7] text-white text-[10px] font-bold">CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest">Communication_Node_001</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Synchronized</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-80">
        <div className="flex justify-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-muted/50 px-3 py-1 rounded-full text-muted-foreground">Encryption Active</span>
        </div>
        
        {[1, 2].map((i) => (
          <React.Fragment key={i}>
            <div className="flex items-end gap-3 max-w-[80%]">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-[8px] font-bold">C1</AvatarFallback>
              </Avatar>
              <div className="bg-muted/40 p-3 rounded-2xl rounded-bl-none border border-border/50">
                <p className="text-xs leading-relaxed">System update finalized. Neural paths for Node_00{i} are stable and ready for synchronization.</p>
                <span className="text-[9px] text-muted-foreground mt-2 block font-medium">14:2{i} PM</span>
              </div>
            </div>
            
            <div className="flex items-end gap-3 max-w-[80%] ml-auto flex-row-reverse">
              <div className="bg-[#6264a7] text-white p-3 rounded-2xl rounded-br-none shadow-lg shadow-[#6264a7]/20">
                <p className="text-xs leading-relaxed font-medium">Acknowledged. Proceed with sequence deployment on all clusters.</p>
                <span className="text-[9px] text-white/60 mt-2 block text-right font-medium">14:25 PM</span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background shrink-0">
        <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl border border-border/50">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#6264a7]"><Paperclip className="h-4 w-4" /></Button>
          <Input placeholder="Type a message..." className="flex-1 border-none bg-transparent h-9 text-xs focus-visible:ring-0 shadow-none" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-500"><Smile className="h-4 w-4" /></Button>
            <Button className="h-8 w-8 rounded-lg bg-[#6264a7] hover:bg-[#50528e] text-white p-0 shadow-lg shadow-[#6264a7]/20">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
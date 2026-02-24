import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreVertical, Send, Phone, Video } from "lucide-react";

export function WhatsAppManagerView() {
  const [activeChat, setActiveChat] = useState("1");

  return (
    <div className="grid grid-cols-12 h-[calc(100vh-12rem)] gap-4">
      {/* Sidebar - Contacts */}
      <Card className="col-span-4 h-full flex flex-col">
        <CardHeader className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Communications</h2>
            <Button variant="ghost" size="icon"><Filter className="w-4 h-4" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search chats..." 
              className="w-full bg-muted rounded-md py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                onClick={() => setActiveChat(i.toString())}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${activeChat === i.toString() ? 'bg-accent' : 'hover:bg-accent/50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium text-sm truncate">Client Name {i}</h4>
                    <span className="text-[10px] text-muted-foreground">10:45 AM</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">Latest message from the client regarding...</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="col-span-8 h-full flex flex-col">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div>
              <h3 className="font-bold text-sm">Maria Clara (Bride)</h3>
              <p className="text-[10px] text-green-500 font-medium">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-4 bg-muted/20">
          <div className="space-y-4">
            <div className="flex justify-start">
              <div className="bg-card p-3 rounded-lg rounded-tl-none max-w-[70%] border shadow-sm">
                <p className="text-sm">Hi! Can we confirm the florist delivery time for tomorrow?</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">10:30 AM</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[70%] shadow-sm">
                <p className="text-sm">Of course! They are scheduled for 9:00 AM at the venue.</p>
                <span className="text-[10px] opacity-70 mt-1 block">10:32 AM</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t flex items-center gap-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button size="icon" className="bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Clock, User, CheckCircle2 } from "lucide-react";

interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  status: "pending" | "responded" | "urgent";
  type: "Client" | "Vendor";
}

const chats: ChatPreview[] = [
  { id: "1", name: "Maria Clara (Bride)", lastMessage: "Can we move the call to 3 PM?", time: "2m ago", status: "urgent", type: "Client" },
  { id: "2", name: "Green Gardens Catering", lastMessage: "Menu options confirmed.", time: "15m ago", status: "responded", type: "Vendor" },
  { id: "3", name: "Juan Dela Cruz (Groom)", lastMessage: "Sent the guest list draft.", time: "1h ago", status: "pending", type: "Client" },
];

export function WhatsAppTabletView() {
  return (
    <Card className="h-full border-none shadow-none bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            Quick Chat
          </CardTitle>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Live</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {chats.map((chat) => (
              <div key={chat.id} className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {chat.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-none">{chat.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{chat.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-2 group-hover:text-foreground">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <Badge 
                    variant={chat.status === "urgent" ? "destructive" : chat.status === "pending" ? "secondary" : "outline"}
                    className="text-[10px] py-0 h-5"
                  >
                    {chat.status}
                  </Badge>
                  {chat.status === "responded" && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
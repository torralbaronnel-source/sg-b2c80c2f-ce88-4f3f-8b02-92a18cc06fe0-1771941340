import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreVertical, Send, Phone, Video, Loader2 } from "lucide-react";
import { whatsappService, Communication } from "@/services/whatsappService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function WhatsAppManagerView() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadChats = async () => {
    const data = await whatsappService.getChats();
    setChats(data);
    if (data.length > 0 && !activeChatId) {
      setActiveChatId(data[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const selectedChat = chats.find(c => c.id === activeChatId);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !selectedChat) return;

    setSending(true);
    const result = await whatsappService.sendMessage(
      selectedChat.contact_name,
      message,
      user.id,
      selectedChat.platform
    );

    if (result.success) {
      setMessage("");
      loadChats(); // Refresh to show new last message
      toast({
        title: "Message sent",
        description: `Your message to ${selectedChat.contact_name} has been sent.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
    setSending(false);
  };

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
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading chats...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No active communications found.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={loadChats}>
                  Refresh
                </Button>
              </div>
            ) : chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {chat.contact_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium text-sm truncate">{chat.contact_name}</h4>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.last_message || "No messages yet"}</p>
                </div>
                {chat.unread_count > 0 && (
                  <Badge className="bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
                    {chat.unread_count}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="col-span-8 h-full flex flex-col">
        {selectedChat ? (
          <>
            <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {selectedChat.contact_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{selectedChat.contact_name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-green-500 font-medium">Online</p>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <p className="text-[10px] text-muted-foreground">{selectedChat.contact_type}</p>
                  </div>
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
                {/* Historical messages would be mapped here */}
                <div className="flex justify-start">
                  <div className="bg-card p-3 rounded-lg rounded-tl-none max-w-[70%] border shadow-sm">
                    <p className="text-sm">{selectedChat.last_message}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      {new Date(selectedChat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t flex items-center gap-2">
              <Input 
                placeholder="Type a message..." 
                className="flex-1" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                size="icon" 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Send className="w-12 h-12 opacity-10" />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  );
}
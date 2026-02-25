import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MessageSquare, 
  Users, 
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  LayoutGrid,
  Files,
  Pin,
  CheckCheck,
  Plus,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { communicationService, Communication, CommunicationMessage } from "@/services/communicationService";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export function CommunicationDashboardView() {
  const { profile } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = communications.find(c => c.id === selectedChatId);

  // Load communications
  useEffect(() => {
    loadCommunications();
  }, [profile?.current_server_id]);

  // Real-time communications listener
  useEffect(() => {
    if (!profile?.current_server_id) return;
    const channel = communicationService.subscribeToCommunications(
      profile.current_server_id,
      loadCommunications
    );
    return () => { channel.unsubscribe(); };
  }, [profile?.current_server_id]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
      const channel = communicationService.subscribeToMessages(selectedChatId, (msg) => {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });
      return () => { channel.unsubscribe(); };
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadCommunications = async () => {
    try {
      const data = await communicationService.getCommunications();
      setCommunications(data);
      if (data.length > 0 && !selectedChatId) {
        setSelectedChatId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading communications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (id: string) => {
    try {
      const data = await communicationService.getMessages(id);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedChatId || isSending) return;

    setIsSending(true);
    try {
      await communicationService.sendMessage(
        selectedChatId,
        newMessage.trim(),
        profile?.full_name || "Coordinator"
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-slate-50/50 rounded-xl overflow-hidden border border-slate-200">
      {/* Activity Bar */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4 shrink-0">
        {[
          { id: "chat", icon: MessageSquare, label: "Chat" },
          { id: "teams", icon: Users, label: "Teams" },
          { id: "files", icon: Files, label: "Files" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "p-2 rounded-xl transition-all relative group",
              activeTab === item.id ? "text-white bg-white/10" : "text-slate-400 hover:text-white"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
          </button>
        ))}
      </div>

      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Chat</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search messages" className="pl-9 h-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-2 space-y-0.5">
            {communications.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left relative",
                  selectedChatId === chat.id 
                    ? "bg-slate-100" 
                    : "hover:bg-slate-50"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-xs">
                    {chat.contact_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-sm text-slate-900 truncate">{chat.contact_name}</span>
                    <span className="text-[10px] text-slate-400">
                      {chat.updated_at ? format(new Date(chat.updated_at), 'p') : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{chat.last_message || "No messages yet"}</p>
                </div>
                {chat.unread_count && chat.unread_count > 0 ? (
                  <Badge className="bg-rose-500 text-white h-5 min-w-[20px] rounded-full flex items-center justify-center p-0 px-1 text-[10px] border-none">
                    {chat.unread_count}
                  </Badge>
                ) : null}
              </button>
            ))}
            {communications.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active conversations
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        {selectedChatId ? (
          <>
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">
                    {activeChat?.contact_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 truncate">{activeChat?.contact_name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {activeChat?.contact_type || 'Contact'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-slate-500"><Video className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-slate-500"><Phone className="w-5 h-5" /></Button>
                <div className="w-px h-6 bg-slate-100 mx-2" />
                <Button variant="ghost" size="icon" className="text-slate-500"><Info className="w-5 h-5" /></Button>
              </div>
            </div>

            <ScrollArea className="flex-1 bg-[#F5F5F5] p-6" viewportRef={scrollRef}>
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, idx) => {
                  const showDate = idx === 0 || 
                    format(new Date(msg.timestamp || ''), 'yyyy-MM-dd') !== 
                    format(new Date(messages[idx-1].timestamp || ''), 'yyyy-MM-dd');

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="flex flex-col items-center py-4">
                          <span className="px-4 py-1 bg-white rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm border border-slate-100">
                            {format(new Date(msg.timestamp || ''), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}
                      <div className={cn("flex gap-3", msg.is_from_me ? "justify-end" : "justify-start")}>
                        {!msg.is_from_me && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-[10px]">
                              {msg.sender_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={cn("space-y-1 max-w-[70%]", msg.is_from_me ? "items-end flex flex-col" : "")}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{msg.sender_name}</span>
                            <span className="text-[10px] text-slate-400">
                              {format(new Date(msg.timestamp || ''), 'p')}
                            </span>
                          </div>
                          <div className={cn(
                            "p-3 rounded-lg shadow-sm text-sm text-slate-700 border",
                            msg.is_from_me 
                              ? "bg-[#E7EFFF] rounded-tr-none border-[#D1E0FF]" 
                              : "bg-white rounded-tl-none border-slate-200"
                          )}>
                            {msg.content}
                          </div>
                          {msg.is_from_me && (
                            <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                              <CheckCheck className="w-3 h-3" /> Seen
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 py-20">
                    <MessageSquare className="w-12 h-12 opacity-20" />
                    <p className="text-sm">No messages in this conversation yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                <div className="flex flex-col bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <div className="flex items-center px-2 py-1 border-b border-slate-50 gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><LayoutGrid className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><Paperclip className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-500"><Smile className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500"><Pin className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex items-end p-2 gap-2">
                    <textarea 
                      placeholder="Type a message" 
                      className="flex-1 min-h-[40px] max-h-32 bg-transparent border-none focus:ring-0 text-sm resize-none p-2 outline-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="h-10 w-10 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center p-0 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                      {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-slate-50/30">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center">
              <MessageSquare className="w-12 h-12 text-slate-200" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-black text-slate-900">Stay Connected</h3>
              <p className="text-slate-500">Select a conversation from the sidebar to start coordinating with your team and vendors.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
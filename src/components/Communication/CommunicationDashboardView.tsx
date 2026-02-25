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
  Loader2,
  Hash,
  AtSign,
  ChevronDown,
  MoreVertical,
  Reply,
  Heart,
  ThumbsUp,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { communicationService, Communication, CommunicationMessage } from "@/services/communicationService";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function CommunicationDashboardView() {
  const { profile } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [replyingTo, setReplyingTo] = useState<CommunicationMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = communications.find(c => c.id === selectedChatId);

  useEffect(() => {
    loadCommunications();
  }, [profile?.current_server_id]);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    }
  }, [selectedChatId]);

  const loadCommunications = async () => {
    try {
      const data = await communicationService.getCommunications();
      setCommunications(data);
      if (data.length > 0 && !selectedChatId) {
        setSelectedChatId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (id: string) => {
    try {
      const data = await communicationService.getMessages(id);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedChatId || isSending) return;

    setIsSending(true);
    try {
      await communicationService.sendMessage({
        communicationId: selectedChatId,
        content: newMessage.trim(),
        senderName: profile?.full_name || "Coordinator",
        replyToId: replyingTo?.id
      });
      setNewMessage("");
      setReplyingTo(null);
      loadMessages(selectedChatId);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const channels = communications.filter(c => c.type === 'channel');
  const dms = communications.filter(c => c.type === 'direct');

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="h-[calc(100vh-120px)] flex bg-[#f3f2f1] rounded-xl overflow-hidden border border-slate-200 shadow-sm font-sans">
      {/* Teams-style Activity Bar */}
      <div className="w-16 bg-[#201f1e] flex flex-col items-center py-4 gap-4 shrink-0">
        {[
          { id: "activity", icon: Clock, label: "Activity" },
          { id: "chat", icon: MessageSquare, label: "Chat" },
          { id: "teams", icon: Users, label: "Teams" },
          { id: "files", icon: Files, label: "Files" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 w-full py-2 transition-all group relative",
              activeTab === item.id ? "text-white" : "text-[#a19f9d] hover:text-white"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] scale-90 font-medium">{item.label}</span>
            {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6264a7] rounded-r-full" />}
          </button>
        ))}
      </div>

      {/* Teams Navigation Sidebar */}
      <div className="w-72 bg-[#f0f0f0] flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#242424]">Chat</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644] hover:bg-slate-200">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            {/* Pinned / Recent Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-1 group cursor-pointer">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#605e5c] uppercase tracking-wider">
                  <ChevronDown className="w-3 h-3" /> Pinned
                </div>
              </div>
              {channels.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded hover:bg-[#edebe9] transition-all text-left group",
                    selectedChatId === chat.id ? "bg-white shadow-sm ring-1 ring-slate-200" : ""
                  )}
                >
                  <div className="w-8 h-8 rounded bg-[#6264a7] flex items-center justify-center text-white shrink-0">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#242424] truncate">{chat.contact_name}</div>
                    <div className="text-[10px] text-[#605e5c] truncate">{chat.last_message || "Start of channel"}</div>
                  </div>
                  {chat.unread_count && (
                    <div className="w-4 h-4 rounded-full bg-[#c4314b] text-white text-[9px] flex items-center justify-center font-bold">
                      {chat.unread_count}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-1 group cursor-pointer">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#605e5c] uppercase tracking-wider">
                  <ChevronDown className="w-3 h-3" /> Recent
                </div>
              </div>
              {dms.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded hover:bg-[#edebe9] transition-all text-left",
                    selectedChatId === chat.id ? "bg-white shadow-sm ring-1 ring-slate-200" : ""
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#edebe9] text-[#605e5c] text-xs font-bold">
                        {chat.contact_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#92c353] border-2 border-[#f0f0f0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#242424] truncate">{chat.contact_name}</div>
                    <div className="text-[10px] text-[#605e5c] truncate">{chat.last_message}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Canvas */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChatId ? (
          <>
            {/* Header */}
            <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {activeChat?.type === 'channel' ? <Hash className="w-5 h-5 text-[#6264a7]" /> : null}
                  <h3 className="font-bold text-[#242424]">{activeChat?.contact_name}</h3>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex gap-4 text-xs font-semibold text-[#605e5c]">
                  <button className="text-[#6264a7] border-b-2 border-[#6264a7] pb-4 mt-4">Chat</button>
                  <button className="hover:text-[#242424] pb-4 mt-4">Files</button>
                  <button className="hover:text-[#242424] pb-4 mt-4">Notes</button>
                  <button className="hover:text-[#242424] pb-4 mt-4 text-primary"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644]"><Video className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644]"><Phone className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644]"><Users className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 bg-white" viewportRef={scrollRef}>
              <div className="p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={msg.id} className="group flex gap-3 hover:bg-[#f3f2f1] -mx-4 px-4 py-2 transition-colors relative">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-slate-200 text-slate-600 text-[10px] font-bold">
                        {msg.sender_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-[#242424]">{msg.sender_name}</span>
                        <span className="text-[10px] text-[#605e5c]">{format(new Date(msg.timestamp || ''), 'p')}</span>
                      </div>
                      
                      {/* Reply Context */}
                      {(msg as any).reply_to && (
                        <div className="border-l-2 border-[#6264a7] bg-slate-50 p-2 rounded-r mb-2 text-xs text-[#605e5c]">
                          <div className="font-bold text-[10px] text-[#6264a7]">{(msg as any).reply_to.sender_name}</div>
                          <div className="truncate">{(msg as any).reply_to.content}</div>
                        </div>
                      )}

                      <div className="text-sm text-[#242424] leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      
                      {/* Reactions */}
                      {msg.reactions && Object.keys(msg.reactions as object).length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {Object.entries(msg.reactions as Record<string, number>).map(([emoji, count]) => (
                            <Badge key={emoji} variant="outline" className="px-1.5 py-0.5 text-[10px] border-[#edebe9] bg-white gap-1 hover:border-[#6264a7] cursor-pointer">
                              <span>{emoji}</span>
                              <span className="font-bold">{count}</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Actions Hover Menu */}
                    <div className="absolute right-4 top-2 hidden group-hover:flex items-center bg-white shadow-sm border border-slate-200 rounded-md overflow-hidden">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" onClick={() => setReplyingTo(msg)}>
                        <Reply className="w-4 h-4 text-[#484644]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                        <Smile className="w-4 h-4 text-[#484644]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                        <Pin className="w-4 h-4 text-[#484644]" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Wrapper */}
            <div className="p-4 bg-white border-t border-slate-200">
              {replyingTo && (
                <div className="mb-2 bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Reply className="w-3 h-3 text-[#6264a7]" />
                    <span>Replying to <span className="font-bold">{replyingTo.sender_name}</span></span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setReplyingTo(null)}>
                    <Plus className="w-3 h-3 rotate-45" />
                  </Button>
                </div>
              )}
              <div className="border border-slate-300 rounded focus-within:ring-2 focus-within:ring-[#6264a7]/20 transition-all bg-white overflow-hidden">
                <div className="flex items-center px-1 py-1 border-b border-slate-100">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644] hover:text-[#6264a7]"><Paperclip className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644] hover:text-[#6264a7]"><Smile className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644] hover:text-[#6264a7]"><AtSign className="w-4 h-4" /></Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644] hover:text-[#6264a7]"><MoreVertical className="w-4 h-4" /></Button>
                </div>
                <div className="flex items-end p-2 gap-2">
                  <textarea 
                    placeholder={`Message ${activeChat?.contact_name}`} 
                    className="flex-1 min-h-[40px] max-h-32 bg-transparent border-none focus:ring-0 text-sm resize-none p-1 outline-none font-medium text-[#242424]"
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
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="h-8 w-8 bg-transparent hover:bg-slate-100 text-[#6264a7] p-0"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f3f2f1]">
             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
               <MessageSquare className="w-10 h-10 text-[#6264a7] opacity-20" />
             </div>
             <h3 className="text-xl font-bold text-[#242424]">Welcome to Communications</h3>
             <p className="text-[#605e5c] max-w-sm mt-2 text-sm">Select a channel or direct message to start coordinating with your team.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MessageSquare, 
  Users, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Bell, 
  Plus, 
  Filter, 
  Send, 
  MoreHorizontal, 
  Paperclip, 
  Smile, 
  AtSign, 
  Bold, 
  Italic, 
  Video, 
  Info, 
  ChevronLeft,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { communicationService, type Communication } from "@/services/communicationService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

type TabType = "Chat" | "Files" | "Tasks" | "AI Insights";
type ViewMode = "List" | "Chat";

export function CommunicationDashboardView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("Chat");
  const [selectedChat, setSelectedChat] = useState<Communication | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("List");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingServiceRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComms = async () => {
      setLoading(true);
      const { data, error } = await communicationService.getCommunications();
      if (!error && data) {
        setCommunications(data);
      }
      setLoading(false);
    };
    fetchComms();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        const { data, error } = await communicationService.getMessages(selectedChat.id);
        if (!error && data) {
          setMessages(data);
        }
      };
      
      fetchMessages();

      const unsubscribe = communicationService.subscribeToMessages(selectedChat.id, (payload: any) => {
        setMessages((prev) => {
          if (prev.find(m => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      });

      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat && user) {
      const userName = user.email?.split("@")[0] || "User";
      const service = communicationService.subscribeToTyping(selectedChat.id, userName, (users) => {
        setTypingUsers(users);
      });
      typingServiceRef.current = service;
      return () => {
        service.unsubscribe();
        typingServiceRef.current = null;
      };
    }
  }, [selectedChat, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  const handleTyping = () => {
    if (!typingServiceRef.current) return;
    typingServiceRef.current.setTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingServiceRef.current?.setTyping(false);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;
    
    const content = newMessage;
    const senderName = user.email?.split("@")[0] || "Me";
    setNewMessage("");

    const { error } = await communicationService.sendMessage({
      communicationId: selectedChat.id,
      senderName: senderName,
      content: content
    });

    if (error) {
      console.error("Failed to send message:", error);
    } else {
      typingServiceRef.current?.setTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const selectChat = (chat: Communication) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setViewMode("Chat");
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-xs md:text-sm">
      <div className={cn(
        "bg-[#201f1f] flex-col items-center py-4 space-y-4 transition-all duration-300 shrink-0",
        sidebarOpen ? "w-10 flex" : "w-0 hidden md:flex md:w-10"
      )}>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10">
          <Bell className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white bg-white/10">
          <MessageSquare className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10">
          <Users className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10">
          <Calendar className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10">
          <CheckSquare className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10">
          <FileText className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className={cn(
        "border-r flex flex-col transition-all duration-300 bg-[#f5f5f5] shrink-0",
        sidebarOpen ? "w-full md:w-56 lg:w-60" : "w-0 hidden md:flex md:w-56 lg:w-60",
        viewMode === "Chat" && "hidden md:flex"
      )}>
        <div className="p-2.5 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-sm md:text-base">Team Chats</h1>
          <div className="flex gap-0.5">
            <Button variant="ghost" size="icon" className="h-6 w-6"><Search className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3 w-3" /></Button>
          </div>
        </div>
        
        <div className="px-2.5 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-2.5 w-2.5 text-muted-foreground" />
            <Input 
              placeholder="Search or start a new chat" 
              className="pl-6 h-6 text-[10px] bg-white border-none shadow-sm focus-visible:ring-1"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 no-scrollbar overflow-y-auto">
          <div className="p-1 space-y-3">
            {loading ? (
              <div className="p-4 text-center opacity-50">
                <p className="text-[10px]">Loading chats...</p>
              </div>
            ) : communications.length === 0 ? (
              <div className="p-4 text-center opacity-50">
                <p className="text-[10px]">No active chats found.</p>
              </div>
            ) : (
              <div>
                <p className="px-2 pb-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">All Channels</p>
                {communications.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={cn(
                      "w-full flex items-center gap-2 p-1.5 rounded-md transition-colors text-left",
                      selectedChat?.id === chat.id ? "bg-white shadow-sm" : "hover:bg-white/50"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[9px] font-bold bg-muted">{chat.contact_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full border border-white bg-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-semibold text-[10px] truncate">{chat.contact_name}</p>
                        <p className="text-[8px] text-muted-foreground">
                          {chat.updated_at ? format(new Date(chat.updated_at), "HH:mm") : ""}
                        </p>
                      </div>
                      <p className="text-[9px] text-muted-foreground truncate leading-none mt-0.5">
                        {chat.last_message || "Active"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-white",
        viewMode === "List" && "hidden md:flex"
      )}>
        {selectedChat ? (
          <>
            <div className="h-10 border-b flex items-center justify-between px-2 md:px-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-7 w-7"
                  onClick={() => setViewMode("List")}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <div className="relative shrink-0">
                  <div className="h-6 w-6 md:h-7 md:w-7 rounded bg-[#6264a7] flex items-center justify-center text-white">
                    <span className="text-[10px] font-bold">{selectedChat.contact_name[0]}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-[10px] md:text-[11px] truncate leading-tight">{selectedChat.contact_name}</h2>
                  <div className="flex items-center gap-0.5">
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    <span className="text-[8px] text-muted-foreground">Available</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 md:gap-3 ml-2">
                <div className="hidden sm:flex items-center border-b">
                  {(["Chat", "Files", "Tasks", "AI Insights"] as TabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-2 py-2 text-[9px] font-medium transition-colors relative h-10 flex items-center",
                        activeTab === tab ? "text-[#6264a7]" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span>{tab}</span>
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6264a7]" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Video className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <Menu className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-[#f9f9f9]">
              <ScrollArea className="flex-1 no-scrollbar p-2 md:p-4" ref={scrollRef}>
                <div className="max-w-2xl mx-auto space-y-2">
                  {messages.map((msg, idx) => {
                    const isOwn = msg.is_from_me;
                    const showAvatar = idx === 0 || messages[idx - 1]?.is_from_me !== msg.is_from_me;
                    
                    return (
                      <div key={msg.id || idx} className={cn(
                        "flex gap-1.5 group",
                        isOwn ? "flex-row-reverse" : "flex-row"
                      )}>
                        {!isOwn && (
                          <div className="w-5 shrink-0 mt-auto">
                            {showAvatar && (
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[7px] bg-[#6264a7] text-white">
                                  {msg.sender_name?.[0] || selectedChat.contact_name[0]}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}
                        <div className={cn(
                          "max-w-[85%] md:max-w-[70%]",
                          isOwn ? "items-end text-right" : "items-start text-left"
                        )}>
                          <div className={cn(
                            "p-2 rounded-lg text-[10px] md:text-xs shadow-sm",
                            isOwn ? "bg-[#e8ebfa] text-[#242424] rounded-br-none" : "bg-white border rounded-bl-none"
                          )}>
                            <p className="leading-tight whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className="text-[7px] text-muted-foreground mt-0.5 px-0.5 uppercase">
                            {msg.timestamp ? format(new Date(msg.timestamp), "HH:mm") : "Sending..."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2">
                      <div className="flex gap-0.5 py-1">
                        <span className="h-1 w-1 bg-[#6264a7] rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-1 w-1 bg-[#6264a7] rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-1 w-1 bg-[#6264a7] rounded-full animate-bounce" />
                      </div>
                      <span className="text-[8px] text-muted-foreground italic">
                        {typingUsers[0]} is typing...
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-2 md:p-3 shrink-0">
                <div className="max-w-2xl mx-auto bg-white border rounded-md shadow-sm">
                  <div className="flex items-center gap-0.5 p-1 border-b">
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground"><Paperclip className="h-2.5 w-2.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground"><Smile className="h-2.5 w-2.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground"><AtSign className="h-2.5 w-2.5" /></Button>
                    <div className="h-3 w-[1px] bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground font-bold text-[9px]">B</Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground italic text-[9px]">I</Button>
                  </div>
                  <div className="flex items-end p-2 gap-2">
                    <textarea 
                      placeholder={`Message ${selectedChat.contact_name}`}
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-1 min-h-[24px] max-h-32 text-[10px] md:text-xs no-scrollbar outline-none"
                      rows={1}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      size="icon" 
                      disabled={!newMessage.trim()}
                      className="h-6 w-6 bg-[#6264a7] hover:bg-[#4b4d8a] text-white shrink-0 rounded-full"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#f5f5f5]">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-[#6264a7]" />
            </div>
            <h3 className="text-xs font-bold">Team Coordination</h3>
            <p className="text-[9px] text-muted-foreground max-w-[180px] mt-1.5 leading-relaxed">
              Select a channel to begin collaborating with your team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
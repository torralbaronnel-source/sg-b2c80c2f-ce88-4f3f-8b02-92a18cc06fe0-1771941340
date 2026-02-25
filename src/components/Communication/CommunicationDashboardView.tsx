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
import { communicationService } from "@/services/communicationService";
import { useAuth } from "@/contexts/AuthContext";

type TabType = "Chat" | "Files" | "Tasks" | "AI Insights";
type ViewMode = "List" | "Chat";

export function CommunicationDashboardView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("Chat");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("List");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: "1", name: "General Logistics", lastMsg: "Welcome to the logistics channel.", time: "2:34 PM", type: "Channel", unread: 0 },
    { id: "2", name: "Catering Coordination", lastMsg: "Menu has been finalized.", time: "Yesterday", type: "Channel", unread: 2 },
    { id: "3", name: "Sarah Tan (Catering)", lastMsg: "Looking forward to the tasting session.", time: "Monday", type: "DM", unread: 0, status: "online" },
    { id: "4", name: "Marc Cruz (Photo)", lastMsg: "Sent the shot list for review.", time: "Monday", type: "DM", unread: 0, status: "away" },
  ];

  useEffect(() => {
    if (selectedChat) {
      const unsubscribe = communicationService.subscribeToMessages(selectedChat.id, (payload: any) => {
        setMessages((prev) => [...prev, payload]);
      });
      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle auto-collapse and view mode on mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setViewMode("List"); // Always show list on desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;
    
    const { error } = await communicationService.sendMessage({
      communicationId: selectedChat.id,
      senderId: user.id,
      content: newMessage,
      platform: "WhatsApp"
    });

    if (!error) {
      setNewMessage("");
    }
  };

  const selectChat = (chat: any) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setViewMode("Chat");
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-xs md:text-sm">
      {/* Activity Bar - Dark Nav */}
      <div className={cn(
        "bg-[#201f1f] flex-col items-center py-4 space-y-4 transition-all duration-300 shrink-0",
        sidebarOpen ? "w-12 flex" : "w-0 hidden md:flex md:w-12"
      )}>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white bg-white/10">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
          <Users className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
          <Calendar className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
          <CheckSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat List Sidebar */}
      <div className={cn(
        "border-r flex flex-col transition-all duration-300 bg-[#f5f5f5] shrink-0",
        sidebarOpen ? "w-full md:w-56 lg:w-64" : "w-0 hidden md:flex md:w-56 lg:w-64",
        viewMode === "Chat" && "hidden md:flex"
      )}>
        <div className="p-3 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-base md:text-lg">Chat</h1>
          <div className="flex gap-0.5">
            <Button variant="ghost" size="icon" className="h-7 w-7"><Search className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7"><Plus className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
        
        <div className="px-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3 w-3 text-muted-foreground" />
            <Input 
              placeholder="Search chats" 
              className="pl-7 h-7 text-[10px] bg-white border-none shadow-sm focus-visible:ring-1"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 no-scrollbar overflow-y-auto">
          <div className="p-1.5 space-y-3">
            <div>
              <p className="px-2 pb-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Event Channels</p>
              {channels.filter(c => c.type === "Channel").map(channel => (
                <button
                  key={channel.id}
                  onClick={() => selectChat(channel)}
                  className={cn(
                    "w-full flex items-center gap-2 p-1.5 rounded-md transition-colors text-left group",
                    selectedChat?.id === channel.id ? "bg-white shadow-sm" : "hover:bg-white/50"
                  )}
                >
                  <div className="h-7 w-7 rounded bg-[#6264a7] flex items-center justify-center text-white shrink-0">
                    <span className="text-[10px] font-bold">#</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-[11px] truncate">{channel.name}</p>
                      <p className="text-[9px] text-muted-foreground">{channel.time}</p>
                    </div>
                    <p className="text-[9px] text-muted-foreground truncate leading-none mt-0.5">{channel.lastMsg}</p>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <p className="px-2 pb-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Recent Chats</p>
              {channels.filter(c => c.type === "DM").map(chat => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={cn(
                    "w-full flex items-center gap-2 p-1.5 rounded-md transition-colors text-left",
                    selectedChat?.id === chat.id ? "bg-white shadow-sm" : "hover:bg-white/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-[9px] font-bold bg-muted">{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {chat.status && (
                      <div className={cn(
                        "absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white",
                        chat.status === "online" ? "bg-green-500" : "bg-yellow-500"
                      )} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-[11px] truncate">{chat.name}</p>
                      <p className="text-[9px] text-muted-foreground">{chat.time}</p>
                    </div>
                    <p className="text-[9px] text-muted-foreground truncate leading-none mt-0.5">{chat.lastMsg}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Chat Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-white",
        viewMode === "List" && "hidden md:flex"
      )}>
        {selectedChat ? (
          <>
            {/* Header */}
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
                    <span className="text-[10px] font-bold">{selectedChat.type === "Channel" ? "#" : selectedChat.name[0]}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-[11px] md:text-xs truncate leading-tight">{selectedChat.name}</h2>
                  <div className="flex items-center gap-0.5">
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    <span className="text-[8px] text-muted-foreground">Active</span>
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
                        "px-2 py-2 text-[10px] font-medium transition-colors relative h-10 flex items-center",
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
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Video className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Info className="h-3.5 w-3.5" /></Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <Menu className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 no-scrollbar p-2 md:p-4" ref={scrollRef}>
                <div className="max-w-3xl mx-auto space-y-3">
                  {messages.map((msg, idx) => {
                    const isOwn = msg.is_from_me;
                    const showAvatar = idx === 0 || messages[idx - 1]?.is_from_me !== msg.is_from_me;
                    
                    return (
                      <div key={idx} className={cn(
                        "flex gap-1.5 group",
                        isOwn ? "flex-row-reverse" : "flex-row"
                      )}>
                        {!isOwn && (
                          <div className="w-5 shrink-0">
                            {showAvatar && (
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[7px] bg-[#6264a7] text-white">
                                  {msg.sender_name?.[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}
                        <div className={cn(
                          "max-w-[85%] md:max-w-[75%]",
                          isOwn ? "items-end text-right" : "items-start text-left"
                        )}>
                          {showAvatar && !isOwn && (
                            <p className="text-[9px] text-muted-foreground mb-0.5 ml-1 font-semibold">{msg.sender_name}</p>
                          )}
                          <div className={cn(
                            "p-1.5 rounded-md text-[11px] md:text-xs",
                            isOwn ? "bg-[#e8ebfa] text-[#242424] rounded-tr-none" : "bg-white border shadow-sm rounded-tl-none"
                          )}>
                            <p className="leading-tight">{msg.content}</p>
                          </div>
                          <p className="text-[7px] text-muted-foreground mt-0.5 px-0.5 uppercase">10:45 AM</p>
                        </div>
                      </div>
                    );
                  })}
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-30">
                      <MessageSquare className="h-6 w-6" />
                      <p className="text-[10px] font-medium">No messages. Start the coordination.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-2 md:p-3 border-t shrink-0">
                <div className="max-w-3xl mx-auto bg-white border rounded-md shadow-sm">
                  <div className="flex items-center gap-0.5 p-0.5 border-b">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><Paperclip className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><Smile className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><Bold className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex items-end p-1.5 gap-1.5">
                    <textarea 
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-1 min-h-[32px] max-h-24 text-[11px] md:text-xs no-scrollbar outline-none"
                      rows={1}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      size="icon" 
                      className="h-7 w-7 bg-[#6264a7] hover:bg-[#4b4d8a] text-white shrink-0 rounded-full"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#f5f5f5]">
            <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
              <MessageSquare className="h-8 w-8 text-[#6264a7]" />
            </div>
            <h3 className="text-sm font-bold">Select a chat</h3>
            <p className="text-[10px] text-muted-foreground max-w-[180px] mt-1.5">
              Choose a channel or direct message to start coordinating.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
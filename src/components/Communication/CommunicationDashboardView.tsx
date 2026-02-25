import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MessageSquare, 
  Hash, 
  Paperclip, 
  Smile, 
  AtSign, 
  Bold, 
  Italic, 
  Send,
  MoreVertical,
  Reply,
  Calendar,
  CheckSquare,
  FileText,
  Zap,
  Bell,
  Users,
  Menu,
  Phone,
  Video,
  Info,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communicationService, type Communication, type CommunicationMessage } from "@/services/communicationService";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function CommunicationDashboardView() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("chat");
  const [activeChannel, setActiveChannel] = useState<Communication | null>(null);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [channels, setChannels] = useState<Communication[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChannels = async () => {
      const { data } = await communicationService.getCommunications();
      if (data) {
        setChannels(data);
        if (data.length > 0 && !activeChannel) {
          setActiveChannel(data[0]);
        }
      }
    };
    loadChannels();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      const loadMessages = async () => {
        const { data } = await communicationService.getMessages(activeChannel.id);
        if (data) setMessages(data);
      };
      loadMessages();

      const unsubscribe = communicationService.subscribeToMessages(activeChannel.id, () => {
        loadMessages();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [activeChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeChannel || !user) return;

    const { error } = await communicationService.sendMessage({
      communicationId: activeChannel.id,
      senderId: user.id,
      content: messageInput,
      platform: "WhatsApp"
    });

    if (!error) setMessageInput("");
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Activity Bar (Tier 1) */}
      <div className="hidden sm:flex w-16 flex-col items-center py-4 bg-[#201f1f] text-zinc-400 gap-6 border-r border-zinc-800 shrink-0">
        <button className="p-2 hover:text-white transition-colors"><Bell className="w-6 h-6" /></button>
        <button className={cn("p-2 transition-colors", activeTab === "chat" ? "text-white bg-white/10 rounded-lg" : "hover:text-white")} onClick={() => setActiveTab("chat")}><MessageSquare className="w-6 h-6" /></button>
        <button className="p-2 hover:text-white transition-colors"><Users className="w-6 h-6" /></button>
        <button className="p-2 hover:text-white transition-colors"><Calendar className="w-6 h-6" /></button>
        <button className="p-2 hover:text-white transition-colors"><CheckSquare className="w-6 h-6" /></button>
        <button className="p-2 hover:text-white transition-colors"><FileText className="w-6 h-6" /></button>
        <div className="mt-auto flex flex-col items-center gap-4">
          <button className="p-2 hover:text-white transition-colors"><Zap className="w-6 h-6 text-amber-400" /></button>
        </div>
      </div>

      {/* Main Sidebar */}
      <div className={cn(
        "flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-all duration-300 shrink-0",
        sidebarOpen ? "w-72" : "w-0 overflow-hidden sm:w-0"
      )}>
        <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-bold text-xl">Chat</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Event Channels</div>
              <div className="space-y-1">
                {channels.filter(c => c.type === "Internal").map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveChannel(channel);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left",
                      activeChannel?.id === channel.id 
                        ? "bg-[#6264a7]/10 text-[#6264a7] font-medium" 
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    <Hash className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1 text-sm">{channel.contact_name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent Chats</div>
              <div className="space-y-1">
                {channels.filter(c => c.type !== "Internal").map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChannel(chat);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left",
                      activeChannel?.id === chat.id 
                        ? "bg-[#6264a7]/10 text-[#6264a7] font-medium" 
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-zinc-200">{chat.contact_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-50 dark:border-zinc-900 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{chat.contact_name}</div>
                      <div className="text-xs text-zinc-500 truncate">{chat.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 relative">
        {activeChannel ? (
          <>
            {/* Header */}
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="sm:hidden -ml-2" 
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-[#6264a7] text-white p-1.5 rounded-lg">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base truncate">{activeChannel.contact_name}</h3>
                    <p className="text-[10px] sm:text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Available
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Tabs defaultValue="chat" className="hidden lg:block">
                  <TabsList className="bg-transparent border-none">
                    <TabsTrigger value="chat" className="data-[state=active]:bg-[#6264a7]/10 data-[state=active]:text-[#6264a7]">Chat</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="ai">AI Insights</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9"><Info className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages View */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <ScrollArea className="flex-1 px-4 py-4" viewportRef={scrollRef}>
                <div className="space-y-6 max-w-5xl mx-auto">
                  {messages.map((msg, idx) => {
                    const isOwn = msg.is_from_me;
                    const showAvatar = idx === 0 || messages[idx - 1]?.is_from_me !== msg.is_from_me;
                    
                    return (
                      <div key={msg.id} className={cn(
                        "flex gap-3 group",
                        isOwn ? "flex-row-reverse" : "flex-row"
                      )}>
                        <div className={cn("shrink-0", !showAvatar && "invisible")}>
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-zinc-200 dark:border-zinc-800">
                            <AvatarFallback className="bg-zinc-100 text-xs">{isOwn ? "Me" : "VN"}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className={cn(
                          "flex flex-col max-w-[85%] sm:max-w-[70%]",
                          isOwn ? "items-end" : "items-start"
                        )}>
                          {showAvatar && (
                            <div className="flex items-center gap-2 mb-1 px-1">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{isOwn ? "You" : activeChannel.contact_name}</span>
                              <span className="text-[10px] text-zinc-500">{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          )}
                          <div className={cn(
                            "px-3 py-2 sm:px-4 sm:py-2.5 text-sm rounded-2xl shadow-sm",
                            isOwn 
                              ? "bg-[#6264a7] text-white rounded-tr-none" 
                              : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-none"
                          )}>
                            {msg.content}
                          </div>
                          <div className={cn(
                            "opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex gap-2",
                            isOwn ? "flex-row-reverse" : "flex-row"
                          )}>
                            <button className="text-[10px] text-zinc-500 hover:text-[#6264a7] flex items-center gap-1"><Reply className="w-3 h-3" /> Reply</button>
                            <button className="text-[10px] text-zinc-500 hover:text-[#6264a7] flex items-center gap-1"><Smile className="w-3 h-3" /> React</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-2 sm:p-4 bg-white dark:bg-zinc-950 shrink-0">
                <form 
                  onSubmit={handleSendMessage}
                  className="max-w-5xl mx-auto bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm"
                >
                  <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Paperclip className="h-4 w-4" /></Button>
                    <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 shrink-0" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Bold className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Italic className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Smile className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><AtSign className="h-4 w-4" /></Button>
                    <div className="flex-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                  <div className="relative flex items-end px-3 py-2 min-h-[50px]">
                    <textarea 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Message ${activeChannel.contact_name}`}
                      className="w-full bg-transparent border-none focus:ring-0 resize-none py-1 text-sm max-h-32 min-h-[24px]"
                      rows={1}
                    />
                    <Button 
                      size="icon" 
                      className={cn(
                        "h-8 w-8 rounded-lg shrink-0 transition-all",
                        messageInput.trim() ? "bg-[#6264a7] text-white" : "bg-zinc-200 text-zinc-400"
                      )}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50 dark:bg-zinc-900/50">
            <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg mb-6">
              <MessageSquare className="w-10 h-10 text-[#6264a7]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to your Production Command Center</h2>
            <p className="text-zinc-500 max-w-md">Select an event channel or direct message to start coordinating.</p>
          </div>
        )}
      </div>
    </div>
  );
}
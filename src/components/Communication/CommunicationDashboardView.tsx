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
  Clock,
  Calendar,
  CheckSquare,
  Sparkles,
  FileText,
  Settings,
  Bell,
  SearchIcon,
  Filter
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CommunicationDashboardView() {
  const { profile } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [viewMode, setViewMode] = useState("messages"); // messages, files, tasks, calendar, ai
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
      console.error("Failed to load communications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (id: string) => {
    try {
      const data = await communicationService.getMessages(id);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
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
  const dms = communications.filter(c => c.type === 'direct' || !c.type);

  if (isLoading) return <div className="h-full flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-[#6264a7]" /></div>;

  return (
    <div className="h-full w-full flex bg-[#f0f0f0] overflow-hidden font-sans border-t border-slate-200">
      {/* Activity Bar - Dark Side */}
      <div className="w-16 bg-[#201f1e] flex flex-col items-center py-4 gap-4 shrink-0">
        {[
          { id: "activity", icon: Bell, label: "Activity" },
          { id: "chat", icon: MessageSquare, label: "Chat" },
          { id: "teams", icon: Users, label: "Teams" },
          { id: "calendar", icon: Calendar, label: "Calendar" },
          { id: "tasks", icon: CheckSquare, label: "Tasks" },
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
        <div className="mt-auto flex flex-col items-center gap-4">
          <button className="text-[#a19f9d] hover:text-white"><LayoutGrid className="w-6 h-6" /></button>
          <button className="text-[#a19f9d] hover:text-white"><Settings className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Nav Sidebar - Teams Style */}
      <div className="w-80 bg-[#f5f5f5] flex flex-col shrink-0 border-r border-slate-200">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#242424] tracking-tight">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644] hover:bg-slate-200">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#484644] hover:bg-slate-200">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605e5c]" />
            <Input 
              placeholder="Search or start a new chat" 
              className="pl-9 h-9 bg-white border-slate-200 focus:ring-[#6264a7] text-sm"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-6 pb-4">
            {/* Tier 1: Channel-based client/project spaces */}
            {channels.length > 0 && (
              <div>
                <button className="flex items-center gap-1 px-2 mb-2 text-[11px] font-bold text-[#605e5c] uppercase tracking-wider w-full text-left hover:text-[#242424]">
                  <ChevronDown className="w-3 h-3" /> Event Channels
                </button>
                <div className="space-y-0.5">
                  {channels.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-md transition-all text-left group",
                        selectedChatId === chat.id ? "bg-white shadow-sm ring-1 ring-slate-200" : "hover:bg-[#edebe9]"
                      )}
                    >
                      <div className="w-8 h-8 rounded bg-[#6264a7] flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#242424] truncate">{chat.contact_name}</span>
                          <span className="text-[10px] text-[#605e5c]">2:34 PM</span>
                        </div>
                        <div className="text-[11px] text-[#605e5c] truncate leading-tight mt-0.5">{chat.last_message || "No messages yet"}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Messages */}
            <div>
              <button className="flex items-center gap-1 px-2 mb-2 text-[11px] font-bold text-[#605e5c] uppercase tracking-wider w-full text-left hover:text-[#242424]">
                <ChevronDown className="w-3 h-3" /> Recent Chats
              </button>
              <div className="space-y-0.5">
                {dms.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-md transition-all text-left group",
                      selectedChatId === chat.id ? "bg-white shadow-sm ring-1 ring-slate-200" : "hover:bg-[#edebe9]"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-8 w-8 shadow-sm">
                        <AvatarFallback className="bg-[#edebe9] text-[#605e5c] text-xs font-bold">
                          {chat.contact_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#92c353] border-2 border-[#f5f5f5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#242424] truncate">{chat.contact_name}</span>
                        <span className="text-[10px] text-[#605e5c]">Yesterday</span>
                      </div>
                      <div className="text-[11px] text-[#605e5c] truncate leading-tight mt-0.5">{chat.last_message || "Start of direct message"}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Canvas - Edge to Edge */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedChatId ? (
          <>
            {/* Chat Header - Teams Style */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-white shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {activeChat?.type === 'channel' ? (
                    <div className="w-10 h-10 rounded bg-[#6264a7] flex items-center justify-center text-white">
                      <Hash className="w-5 h-5" />
                    </div>
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-100 text-[#6264a7] font-bold">
                        {activeChat?.contact_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-[#242424] leading-tight">{activeChat?.contact_name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#92c353]" />
                      <span className="text-[11px] text-[#605e5c] font-medium">Available</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-slate-200 mx-2" />
                
                {/* Internal Tabs for the specific space */}
                <div className="flex h-16">
                  {[
                    { id: "messages", label: "Chat", icon: MessageSquare },
                    { id: "files", label: "Files", icon: Files },
                    { id: "tasks", label: "Tasks", icon: CheckSquare },
                    { id: "ai", label: "AI Insights", icon: Sparkles },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id)}
                      className={cn(
                        "px-4 flex items-center gap-2 text-sm font-semibold transition-all relative",
                        viewMode === tab.id 
                          ? "text-[#6264a7]" 
                          : "text-[#605e5c] hover:text-[#242424] hover:bg-slate-50"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {viewMode === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6264a7] rounded-t-full" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#484644] hover:bg-slate-100"><Video className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#484644] hover:bg-slate-100"><Phone className="w-5 h-5" /></Button>
                <div className="h-6 w-px bg-slate-200 mx-1" />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#484644] hover:bg-slate-100"><Info className="w-5 h-5" /></Button>
              </div>
            </div>

            {/* View Mode Switching */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
              {viewMode === 'messages' && (
                <>
                  <ScrollArea className="flex-1" ref={scrollRef}>
                    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
                      {messages.map((msg, idx) => {
                        const showDate = idx === 0 || format(new Date(messages[idx-1].timestamp || ''), 'yyyy-MM-dd') !== format(new Date(msg.timestamp || ''), 'yyyy-MM-dd');
                        
                        return (
                          <div key={msg.id}>
                            {showDate && (
                              <div className="flex items-center gap-4 my-8">
                                <div className="h-px bg-slate-200 flex-1" />
                                <span className="text-[11px] font-bold text-[#605e5c] uppercase tracking-widest bg-white px-2">
                                  {format(new Date(msg.timestamp || ''), 'MMMM d, yyyy')}
                                </span>
                                <div className="h-px bg-slate-200 flex-1" />
                              </div>
                            )}
                            
                            <div className="group flex gap-4 hover:bg-[#f3f2f1]/50 -mx-6 px-6 py-3 transition-colors relative">
                              <Avatar className="h-9 w-9 shrink-0 shadow-sm">
                                <AvatarFallback className="bg-slate-100 text-[#6264a7] text-xs font-bold">
                                  {msg.sender_name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold text-[#242424]">{msg.sender_name}</span>
                                  <span className="text-[11px] text-[#605e5c] font-medium">{format(new Date(msg.timestamp || ''), 'p')}</span>
                                </div>
                                
                                {msg.reply_to && (
                                  <div className="border-l-3 border-[#6264a7] bg-slate-50/80 p-3 rounded-r-md mb-3 text-xs text-[#605e5c] shadow-sm max-w-lg">
                                    <div className="font-bold text-[10px] text-[#6264a7] uppercase tracking-tight flex items-center gap-1 mb-1">
                                      <Reply className="w-3 h-3" /> {msg.reply_to.sender_name}
                                    </div>
                                    <div className="truncate italic leading-relaxed">{msg.reply_to.content}</div>
                                  </div>
                                )}

                                <div className="text-[15px] text-[#242424] leading-relaxed whitespace-pre-wrap font-medium">
                                  {msg.content}
                                </div>
                                
                                {msg.reactions && Object.keys(msg.reactions as object).length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {Object.entries(msg.reactions as Record<string, number>).map(([emoji, count]) => (
                                      <button key={emoji} className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-slate-200 bg-white text-xs hover:border-[#6264a7] transition-all shadow-xs">
                                        <span>{emoji}</span>
                                        <span className="font-bold text-[#242424]">{count}</span>
                                      </button>
                                    ))}
                                    <button className="flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Plus className="w-3.5 h-3.5 text-[#605e5c]" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Hover Message Actions */}
                              <div className="absolute right-8 top-3 hidden group-hover:flex items-center bg-white shadow-lg border border-slate-200 rounded-lg overflow-hidden z-20">
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100 text-[#484644] hover:text-[#6264a7]" onClick={() => setReplyingTo(msg)}>
                                  <Reply className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100 text-[#484644] hover:text-[#e45649]">
                                  <Heart className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100 text-[#484644] hover:text-[#6264a7]">
                                  <Smile className="w-5 h-5" />
                                </Button>
                                <div className="w-px h-6 bg-slate-200 mx-0.5" />
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100 text-[#484644]">
                                  <MoreVertical className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Message Input Section */}
                  <div className="px-6 pb-6 pt-2 bg-white max-w-5xl mx-auto w-full">
                    {replyingTo && (
                      <div className="mb-0 border border-b-0 border-slate-200 rounded-t-xl bg-[#f5f5f5] p-3 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
                        <div className="flex items-center gap-3">
                          <Reply className="w-4 h-4 text-[#6264a7]" />
                          <div className="text-xs">
                            <span className="text-[#605e5c]">Replying to </span>
                            <span className="font-bold text-[#242424]">{replyingTo.sender_name}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-slate-200" onClick={() => setReplyingTo(null)}>
                          <Plus className="w-4 h-4 rotate-45 text-[#605e5c]" />
                        </Button>
                      </div>
                    )}
                    <div className={cn(
                      "border border-slate-300 transition-all bg-white shadow-md focus-within:border-[#6264a7] focus-within:ring-4 focus-within:ring-[#6264a7]/5",
                      replyingTo ? "rounded-b-xl" : "rounded-xl"
                    )}>
                      <div className="flex items-center px-2 py-1 border-b border-slate-100 bg-[#fbfbfb] rounded-t-xl">
                        <div className="flex items-center">
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#605e5c] hover:text-[#6264a7]"><Paperclip className="w-5 h-5" /></Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#605e5c] hover:text-[#6264a7]"><Smile className="w-5 h-5" /></Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#605e5c] hover:text-[#6264a7]"><AtSign className="w-5 h-5" /></Button>
                          <div className="h-5 w-px bg-slate-200 mx-1" />
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#605e5c] hover:text-[#6264a7] font-bold text-xs uppercase tracking-tight">B</Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#605e5c] hover:text-[#6264a7] italic font-serif">I</Button>
                        </div>
                        <div className="flex-1" />
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#605e5c] hover:text-[#6264a7]"><MoreVertical className="w-5 h-5" /></Button>
                      </div>
                      <div className="flex items-end p-3 gap-3">
                        <textarea 
                          placeholder={`Message ${activeChat?.contact_name}`} 
                          className="flex-1 min-h-[50px] max-h-64 bg-transparent border-none focus:ring-0 text-[15px] resize-none p-1 outline-none font-medium text-[#242424] leading-relaxed placeholder:text-slate-400"
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
                          className="h-10 w-10 bg-[#6264a7] hover:bg-[#4f5196] text-white rounded-lg shadow-lg shadow-[#6264a7]/20 p-0"
                        >
                          {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-[#605e5c] font-medium opacity-60">
                      <span>Press <strong>Enter</strong> to send</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span><strong>Shift + Enter</strong> for new line</span>
                    </div>
                  </div>
                </>
              )}

              {viewMode === 'files' && (
                <div className="flex-1 p-8 bg-[#f5f5f5]">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-[#242424]">Shared Files</h2>
                        <p className="text-sm text-[#605e5c] mt-1">All documents and media shared in this space.</p>
                      </div>
                      <Button className="bg-[#6264a7] hover:bg-[#4f5196]">
                        <Plus className="w-4 h-4 mr-2" /> Upload File
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {[
                        { name: "Wedding_Timeline_v4.pdf", type: "PDF", size: "1.2 MB", date: "2 hours ago" },
                        { name: "Venue_Floor_Plan.jpg", type: "IMAGE", size: "4.5 MB", date: "Yesterday" },
                        { name: "Contract_Catering.docx", type: "DOC", size: "850 KB", date: "Sep 24" },
                        { name: "Vendor_List.xlsx", type: "SHEET", size: "320 KB", date: "Sep 22" },
                      ].map((file, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                          <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-[#6264a7]/10 transition-colors">
                            <FileText className="w-6 h-6 text-[#6264a7]" />
                          </div>
                          <h4 className="text-sm font-bold text-[#242424] truncate">{file.name}</h4>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-[11px] font-bold text-[#605e5c] uppercase">{file.type} • {file.size}</span>
                            <span className="text-[11px] text-[#a19f9d]">{file.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'tasks' && (
                <div className="flex-1 p-8 bg-[#f5f5f5]">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-[#242424]">Project Tasks</h2>
                      <Button className="bg-[#6264a7] hover:bg-[#4f5196]"><Plus className="w-4 h-4 mr-2" /> New Task</Button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { title: "Review catering menu", status: "In Progress", priority: "High" },
                        { title: "Approve lighting blueprint", status: "Pending", priority: "Medium" },
                        { title: "Finalize guest list", status: "Done", priority: "High" },
                      ].map((task, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                          <div className={cn(
                            "w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center cursor-pointer",
                            task.status === 'Done' && "bg-[#92c353] border-[#92c353]"
                          )}>
                            {task.status === 'Done' && <CheckCheck className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h4 className={cn("text-sm font-bold text-[#242424]", task.status === 'Done' && "line-through opacity-50")}>{task.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold text-[#605e5c]">{task.priority}</Badge>
                              <span className="text-[11px] text-[#a19f9d]">{task.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'ai' && (
                <div className="flex-1 p-12 bg-white flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#6264a7] to-[#8c8ed7] flex items-center justify-center shadow-2xl mb-8 animate-pulse">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#242424] tracking-tight">AI Coordination Insights</h2>
                  <p className="text-[#605e5c] max-w-lg mt-4 text-lg leading-relaxed">
                    Orchestrix AI is analyzing this project. Soon you'll get meeting summaries, 
                    automated task extraction, and risk assessments for your events.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                      <Clock className="w-6 h-6 text-[#6264a7] mb-3" />
                      <h4 className="font-bold text-sm">Meeting Summaries</h4>
                      <p className="text-xs text-[#605e5c] mt-2">Get the key takeaways from long chat threads automatically.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                      <CheckSquare className="w-6 h-6 text-[#6264a7] mb-3" />
                      <h4 className="font-bold text-sm">Task Extraction</h4>
                      <p className="text-xs text-[#605e5c] mt-2">Convert chat decisions into actionable tasks with one click.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                      <Users className="w-6 h-6 text-[#6264a7] mb-3" />
                      <h4 className="font-bold text-sm">Sentiment Analysis</h4>
                      <p className="text-xs text-[#605e5c] mt-2">Monitor client satisfaction levels throughout the planning process.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f5f5f5]">
             <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shadow-xl mb-6">
               <MessageSquare className="w-12 h-12 text-[#6264a7] opacity-20" />
             </div>
             <h3 className="text-2xl font-extrabold text-[#242424]">Welcome back to Orchestrix Hub</h3>
             <p className="text-[#605e5c] max-w-sm mt-3 text-base leading-relaxed">
               Select an event channel or direct message to start coordinating with your production team.
             </p>
             <div className="flex gap-4 mt-8">
               <Button className="bg-[#6264a7] hover:bg-[#4f5196] h-11 px-8 rounded-full shadow-lg shadow-[#6264a7]/20">New Message</Button>
               <Button variant="outline" className="h-11 px-8 rounded-full border-slate-300">Browse Channels</Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
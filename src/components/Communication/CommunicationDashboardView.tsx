import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Slack, 
  Mail, 
  Phone, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MoreVertical,
  Sparkles,
  Send,
  User,
  ExternalLink,
  ChevronLeft,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { communicationService } from "@/services/communicationService";
import { useAuth } from "@/contexts/AuthContext";
import { useEvent } from "@/contexts/EventContext";

// Mock data for initial view - will be replaced with real service calls
const MOCK_CONVERSATIONS = [
  { 
    id: "1", 
    name: "Santos-Cruz Wedding", 
    platform: "whatsapp", 
    lastMsg: "Did the florist arrive yet?", 
    time: new Date(), 
    unread: 3, 
    type: "client",
    status: "delivered",
    priority: "urgent"
  },
  { 
    id: "2", 
    name: "Catering Team", 
    platform: "slack", 
    lastMsg: "Layout plan for the garden is ready.", 
    time: new Date(Date.now() - 1000 * 60 * 15), 
    unread: 0, 
    type: "vendor",
    status: "read",
    priority: "normal"
  },
  { 
    id: "3", 
    name: "Palacio de Memoria", 
    platform: "email", 
    lastMsg: "Contract for Venue Rental signed.", 
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), 
    unread: 1, 
    type: "vendor",
    status: "sent",
    priority: "normal"
  },
];

export function CommunicationDashboardView() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { activeEvent } = useEvent();

  const filteredConversations = MOCK_CONVERSATIONS.filter(c => 
    activeTab === "all" || c.platform === activeTab
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In real app, call communicationService.sendMessage
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar - Thread List */}
      <div className="w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Unified Inbox</h2>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search messages..." className="pl-9 bg-white border-slate-200 h-10 rounded-xl" />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-100/50 p-1 rounded-xl w-full justify-start overflow-x-auto no-scrollbar h-11">
              <TabsTrigger value="all" className="rounded-lg px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="whatsapp" className="rounded-lg px-4 text-xs font-semibold gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                WA
              </TabsTrigger>
              <TabsTrigger value="slack" className="rounded-lg px-4 text-xs font-semibold gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Slack className="w-3.5 h-3.5 text-purple-500" />
                Slack
              </TabsTrigger>
              <TabsTrigger value="email" className="rounded-lg px-4 text-xs font-semibold gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                Email
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            {filteredConversations.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all border border-transparent",
                  selectedChat?.id === chat.id 
                    ? "bg-white border-slate-200 shadow-sm ring-1 ring-slate-200" 
                    : "hover:bg-white hover:border-slate-100"
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">
                          {chat.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        {chat.platform === "whatsapp" && <MessageSquare className="w-3 h-3 text-emerald-500 fill-emerald-500" />}
                        {chat.platform === "slack" && <Slack className="w-3 h-3 text-purple-500" />}
                        {chat.platform === "email" && <Mail className="w-3 h-3 text-blue-500 fill-blue-500" />}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{chat.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase font-bold text-slate-400 border-slate-200">
                          {chat.type}
                        </Badge>
                        {chat.priority === "urgent" && (
                          <Badge className="bg-rose-100 text-rose-600 border-none text-[9px] px-1.5 py-0 font-bold uppercase">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    {format(chat.time, "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center justify-between ml-[52px] mt-1">
                  <p className={cn(
                    "text-xs truncate max-w-[180px]",
                    chat.unread > 0 ? "text-slate-900 font-bold" : "text-slate-500"
                  )}>
                    {chat.lastMsg}
                  </p>
                  {chat.unread > 0 && (
                    <div className="bg-blue-600 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1 animate-in fade-in zoom-in">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-slate-100 px-6 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                    {selectedChat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    {selectedChat.name}
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[10px]">
                      {selectedChat.platform.toUpperCase()}
                    </Badge>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-medium">Vendor is online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg gap-2 text-xs font-bold border-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  AI Summary
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200">
                  <Info className="w-4 h-4 text-slate-400" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 bg-slate-50/30 p-6">
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-white border-slate-200 text-slate-400 text-[10px] font-bold uppercase py-0.5 px-3">
                    Yesterday
                  </Badge>
                </div>

                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm relative">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Hi coordinator! Just wanted to confirm the flower delivery for tomorrow. 
                      Will someone be at the venue by 7 AM to receive them?
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-2 block">14:20</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-w-[80%] ml-auto items-end">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl rounded-tr-none shadow-md relative">
                    <p className="text-sm leading-relaxed">
                      Yes! Sofia will be there at exactly 6:30 AM. Please coordinate with her once you arrive at the loading bay.
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <span className="text-[10px] text-slate-300 font-medium">14:25</span>
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-white border-slate-200 text-slate-400 text-[10px] font-bold uppercase py-0.5 px-3">
                    Today
                  </Badge>
                </div>

                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm relative">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedChat.lastMsg}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-2 block">
                      {format(selectedChat.time, "HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-6 border-t border-slate-100 bg-white shrink-0">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600">
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Reply on ${selectedChat.platform}...`}
                    rows={1}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 resize-none min-h-[40px] max-h-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="h-9 w-9 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shrink-0 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-3 px-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quick Replies:</p>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button className="text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2 py-1 bg-slate-100 rounded-md whitespace-nowrap transition-colors">Confirm Arrival</button>
                    <button className="text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2 py-1 bg-slate-100 rounded-md whitespace-nowrap transition-colors">Payment Update</button>
                    <button className="text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2 py-1 bg-slate-100 rounded-md whitespace-nowrap transition-colors">Layout Review</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
            <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-8 relative">
              <MessageSquare className="w-10 h-10 text-slate-200" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Your Unified Production Inbox</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              Select a conversation to start managing WhatsApp, Slack, and Email threads in one place.
            </p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">AI Daily Recap</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">Summarize unread messages from all channels into a quick morning briefing.</p>
              </Card>
              <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Task Extraction</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">Automatically detect to-dos and follow-ups hidden within your chat history.</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
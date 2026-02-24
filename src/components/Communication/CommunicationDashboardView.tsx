import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Search, 
  MessageSquare, 
  Users, 
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  ChevronRight,
  Sparkles,
  Calendar,
  Bell,
  LayoutGrid,
  Files,
  Pin,
  CheckCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEvent } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_CHATS = [
  {
    id: "1",
    name: "Production Team",
    lastMessage: "Catering is confirmed for 2 PM arrival.",
    time: "10:30 AM",
    unread: 3,
    type: "team",
    avatar: "PT",
    status: "online"
  },
  {
    id: "2",
    name: "Santos-Reyes Wedding",
    lastMessage: "Wait for the flower delivery at the lobby.",
    time: "9:45 AM",
    unread: 0,
    type: "event",
    avatar: "SR",
    status: "away"
  },
  {
    id: "3",
    name: "Elite Lights & Sounds",
    lastMessage: "Technical rider received. We are good to go.",
    time: "Yesterday",
    unread: 0,
    type: "vendor",
    avatar: "EL",
    status: "offline"
  }
];

export function CommunicationDashboardView() {
  const { events, activeEvent } = useEvent();
  const { profile } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(MOCK_CHATS[0].id);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const activeChat = MOCK_CHATS.find(c => c.id === selectedChat);

  return (
    <div className="h-[calc(100vh-120px)] flex bg-slate-50/50 rounded-xl overflow-hidden border border-slate-200 animate-in fade-in duration-500">
      {/* Activity Bar (Teams Style) */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4 shrink-0">
        {[
          { id: "activity", icon: Bell, label: "Activity" },
          { id: "chat", icon: MessageSquare, label: "Chat" },
          { id: "teams", icon: Users, label: "Teams" },
          { id: "calendar", icon: Calendar, label: "Calendar" },
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
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search" className="pl-9 h-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-2 space-y-0.5">
            {MOCK_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left relative",
                  selectedChat === chat.id 
                    ? "bg-slate-100" 
                    : "hover:bg-slate-50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-xs">{chat.avatar}</AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                    chat.status === 'online' ? "bg-emerald-500" : chat.status === 'away' ? "bg-amber-500" : "bg-slate-300"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-sm text-slate-900 truncate">{chat.name}</span>
                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <Badge className="bg-rose-500 text-white h-5 min-w-[20px] rounded-full flex items-center justify-center p-0 px-1 text-[10px] border-none">
                    {chat.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">{activeChat?.avatar}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 truncate">{activeChat?.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      activeChat?.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {activeChat?.status === 'online' ? 'Available' : 'Offline'}
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

            {/* Messages Area */}
            <ScrollArea className="flex-1 bg-[#F5F5F5] p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col items-center py-4">
                  <span className="px-4 py-1 bg-white rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm border border-slate-100">
                    Yesterday
                  </span>
                </div>

                {/* Incoming Message */}
                <div className="flex gap-3 group">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-[10px]">JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Jane Doe</span>
                      <span className="text-[10px] text-slate-400">10:30 AM</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-slate-700 max-w-lg border border-slate-200">
                      Catering is confirmed for 2 PM arrival. They requested the technical rider for the buffet setup.
                    </div>
                  </div>
                </div>

                {/* Outgoing Message */}
                <div className="flex gap-3 justify-end group">
                  <div className="space-y-1 items-end flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">10:32 AM</span>
                      <span className="text-xs font-bold text-slate-900">Me</span>
                    </div>
                    <div className="bg-[#E7EFFF] p-3 rounded-lg rounded-tr-none shadow-sm text-sm text-slate-700 max-w-lg border border-[#D1E0FF]">
                      Copy that. I've updated the Production Hub. Checking with the florist now for the lobby setup.
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                      <CheckCheck className="w-3 h-3" /> Seen
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <div className="flex items-center px-2 py-1 border-b border-slate-50 gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><LayoutGrid className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><Paperclip className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-500"><Smile className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500"><Pin className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex items-end p-2 gap-2">
                    <textarea 
                      placeholder="Type a message" 
                      className="flex-1 min-h-[40px] max-h-32 bg-transparent border-none focus:ring-0 text-sm resize-none p-2"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button 
                      disabled={!message.trim()}
                      className="h-10 w-10 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center p-0 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
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

      {/* Right Info Panel (Teams Style) */}
      <div className="w-72 bg-white border-l border-slate-200 hidden xl:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-4 border-b border-slate-200 shrink-0">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Context & Details</h4>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-32 bg-slate-100 rounded-xl flex items-center justify-center">
                <LayoutGrid className="w-10 h-10 text-slate-300" />
              </div>
              <div>
                <h5 className="font-black text-slate-900">Event Context</h5>
                <p className="text-xs text-slate-500 mt-1">Santos-Reyes Wedding Production</p>
              </div>
              <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase tracking-widest border-slate-200">
                View Event Hub
              </Button>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Participants</h5>
              <div className="space-y-3">
                {[
                  { name: "Jane Doe", role: "Lead Coordinator", initial: "JD" },
                  { name: "Mark Wilson", role: "Floor Manager", initial: "MW" },
                  { name: "Sarah Tan", role: "Catering Head", initial: "ST" },
                ].map((person) => (
                  <div key={person.name} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[10px] bg-slate-100 font-bold">{person.initial}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{person.name}</p>
                      <p className="text-[10px] text-slate-400">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Sparkles className="w-3 h-3" /> Production Note
              </div>
              <p className="text-[10px] text-primary/80 leading-relaxed font-medium">
                The technical rider was updated 2 hours ago. Please confirm the buffet layout with Sarah.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
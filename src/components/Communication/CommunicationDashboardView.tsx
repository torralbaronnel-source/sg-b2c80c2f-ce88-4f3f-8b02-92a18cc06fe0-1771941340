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
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEvent } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const MOCK_THREADS = [
  {
    id: "1",
    name: "Production Team",
    lastMessage: "Catering is confirmed for 2 PM arrival.",
    time: "10:30 AM",
    unread: 3,
    type: "team",
    avatar: "PT"
  },
  {
    id: "2",
    name: "Santos Wedding",
    lastMessage: "Wait for the flower delivery at the lobby.",
    time: "9:45 AM",
    unread: 0,
    type: "event",
    avatar: "SW"
  },
  {
    id: "3",
    name: "Vendor: Elite Lights",
    lastMessage: "Technical rider received. We are good to go.",
    time: "Yesterday",
    unread: 0,
    type: "vendor",
    avatar: "EL"
  }
];

export function CommunicationDashboardView() {
  const { events, activeEvent } = useEvent();
  const { profile } = useAuth();
  const [selectedThread, setSelectedThread] = useState<string | null>(MOCK_THREADS[0].id);
  const [message, setMessage] = useState("");

  const activeThread = MOCK_THREADS.find(t => t.id === selectedThread);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Communication Hub</h1>
          <p className="text-slate-500">In-app team and production messaging.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Users className="w-4 h-4" /> Team Directory
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90 gap-2">
            <MessageSquare className="w-4 h-4" /> New Message
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Thread List */}
        <Card className="w-80 lg:w-96 flex flex-col border-slate-200 overflow-hidden shrink-0">
          <CardHeader className="p-4 space-y-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search messages..." className="pl-9 h-10 bg-slate-50 border-none" />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="cursor-pointer">All</Badge>
              <Badge variant="outline" className="cursor-pointer text-slate-500">Events</Badge>
              <Badge variant="outline" className="cursor-pointer text-slate-500">Team</Badge>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {MOCK_THREADS.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                    selectedThread === thread.id 
                      ? "bg-slate-900 text-white" 
                      : "hover:bg-slate-50 text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10 border-2 border-white/10">
                      <AvatarFallback className={cn(
                        "font-bold text-xs",
                        selectedThread === thread.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        {thread.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="font-bold text-sm truncate">{thread.name}</span>
                        <span className={cn(
                          "text-[10px]",
                          selectedThread === thread.id ? "text-white/60" : "text-slate-400"
                        )}>{thread.time}</span>
                      </div>
                      <p className={cn(
                        "text-xs truncate",
                        selectedThread === thread.id ? "text-white/80" : "text-slate-500"
                      )}>{thread.lastMessage}</p>
                    </div>
                    {thread.unread > 0 && (
                      <Badge className="bg-primary text-white h-5 w-5 rounded-full flex items-center justify-center p-0 text-[10px]">
                        {thread.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col border-slate-200 overflow-hidden relative">
          {selectedThread ? (
            <>
              <CardHeader className="p-4 border-b flex flex-row items-center justify-between shrink-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">{activeThread?.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900">{activeThread?.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Team Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                    <Video className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-4 bg-slate-100 mx-2" />
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4 bg-slate-50/30">
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center py-8 text-center space-y-2">
                    <div className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                      Production conversation started
                    </div>
                  </div>

                  {/* Incoming */}
                  <div className="flex gap-3 items-end">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600 font-bold">JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 max-w-[80%]">
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none shadow-sm text-sm text-slate-700">
                        {activeThread?.lastMessage}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium px-1">10:30 AM</span>
                    </div>
                  </div>

                  {/* Outgoing */}
                  <div className="flex gap-3 items-end justify-end">
                    <div className="space-y-1 max-w-[80%]">
                      <div className="bg-slate-900 text-white p-3 rounded-2xl rounded-br-none shadow-lg text-sm">
                        Copy that. I've updated the Production Hub. Checking with the florist now for the lobby setup.
                      </div>
                      <div className="flex items-center justify-end gap-1 px-1">
                        <span className="text-[10px] text-slate-400 font-medium">10:32 AM</span>
                        <div className="flex -space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2 max-w-3xl mx-auto bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-primary/50 transition-all">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary h-8 w-8">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input 
                    placeholder="Type your message..." 
                    className="border-none bg-transparent h-8 focus-visible:ring-0 px-1 text-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-amber-500 h-8 w-8">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button className="h-8 w-8 bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center p-0">
                      <Send className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center shadow-inner">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <div className="space-y-2 max-w-xs">
                <h3 className="text-xl font-black text-slate-900">Select a Thread</h3>
                <p className="text-slate-500 text-sm">Coordinate with your team, vendors, or event stakeholders in real-time.</p>
              </div>
            </div>
          )}

          {/* Context Sidebar (Optional/Right side) */}
          <div className="hidden xl:flex w-72 border-l border-slate-100 bg-slate-50/50 flex-col overflow-hidden absolute right-0 top-0 h-full">
            <div className="p-4 border-b bg-white">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Event Context</h4>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <h5 className="font-bold text-sm text-slate-900 mb-1">Santos Wedding</h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-tighter">
                      <Calendar className="w-3 h-3" /> Feb 25, 2026
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold uppercase tracking-widest">
                    View Live Hub
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Active</h4>
                  <div className="space-y-2">
                    {['Admin User', 'Lead Coordinator', 'Floor Manager'].map(name => (
                      <div key={name} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px] bg-slate-100 font-bold">{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-slate-600">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                    <Sparkles className="w-3 h-3" /> AI Assistant Tip
                  </div>
                  <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                    The florist mentioned a delivery delay in another thread. You might want to confirm if it affects this event's setup.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  );
}
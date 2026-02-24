import React, { useState } from "react";
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
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CHATS = [
  { id: 1, name: "Santos-Cruz Wedding", platform: "WhatsApp", lastMsg: "Did the florist arrive yet?", time: "5m ago", unread: 3, type: "Client" },
  { id: 2, name: "#production-team", platform: "Slack", lastMsg: "Layout plan for the garden is ready.", time: "12m ago", unread: 0, type: "Team" },
  { id: 3, name: "Palacio de Memoria", platform: "Email", lastMsg: "Contract for Venue Rental", time: "1h ago", unread: 1, type: "Vendor" },
  { id: 4, name: "Sofia Rodriguez", platform: "WhatsApp", lastMsg: "Can we change the gown motif?", time: "3h ago", unread: 0, type: "Client" },
];

export function CommunicationDashboardView() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Thread List */}
      <div className="w-96 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 pb-2">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Unified Inbox</h2>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search all channels..." className="pl-9 bg-white border-slate-200" />
          </div>
          
          <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar">
            <Button size="sm" variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")} className="rounded-full h-8">All</Button>
            <Button size="sm" variant={activeTab === "whatsapp" ? "default" : "outline"} onClick={() => setActiveTab("whatsapp")} className="rounded-full h-8 gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-500" />
              WhatsApp
            </Button>
            <Button size="sm" variant={activeTab === "slack" ? "default" : "outline"} onClick={() => setActiveTab("slack")} className="rounded-full h-8 gap-1">
              <Slack className="w-3 h-3 text-purple-500" />
              Slack
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CHATS.map(chat => (
            <div key={chat.id} className="group p-4 rounded-2xl bg-white border border-transparent hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    {chat.platform === "WhatsApp" ? <MessageSquare className="w-5 h-5 text-emerald-500" /> : 
                     chat.platform === "Slack" ? <Slack className="w-5 h-5 text-purple-500" /> : 
                     <Mail className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{chat.name}</p>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider py-0 font-bold text-slate-400 border-slate-200">
                      {chat.type}
                    </Badge>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-400">{chat.time}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-1 ml-12 mt-1">
                {chat.lastMsg}
              </p>
              {chat.unread > 0 && (
                <div className="flex justify-end mt-2">
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {chat.unread}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat View Placeholder */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
          <MessageSquare className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900">Select a conversation</h3>
        <p className="text-slate-500 max-w-xs mt-2">
          Switch between WhatsApp, Slack, and Email without leaving Orchestrix.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Card className="p-4 border-none shadow-sm bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <Sparkles className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-xs font-bold text-slate-900">AI Summary</p>
            <p className="text-[10px] text-slate-500">Recap unread chats</p>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
            <p className="text-xs font-bold text-slate-900">Task Extraction</p>
            <p className="text-[10px] text-slate-500">Find to-dos in chats</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
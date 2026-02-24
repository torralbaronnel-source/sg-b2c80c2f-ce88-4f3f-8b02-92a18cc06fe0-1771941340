import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  CheckCheck,
  User,
  Clock,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

// Using named export for consistency and to fix import error
export function WhatsAppTabletView() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  
  const chats = [
    { id: 1, name: "Santos Wedding", lastMsg: "The florist has arrived!", time: "10:30 AM", unread: 2 },
    { id: 2, name: "Reyes Debut", lastMsg: "Did you receive the cake?", time: "09:45 AM", unread: 0 },
    { id: 3, name: "Gomez Anniversary", lastMsg: "Guest list updated.", time: "Yesterday", unread: 0 },
  ];

  return (
    <div className="flex h-[calc(100vh-280px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Sidebar List */}
      <div className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9 bg-slate-50 border-none h-9 text-sm" placeholder="Search chats..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50",
                activeChat === chat.id && "bg-indigo-50/50 border-r-2 border-r-indigo-500"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <User size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900 text-sm">{chat.name}</span>
                  <span className="text-[10px] text-slate-400">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="h-4 w-4 rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {chats.find(c => c.id === activeChat)?.name}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-medium">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-slate-500"><Phone size={18} /></Button>
                <Button variant="ghost" size="icon" className="text-slate-500"><Video size={18} /></Button>
                <Button variant="ghost" size="icon" className="text-slate-500"><MoreVertical size={18} /></Button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-white text-slate-400 text-[10px] rounded-full shadow-sm">TODAY</span>
              </div>
              
              <div className="flex flex-col items-start max-w-[70%]">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700">
                  The florist has arrived! Where should they set up the arch?
                </div>
                <span className="text-[10px] text-slate-400 mt-1 ml-1">10:30 AM</span>
              </div>

              <div className="flex flex-col items-end self-end max-w-[70%]">
                <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white">
                  They can start at the Garden Terrace. The logistics team is there to assist.
                </div>
                <div className="flex items-center gap-1 mt-1 mr-1">
                  <span className="text-[10px] text-slate-400">10:32 AM</span>
                  <CheckCheck size={12} className="text-indigo-400" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Button variant="ghost" size="icon" className="text-slate-500 shrink-0">+</Button>
                <Input className="flex-1 bg-slate-50 border-none" placeholder="Type a message..." />
                <Button className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Your Communication Hub</h3>
            <p className="text-slate-500 text-sm max-w-xs mt-2">
              Select a conversation to start messaging your clients or vendors in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
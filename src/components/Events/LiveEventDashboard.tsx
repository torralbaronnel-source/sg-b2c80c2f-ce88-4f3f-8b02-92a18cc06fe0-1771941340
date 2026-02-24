import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Timer,
  ChevronRight,
  MessageSquare,
  Activity,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Milestone {
  id: string;
  time: string;
  title: string;
  status: "pending" | "current" | "done";
  responsible: string;
}

export function LiveEventDashboard({ eventId }: { eventId: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const milestones: Milestone[] = [
    { id: "1", time: "14:00", title: "Vendor Load-in", status: "done", responsible: "Logistics Team" },
    { id: "2", time: "16:00", title: "Ceremony Setup Complete", status: "done", responsible: "Florist / Styling" },
    { id: "3", time: "17:30", title: "Guest Arrival & Welcome Drinks", status: "current", responsible: "Reception Team" },
    { id: "4", time: "18:00", title: "Ceremony Processional", status: "pending", responsible: "Coordinator A" },
    { id: "5", time: "19:00", title: "Cocktail Hour", status: "pending", responsible: "Catering" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans">
      {/* Top Navigation & Status Bar */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/events">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500 hover:bg-rose-600 animate-pulse border-none px-2 py-0 text-[10px] font-bold uppercase tracking-widest">
                LIVE
              </Badge>
              <h1 className="text-2xl font-serif font-bold tracking-tight">The Grand Abellana Wedding</h1>
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Shangri-La Boracay • Feb 24, 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Current Time</p>
            <p className="text-2xl font-mono font-bold">{currentTime.toLocaleTimeString([], { hour12: false })}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-800" />
          <div className="text-right">
            <p className="text-[10px] uppercase text-amber-500 font-bold tracking-widest">Next Milestone</p>
            <p className="text-2xl font-mono font-bold text-amber-400">00:27:14</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Live Run-of-Show */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Timer className="h-5 w-5 text-indigo-400" />
                Live Program Flow
              </h2>
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-xs">
                Edit Timeline
              </Button>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-slate-800" />
              
              {milestones.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`relative pl-12 transition-all duration-300 ${
                    item.status === 'current' ? 'scale-[1.02]' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`absolute left-[10px] top-2 h-3 w-3 rounded-full border-2 ${
                    item.status === 'done' ? 'bg-emerald-500 border-emerald-500' :
                    item.status === 'current' ? 'bg-indigo-500 border-indigo-400 animate-ping' :
                    'bg-slate-900 border-slate-700'
                  }`} />
                  
                  {item.status === 'current' && (
                    <div className="absolute left-[10px] top-2 h-3 w-3 rounded-full bg-indigo-500 z-10" />
                  )}

                  <div className={`p-4 rounded-xl border ${
                    item.status === 'current' ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900/80 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm font-bold text-slate-400">{item.time}</span>
                        <div>
                          <h3 className={`font-bold ${item.status === 'current' ? 'text-white' : 'text-slate-200'}`}>
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 italic">Pic: {item.responsible}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === 'done' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : item.status === 'current' ? (
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-7 text-[10px] uppercase font-bold">
                            Complete
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-slate-500 h-7 text-[10px] uppercase font-bold">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Data */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Vendor Status */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Vendor Readiness
            </h2>
            <div className="space-y-4">
              {[
                { name: "Catering", status: "Ready", level: 100 },
                { name: "Lights & Sound", status: "Testing", level: 85 },
                { name: "Photo/Video", status: "On-site", level: 100 },
                { name: "Cake Supplier", status: "Delayed", level: 40, alert: true },
              ].map((v) => (
                <div key={v.name} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">{v.name}</span>
                    <span className={v.alert ? "text-rose-400 font-bold" : "text-emerald-400"}>{v.status}</span>
                  </div>
                  <Progress value={v.level} className="h-1 bg-slate-800" indicatorClassName={v.alert ? "bg-rose-500" : "bg-emerald-500"} />
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-rose-500/10 border border-rose-500/50 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-rose-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Alerts
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <p className="text-xs text-rose-100 leading-relaxed font-medium">
                  Rain reported 2km away. Ready tent contingencies for outdoor garden ceremony.
                </p>
                <p className="text-[10px] text-rose-400 mt-2 font-bold uppercase">14 mins ago • Lead Coordinator</p>
              </div>
            </div>
          </div>

          {/* Quick Team Comms */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Tactical Chat
            </h2>
            <div className="space-y-3 mb-4">
              <div className="text-xs">
                <span className="text-indigo-400 font-bold">MUA:</span> Bride is ready for first look.
              </div>
              <div className="text-xs">
                <span className="text-indigo-400 font-bold">Logistics:</span> Bouquet has arrived.
              </div>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Broadcast to team..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-6 w-6 text-slate-500 hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
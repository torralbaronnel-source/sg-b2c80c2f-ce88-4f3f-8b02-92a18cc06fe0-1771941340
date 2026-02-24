import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Users, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  MessageSquare,
  Plus,
  Trash2,
  MoreVertical,
  Activity,
  ArrowLeft,
  Calendar,
  Save,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Sequence {
  id: string;
  time: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed";
}

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
}

interface LiveEventDashboardProps {
  eventId: string;
}

export function LiveEventDashboard({ eventId }: LiveEventDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Real-time State
  const [sequences, setSequences] = useState<Sequence[]>([
    { id: "1", time: "18:00", title: "Guest Arrival & Cocktails", description: "Background jazz quartet, welcome drinks served.", status: "completed" },
    { id: "2", time: "19:00", title: "Grand Entrance", description: "Couple enters to 'Marry You', pyrotechnics cue.", status: "active" },
    { id: "3", time: "19:15", title: "First Dance", description: "Spotlight focused, fog machine active.", status: "pending" },
    { id: "4", time: "19:30", title: "Dinner Service", description: "Main course served, low ambient lighting.", status: "pending" },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "1", type: "warning", message: "Cake supplier is 10 mins away." },
  ]);

  const [logistics, setLogistics] = useState([
    { name: "Catering", status: "Ready", contact: "Chef Miguel" },
    { name: "Photo/Video", status: "On-site", contact: "Studio 4" },
    { name: "Florist", status: "Done", contact: "Bloom Co." },
  ]);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateSequenceStatus = (id: string, status: Sequence["status"]) => {
    setSequences(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addSequence = () => {
    const newSeq: Sequence = {
      id: Date.now().toString(),
      time: "00:00",
      title: "New Sequence",
      description: "Description here",
      status: "pending"
    };
    setSequences([...sequences, newSeq]);
    setEditingId(newSeq.id);
  };

  const deleteSequence = (id: string) => {
    setSequences(prev => prev.filter(s => s.id !== id));
  };

  const updateLogisticsStatus = (index: number, status: string) => {
    setLogistics(prev => prev.map((l, i) => i === index ? { ...l, status } : l));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-100">
      {/* Dynamic Global Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                The Santillan Wedding
              </h1>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Grand Ballroom
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600 animate-pulse flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Live Production
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Current Time</p>
              <p className="text-2xl font-mono font-medium tracking-tighter tabular-nums leading-none">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </p>
            </div>
            <Button onClick={addSequence} size="sm" className="bg-slate-900 hover:bg-slate-800 text-white gap-2 rounded-full px-4 shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4" /> Add Cue
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Production Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Run of Show</h2>
            <Badge variant="outline" className="text-[10px] font-bold py-0.5 px-2 bg-white uppercase">
              {sequences.filter(s => s.status === 'completed').length} / {sequences.length} Completed
            </Badge>
          </div>

          <div className="relative space-y-4">
            {/* Timeline Line */}
            <div className="absolute left-[21px] top-4 bottom-4 w-px bg-slate-200 hidden sm:block" />

            {sequences.map((seq) => (
              <div 
                key={seq.id}
                className={cn(
                  "group relative pl-0 sm:pl-12 transition-all duration-300",
                  seq.status === 'active' ? "scale-[1.01]" : "opacity-90 hover:opacity-100"
                )}
              >
                {/* Status Indicator */}
                <div className="absolute left-0 sm:left-[10px] top-6 z-10 hidden sm:block">
                  {seq.status === 'completed' ? (
                    <div className="bg-emerald-500 rounded-full p-1.5 ring-4 ring-white shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  ) : seq.status === 'active' ? (
                    <div className="bg-rose-600 rounded-full p-1.5 ring-4 ring-white shadow-xl shadow-rose-200 animate-pulse">
                      <Activity className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="bg-slate-200 rounded-full p-1.5 ring-4 ring-white">
                      <Circle className="w-3 h-3 text-slate-400 fill-slate-400" />
                    </div>
                  )}
                </div>

                <Card className={cn(
                  "border-none shadow-sm transition-all overflow-hidden",
                  seq.status === 'active' ? "ring-2 ring-rose-500/20 shadow-xl shadow-slate-200/50" : "bg-white"
                )}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        {editingId === seq.id ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input 
                                value={seq.time} 
                                onChange={(e) => setSequences(sq => sq.map(s => s.id === seq.id ? {...s, time: e.target.value} : s))}
                                className="w-24 font-mono font-medium"
                              />
                              <Input 
                                value={seq.title} 
                                onChange={(e) => setSequences(sq => sq.map(s => s.id === seq.id ? {...s, title: e.target.value} : s))}
                                className="flex-1 font-semibold"
                                placeholder="Sequence Title"
                              />
                            </div>
                            <Textarea 
                              value={seq.description} 
                              onChange={(e) => setSequences(sq => sq.map(s => s.id === seq.id ? {...s, description: e.target.value} : s))}
                              className="text-sm min-h-[80px]"
                              placeholder="Describe the cue, lighting, and sound requirements..."
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-8 text-xs">Cancel</Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800">Save Changes</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="cursor-pointer" onClick={() => setEditingId(seq.id)}>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase">{seq.time}</span>
                              <h3 className="text-lg font-semibold tracking-tight text-slate-800">{seq.title}</h3>
                              {seq.status === 'active' && <Badge className="bg-rose-500 text-[10px] font-black uppercase tracking-widest px-1.5 py-0">Active Now</Badge>}
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{seq.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className={cn(
                              "h-8 px-3 text-[10px] font-black uppercase tracking-widest gap-2 rounded-full",
                              seq.status === 'active' ? "border-rose-200 text-rose-600 bg-rose-50" : "text-slate-500"
                            )}>
                              {seq.status} <ChevronRight className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 font-semibold text-xs">
                            <DropdownMenuItem onClick={() => updateSequenceStatus(seq.id, "pending")}>Mark Pending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSequenceStatus(seq.id, "active")} className="text-rose-600">Set to Active</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSequenceStatus(seq.id, "completed")} className="text-emerald-600">Mark Completed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteSequence(seq.id)} className="text-rose-600 focus:bg-rose-50">Delete Sequence</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Production Progress */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Production Pulse</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Healthy</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                    <span>Program Progress</span>
                    <span>{Math.round((sequences.filter(s => s.status === 'completed').length / sequences.length) * 100)}%</span>
                  </div>
                  <Progress value={(sequences.filter(s => s.status === 'completed').length / sequences.length) * 100} className="h-2 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Guests</p>
                    <p className="text-xl font-mono font-bold text-slate-800">142/150</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pacing</p>
                    <p className="text-xl font-mono font-bold text-emerald-600">+4m</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts Management */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Active Alerts</h3>
            {alerts.map(alert => (
              <div key={alert.id} className={cn(
                "p-4 rounded-2xl border flex items-start gap-3 shadow-sm transition-all",
                alert.type === 'warning' ? "bg-amber-50 border-amber-100" : "bg-rose-50 border-rose-100"
              )}>
                <AlertTriangle className={cn("w-5 h-5 shrink-0", alert.type === 'warning' ? "text-amber-600" : "text-rose-600")} />
                <div className="flex-1">
                  <p className={cn("text-xs font-semibold leading-relaxed", alert.type === 'warning' ? "text-amber-900" : "text-rose-900")}>
                    {alert.message}
                  </p>
                </div>
                <button onClick={() => setAlerts(al => al.filter(a => a.id !== alert.id))} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full h-10 border-dashed rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-white text-xs font-bold uppercase tracking-widest gap-2" onClick={() => setAlerts([...alerts, { id: Date.now().toString(), type: 'info', message: 'New production note...' }])}>
              <Plus className="w-3 h-3" /> Push Alert
            </Button>
          </div>

          {/* Logistics Tracking */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Logistics Monitor</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {logistics.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{item.contact}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className={cn(
                        "h-7 px-2 text-[9px] font-black uppercase tracking-[0.1em] rounded-md",
                        item.status === 'Ready' || item.status === 'Done' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                      )}>
                        {item.status}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 font-semibold text-[10px] uppercase tracking-widest">
                      <DropdownMenuItem onClick={() => updateLogisticsStatus(idx, "En-route")}>En-route</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateLogisticsStatus(idx, "On-site")}>On-site</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateLogisticsStatus(idx, "Ready")} className="text-emerald-600">Ready</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateLogisticsStatus(idx, "Done")}>Done</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateLogisticsStatus(idx, "Delayed")} className="text-rose-600">Delayed</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Persistent Production Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg">
        <div className="bg-slate-900 text-white rounded-full p-2 shadow-2xl flex items-center justify-between gap-4 ring-4 ring-white">
          <div className="flex items-center gap-2 pl-4">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Stage</span>
          </div>
          <p className="text-xs font-bold truncate max-w-[180px]">
            {sequences.find(s => s.status === 'active')?.title || "No Active Sequence"}
          </p>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-slate-800 text-slate-400">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button size="icon" className="h-10 w-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg">
              <Activity className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
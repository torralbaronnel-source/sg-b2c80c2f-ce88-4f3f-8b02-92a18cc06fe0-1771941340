import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  MapPin, 
  Package, 
  FileText, 
  Plus, 
  Search,
  Filter,
  ChevronRight,
  Truck,
  Zap,
  Calendar,
  ClipboardList,
  Video,
  Music,
  Heart,
  Briefcase,
  Camera,
  Layers,
  Mic,
  Monitor,
  ShieldCheck,
  Plane
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEvent } from "@/contexts/EventContext";
import { productionService, type RunOfShowItem, type ResourceAllocation } from "@/services/productionService";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function ProductionHubView() {
  const { activeEvent } = useEvent();
  const [runOfShow, setRunOfShow] = useState<RunOfShowItem[]>([]);
  const [resources, setResources] = useState<ResourceAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkflow, setActiveWorkflow] = useState<string>("general");

  useEffect(() => {
    if (activeEvent) {
      loadProductionData();
      // Set workflow based on event type
      const eventType = activeEvent.type?.toLowerCase() || "general";
      if (eventType.includes("wedding")) setActiveWorkflow("wedding");
      else if (eventType.includes("corporate")) setActiveWorkflow("corporate");
      else if (eventType.includes("film") || eventType.includes("video") || eventType.includes("shoot")) setActiveWorkflow("production");
      else setActiveWorkflow("general");
    }
  }, [activeEvent]);

  const loadProductionData = async () => {
    if (!activeEvent) return;
    setLoading(true);
    try {
      const [rosData, resData] = await Promise.all([
        productionService.getRunOfShow(activeEvent.id),
        productionService.getResourceAllocations(activeEvent.id)
      ]);
      setRunOfShow(rosData);
      setResources(resData);
    } catch (error) {
      console.error("Error loading production data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!activeEvent) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Active Event Selected</h2>
        <p className="text-slate-500 max-w-md mt-2">
          Select an event from the Event Selector to load the Production Hub and start managing your execution plan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* 🟦 EVENT CONTROL PANEL (HEADER) - Mission Control Styling */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full -ml-20 -mb-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {activeEvent.type || "Event"}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Active Production Node
              </Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tight uppercase italic flex items-center gap-3">
              <div className="w-2 h-8 bg-red-600 rounded-full" />
              {activeEvent.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{activeEvent.location || "TBD"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                <span>{activeEvent.client_name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{format(new Date(activeEvent.event_date), "MMMM dd, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 font-bold shadow-lg shadow-red-500/20 border-b-4 border-red-800 active:border-b-0 transition-all">
              <Zap className="w-4 h-4 mr-2" /> Start Live Production
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-2xl px-8 font-bold">
              <FileText className="w-4 h-4 mr-2" /> Generate Call Sheet
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 border-t border-slate-800 pt-8">
          <StatItem label="Task Completion" value="78%" icon={CheckCircle2} color="text-green-400" />
          <StatItem label="Budget Health" value="On Track" icon={Zap} color="text-blue-400" />
          <StatItem label="Team Readiness" value="12/15 Crew" icon={Users} color="text-purple-400" />
          <StatItem label="Risk Level" value="Low" icon={AlertCircle} color="text-yellow-400" />
        </div>
      </div>

      <Tabs defaultValue="run-of-show" className="w-full">
        <TabsList className="bg-white p-1.5 rounded-2xl border border-slate-200 h-auto gap-1 mb-8">
          <TabTrigger value="run-of-show" icon={Clock} label="Run-of-Show" />
          <TabTrigger value="workflow" icon={Zap} label={`${activeWorkflow.charAt(0).toUpperCase() + activeWorkflow.slice(1)} Planner`} />
          <TabTrigger value="resources" icon={Package} label="Resource Command" />
          <TabTrigger value="logistics" icon={Truck} label="Logistics" />
        </TabsList>

        {/* 🎭 RUN-OF-SHOW BUILDER */}
        <TabsContent value="run-of-show">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Minute-by-Minute Execution</h3>
                    <p className="text-xs text-slate-500">Master timeline for the production team</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold">
                    <Filter className="w-3.5 h-3.5 mr-2" /> Filter
                  </Button>
                  <Button size="sm" className="bg-slate-900 hover:bg-black text-white rounded-xl font-bold">
                    <Plus className="w-3.5 h-3.5 mr-2" /> Add Item
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {runOfShow.length > 0 ? (
                  runOfShow.map((item, idx) => (
                    <TimelineCard key={item.id} item={item} isLast={idx === runOfShow.length - 1} />
                  ))
                ) : (
                  <EmptyState 
                    icon={Clock} 
                    title="No timeline items yet" 
                    description="Start building your minute-by-minute run-of-show for this event."
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="rounded-[2.5rem] border-slate-200 shadow-xl shadow-slate-200/50 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-3xl rounded-full -mr-10 -mt-10" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-500" /> AI Production Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <AIInsight 
                    title="Timeline Conflict" 
                    desc="Photography session overlaps with HMU. Suggested fix: Delay photography by 15 mins." 
                    type="warning"
                  />
                  <AIInsight 
                    title="Risk Alert" 
                    desc="Only 12/15 crew members confirmed. Action needed: Confirm backup team." 
                    type="danger"
                  />
                  <Button className="w-full bg-red-600 hover:bg-red-700 rounded-xl font-bold text-xs">
                    Ask AI to Optimize Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-slate-200 shadow-xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Execution Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TeamProgress label="Pre-production" value={90} color="bg-green-500" />
                  <TeamProgress label="Staff Readiness" value={65} color="bg-blue-500" />
                  <TeamProgress label="Equipment Logistics" value={40} color="bg-yellow-500" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ⚡ DYNAMIC WORKFLOWS */}
        <TabsContent value="workflow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeWorkflow === 'wedding' && (
              <>
                <WorkflowCard title="Bridal Timeline" icon={Heart} fields={["HMU Start", "Outfit Change", "Ceremony Start", "Portraits"]} color="pink" />
                <WorkflowCard title="Media Production" icon={Camera} fields={["Drone Plan", "Shot Checklist", "Audio Sync", "Lighting Needs"]} color="blue" />
                <WorkflowCard title="Guest Experience" icon={Users} fields={["RSVP Final", "Seating Map", "Dietary Needs", "VIP Handling"]} color="purple" />
              </>
            )}
            {activeWorkflow === 'corporate' && (
              <>
                <WorkflowCard title="Program Agenda" icon={ClipboardList} fields={["Speaker List", "AV Requirements", "Registration", "VIP Handling"]} color="blue" />
                <WorkflowCard title="Branding Assets" icon={Monitor} fields={["Logo GFX", "Slide Decks", "Banner Setup", "Livestream Hookup"]} color="slate" />
                <WorkflowCard title="Security & Compliance" icon={ShieldCheck} fields={["Permits", "Security Team", "Crowd Control", "Insurance"]} color="red" />
              </>
            )}
            {activeWorkflow === 'production' && (
              <>
                <WorkflowCard title="Shot List" icon={Video} fields={["Scene List", "Camera Angles", "Lighting Setup", "Talent Call"]} color="red" />
                <WorkflowCard title="Audio / Visual" icon={Mic} fields={["Mic Plan", "Mixer Config", "Backing Tracks", "Monitor Mix"]} color="yellow" />
                <WorkflowCard title="Technical Crew" icon={Layers} fields={["Gaffer List", "Grip Allocation", "DIT Station", "Crafty"]} color="orange" />
              </>
            )}
            {activeWorkflow === 'general' && (
              <>
                <WorkflowCard title="Master Checklist" icon={ClipboardList} fields={["Permits", "Staffing", "Budget Tracking", "Vendor Sync"]} color="slate" />
                <WorkflowCard title="Timeline Builder" icon={Clock} fields={["Setup Start", "Main Event", "Tear-down", "Load-out"]} color="blue" />
                <WorkflowCard title="Resource Hub" icon={Package} fields={["Gear Check", "Transport", "Catering", "Supplies"]} color="green" />
              </>
            )}
          </div>
        </TabsContent>

        {/* 🧰 RESOURCE COMMAND CENTER */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCategoryCard 
              title="Crew Assignments" 
              icon={Users} 
              items={resources.filter(r => r.resource_type === 'Crew')} 
              color="blue"
            />
            <ResourceCategoryCard 
              title="Equipment Grid" 
              icon={Package} 
              items={resources.filter(r => r.resource_type === 'Equipment')} 
              color="purple"
            />
            <ResourceCategoryCard 
              title="Fleet & Logistics" 
              icon={Truck} 
              items={resources.filter(r => r.resource_type === 'Vehicle')} 
              color="orange"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatItem({ label, value, icon: Icon, color }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <Icon className={cn("w-3.5 h-3.5", color)} />
        {label}
      </div>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}

function TabTrigger({ value, icon: Icon, label }: any) {
  return (
    <TabsTrigger 
      value={value} 
      className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-xl px-6 py-2.5 transition-all duration-300 font-bold text-sm flex items-center gap-2"
    >
      <Icon className="w-4 h-4" />
      {label}
    </TabsTrigger>
  );
}

function TimelineCard({ item, isLast }: { item: RunOfShowItem, isLast: boolean }) {
  return (
    <div className="relative pl-10 group">
      {!isLast && <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 group-hover:bg-red-100 transition-colors" />}
      <div className="absolute left-0 top-2 w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center z-10 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Clock className="w-4 h-4" />
      </div>
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">
              {format(new Date(item.start_time), "HH:mm")} - {item.end_time ? format(new Date(item.end_time), "HH:mm") : "TBD"}
            </div>
            <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" /> {item.location || "Main Site"}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3 text-blue-400" /> {item.responsible_team || "Whole Team"}</span>
            </div>
          </div>
          <Badge className={cn(
            "rounded-xl px-4 py-1 text-[10px] font-bold uppercase",
            item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
          )}>
            {item.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function AIInsight({ title, desc, type }: any) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border flex gap-3",
      type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200' : 
      type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
      'bg-blue-500/10 border-blue-500/20 text-blue-200'
    )}>
      <AlertCircle className={cn("w-5 h-5 shrink-0", 
        type === 'warning' ? 'text-yellow-500' : 
        type === 'danger' ? 'text-red-500' : 
        'text-blue-500'
      )} />
      <div>
        <p className="font-bold text-sm leading-none mb-1 uppercase tracking-wider">{title}</p>
        <p className="text-xs opacity-70 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TeamProgress({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <Progress value={value} className="h-1" />
    </div>
  );
}

function WorkflowCard({ title, icon: Icon, fields, color }: any) {
  const colorMap: any = {
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
    red: "bg-red-50 text-red-600 border-red-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    green: "bg-green-50 text-green-600 border-green-100"
  };

  return (
    <Card className="rounded-[2.5rem] border-slate-200 shadow-xl border-t-4 hover:shadow-2xl transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle className="text-lg font-black">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {fields.map((field: string) => (
            <div key={field} className="flex items-center justify-between text-xs font-medium text-slate-600 p-2 rounded-lg hover:bg-slate-50">
              <span>{field}</span>
              <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full rounded-2xl text-xs font-bold bg-slate-50 group-hover:bg-slate-100">
          Edit Plan
        </Button>
      </CardContent>
    </Card>
  );
}

function ResourceCategoryCard({ title, icon: Icon, items, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100"
  };

  return (
    <Card className="rounded-[2.5rem] border-slate-200 shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 bg-slate-50/50">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <CardTitle className="text-xl font-black">{title}</CardTitle>
          <CardDescription className="text-xs">{items.length} Assigned Assets</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex justify-between items-center group hover:shadow-md hover:border-red-200 transition-all">
              <div>
                <p className="text-sm font-bold text-slate-900">{item.resource_name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.role_or_purpose}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-500" />
            </div>
          ))
        ) : (
          <div className="py-12 text-center opacity-30 flex flex-col items-center">
            <Package className="w-8 h-8 mb-2" />
            <p className="text-xs font-bold italic">Awaiting allocation...</p>
          </div>
        )}
        <Button variant="ghost" className="w-full rounded-2xl text-xs font-bold hover:bg-slate-100 text-slate-500">
          <Plus className="w-3.5 h-3.5 mr-2" /> Allocate {title.split(' ')[0]}
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, description }: any) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white rounded-[2.5rem] border border-slate-200">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 max-w-xs mt-2">{description}</p>
    </div>
  );
}
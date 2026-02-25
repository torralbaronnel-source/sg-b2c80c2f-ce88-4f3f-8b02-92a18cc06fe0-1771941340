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
  LayoutDashboard,
  Calendar,
  GanttChart,
  ClipboardList,
  Video,
  Music,
  Heart,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/badge";
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

  useEffect(() => {
    if (activeEvent) {
      loadProductionData();
    }
  }, [activeEvent]);

  const loadProductionData = async () => {
    setLoading(true);
    try {
      const [rosData, resData] = await Promise.all([
        productionService.getRunOfShow(activeEvent!.id),
        productionService.getResourceAllocations(activeEvent!.id)
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
      {/* 🟦 EVENT CONTROL PANEL (HEADER) */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {activeEvent.event_type}
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Live in 2 Days
              </Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{activeEvent.name}</h1>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{activeEvent.venue_id || "TBD"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{activeEvent.client_name || "Private Client"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 font-bold shadow-lg shadow-blue-500/20">
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
          <TabTrigger value="resources" icon={Package} label="Resource Planner" />
          <TabTrigger value="logistics" icon={Truck} label="Logistics" />
          <TabTrigger value="documents" icon={FileText} label="Documents" />
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
                    <h3 className="font-bold text-slate-900">Timeline Editor</h3>
                    <p className="text-xs text-slate-500">Minute-by-minute execution plan</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold">
                    <Filter className="w-3.5 h-3.5 mr-2" /> Filter
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold">
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
              <Card className="rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" /> AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AIInsight 
                    title="Timeline Conflict" 
                    desc="Photography session overlaps with HMU. Suggested fix: Delay photography by 15 mins." 
                    type="warning"
                  />
                  <AIInsight 
                    title="Weather Alert" 
                    desc="40% chance of rain during outdoor ceremony. Ready indoor backup plan." 
                    type="info"
                  />
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Execution Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ExecutionMetric label="Pre-production" value={90} color="bg-green-500" />
                  <ExecutionMetric label="Staff Readiness" value={65} color="bg-blue-500" />
                  <ExecutionMetric label="Equipment Logistics" value={40} color="bg-yellow-500" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 🧰 RESOURCE PLANNER */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCategoryCard 
              title="Crew & Talent" 
              icon={Users} 
              items={resources.filter(r => r.resource_type === 'Crew')} 
              color="blue"
            />
            <ResourceCategoryCard 
              title="Equipment" 
              icon={Package} 
              items={resources.filter(r => r.resource_type === 'Equipment')} 
              color="purple"
            />
            <ResourceCategoryCard 
              title="Logistics & Transport" 
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
      className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-xl px-6 py-2.5 transition-all duration-300 font-bold text-sm flex items-center gap-2"
    >
      <Icon className="w-4 h-4" />
      {label}
    </TabsTrigger>
  );
}

function TimelineCard({ item, isLast }: { item: RunOfShowItem, isLast: boolean }) {
  return (
    <div className="relative pl-10 group">
      {!isLast && <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 group-hover:bg-blue-100 transition-colors" />}
      <div className="absolute left-0 top-2 w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center z-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Clock className="w-4 h-4" />
      </div>
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              {format(new Date(item.start_time), "HH:mm")} - {item.end_time ? format(new Date(item.end_time), "HH:mm") : "TBD"}
            </div>
            <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location || "Main Site"}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {item.responsible_team || "Whole Team"}</span>
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
      type === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-900' : 'bg-blue-50 border-blue-100 text-blue-900'
    )}>
      <AlertCircle className={cn("w-5 h-5 shrink-0", type === 'warning' ? 'text-yellow-600' : 'text-blue-600')} />
      <div>
        <p className="font-bold text-sm leading-none mb-1">{title}</p>
        <p className="text-xs opacity-80 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ExecutionMetric({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function ResourceCategoryCard({ title, icon: Icon, items, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100"
  };

  return (
    <Card className="rounded-[2.5rem] border-slate-200 shadow-xl">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <CardTitle className="text-xl font-black">{title}</CardTitle>
          <CardDescription className="text-xs">{items.length} Assigned</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-blue-200 transition-all">
              <div>
                <p className="text-sm font-bold text-slate-900">{item.resource_name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.role_or_purpose}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
            </div>
          ))
        ) : (
          <div className="py-8 text-center opacity-40">
            <p className="text-xs font-bold italic">No assignments yet</p>
          </div>
        )}
        <Button variant="ghost" className="w-full rounded-2xl text-xs font-bold hover:bg-slate-100">
          <Plus className="w-3.5 h-3.5 mr-2" /> Add {title.split(' ')[0]}
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
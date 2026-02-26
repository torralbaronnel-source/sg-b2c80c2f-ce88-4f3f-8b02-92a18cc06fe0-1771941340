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
  Plane,
  Loader2,
  Utensils,
  ShieldAlert,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useEvent } from "@/contexts/EventContext";
import { productionService, type RunOfShowItem, type ResourceAllocation } from "@/services/productionService";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const mockChecklist = [
  { id: 1, title: "LGU/Barangay Permit Review", team: "Admin", time: "14 Days Before", critical: true },
  { id: 2, title: "Filscap Music Licensing", team: "Admin/Legal", time: "30 Days Before", critical: true },
  { id: 3, title: "Crew Meal Distribution (Staff Packs)", team: "Logistics", time: "Day Of (11:30)", critical: false },
  { id: 4, title: "Ninong/Ninang Orientation", team: "Coordination", time: "Day Of (15:30)", critical: true },
  { id: 5, title: "Ingress & LED Wall Setup", team: "Technical", time: "Day Of (08:00)", critical: true },
];

export function ProductionHubView() {
  const { activeEvent } = useEvent();
  const { toast } = useToast();
  const [runOfShow, setRunOfShow] = useState<RunOfShowItem[]>([]);
  const [resources, setResources] = useState<ResourceAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBlueprint = async () => {
    if (!activeEvent) return;
    setIsGenerating(true);
    try {
      await productionService.generateBlueprint(
        activeEvent.id, 
        activeEvent.type || 'Corporate', 
        activeEvent.event_date
      );
      await loadProductionData();
      toast({
        title: "Blueprint Generated",
        description: `PH-Specific production timeline created for ${activeEvent.type}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not create production blueprint."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (activeEvent) {
      loadProductionData();
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
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-zinc-950/20 rounded-3xl border-2 border-dashed border-zinc-800">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">No Active Event Selected</h2>
        <p className="text-zinc-400 max-w-md mt-2">
          Select an event from the Event Selector to load the PH Production Hub.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section - Optimized for Mobile */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-white">Production Hub</h1>
          <p className="text-sm md:text-base text-zinc-400">Master production control & PH blueprinting.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleGenerateBlueprint}
            disabled={isGenerating || !activeEvent}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 active:border-b-0 transition-all"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            <span className="hidden sm:inline">Generate PH Blueprint</span>
            <span className="sm:hidden">PH Blueprint</span>
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none border-zinc-800 bg-zinc-900/50 text-zinc-300">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats Grid - Horizontal Scroll on Mobile */}
      <ScrollArea className="w-full whitespace-nowrap pb-4 md:pb-0">
        <div className="flex w-max space-x-4 md:grid md:w-full md:grid-cols-4 md:space-x-0 md:gap-4">
          <StatsCard title="ROS Status" value="85%" sub="12/15 Items" icon={Clock} color="text-blue-400" />
          <StatsCard title="Checklist" value="42%" sub="18/43 Tasks" icon={CheckCircle2} color="text-emerald-400" />
          <StatsCard title="Staff Packs" value="120" sub="Distributed" icon={Utensils} color="text-orange-400" />
          <StatsCard title="Permits" value="3/4" sub="LGU Verified" icon={ShieldAlert} color="text-red-400" />
        </div>
        <ScrollBar orientation="horizontal" className="md:hidden" />
      </ScrollArea>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Timeline/Checklist */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-semibold text-white">PH Master Checklist</CardTitle>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase text-[10px] tracking-widest">Live</Badge>
            </CardHeader>
            <CardContent className="p-0 md:p-6 md:pt-0">
              {/* Mobile Card View */}
              <div className="divide-y divide-zinc-800 md:hidden">
                {mockChecklist.map((item) => (
                  <div key={item.id} className="p-4 flex items-start gap-3 active:bg-zinc-900 transition-colors">
                    <Checkbox className="mt-1 border-zinc-700" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-200 text-sm">{item.title}</span>
                        <Badge variant="secondary" className="text-[9px] bg-zinc-800">{item.team}</Badge>
                      </div>
                      <div className="flex items-center text-[10px] text-zinc-500 gap-3">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time}</span>
                        {item.critical && <span className="text-red-500 font-bold uppercase">Critical</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="text-zinc-400">Task Details</TableHead>
                      <TableHead className="text-zinc-400">Team</TableHead>
                      <TableHead className="text-zinc-400">Schedule</TableHead>
                      <TableHead className="text-right text-zinc-400">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockChecklist.map((item) => (
                      <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-900/40">
                        <TableCell><Checkbox className="border-zinc-700" /></TableCell>
                        <TableCell>
                          <div className="font-medium text-zinc-200">{item.title}</div>
                          {item.critical && <div className="text-[10px] text-red-500 font-bold uppercase mt-0.5">Mandatory Compliance</div>}
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700 font-normal">{item.team}</Badge></TableCell>
                        <TableCell className="text-zinc-400 font-mono text-xs">{item.time}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardHeader className="p-4 md:p-6 pb-2">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                PH Production Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3">
              <AIInsight title="LGU Compliance" desc="Barangay & LGU permits not yet verified." type="warning" />
              <AIInsight title="Logistics" desc="Tight ingress window. Load-in starts at 8AM." type="danger" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, sub, icon: Icon, color }: any) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/40 p-4 min-w-[140px]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("h-4 w-4", color)} />
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-zinc-500 mt-1">{sub}</div>
    </Card>
  );
}

function AIInsight({ title, desc, type }: any) {
  return (
    <div className={cn(
      "p-3 rounded-xl border flex gap-3",
      type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200' : 
      'bg-red-500/10 border-red-500/20 text-red-200'
    )}>
      <AlertCircle className={cn("w-4 h-4 shrink-0 mt-0.5", 
        type === 'warning' ? 'text-yellow-500' : 'text-red-500'
      )} />
      <div>
        <p className="font-bold text-xs uppercase tracking-wider">{title}</p>
        <p className="text-[10px] opacity-70 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
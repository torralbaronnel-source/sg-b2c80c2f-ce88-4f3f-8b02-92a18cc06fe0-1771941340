import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertOctagon, 
  Radio, 
  Calendar, 
  BrainCircuit, 
  Send, 
  FileText, 
  Users,
  ChevronRight,
  Clock,
  MapPin,
  Settings2,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useEvent } from "@/contexts/EventContext";
import { cn } from "@/lib/utils";

export function ProductionHubView() {
  const { activeEvent } = useEvent();
  const [productionMode, setProductionMode] = useState<"idle" | "active" | "paused" | "emergency">("idle");

  if (!activeEvent) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="p-6 bg-muted rounded-full">
          <Calendar className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">No Event Selected</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Please select an event from the Event Selector to access the Production Hub.
          </p>
        </div>
      </div>
    );
  }

  const eventType = activeEvent.type?.toLowerCase() || "wedding";

  return (
    <div className="space-y-6 pb-20">
      {/* 1) MASTER EVENT CONTROL PANEL */}
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl",
              productionMode === "active" ? "bg-green-500/20 text-green-500 animate-pulse" :
              productionMode === "paused" ? "bg-yellow-500/20 text-yellow-500" :
              productionMode === "emergency" ? "bg-red-500/20 text-red-500 animate-bounce" :
              "bg-muted text-muted-foreground"
            )}>
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{activeEvent.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="capitalize">{eventType}</Badge>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> T-Minus 02:45:12</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {productionMode !== "active" ? (
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setProductionMode("active")}>
                <Play className="mr-2 h-4 w-4" /> Start Production
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setProductionMode("paused")}>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
            )}
            
            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 border-red-500/20" onClick={() => setProductionMode("emergency")}>
              <AlertOctagon className="mr-2 h-4 w-4" /> Emergency
            </Button>

            <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />

            <Button size="sm" variant="ghost" className="gap-2">
              <BrainCircuit className="h-4 w-4 text-purple-500" /> AI Assist
            </Button>
            <Button size="sm" variant="ghost" className="gap-2">
              <Send className="h-4 w-4 text-blue-500" /> Client Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="run-sheet" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted/50">
              <TabsTrigger value="run-sheet">Live Run Sheet</TabsTrigger>
              <TabsTrigger value="forms">Production Forms</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="staff">Staff/Crew</TabsTrigger>
            </TabsList>

            <TabsContent value="run-sheet" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Real-Time Production Tracker
                </h3>
                <Button variant="outline" size="sm">Open Master Schedule</Button>
              </div>

              <div className="space-y-3">
                {[
                  { time: "08:00 AM", task: "HMU Preparation Starts", team: "Beauty", status: "completed" },
                  { time: "10:30 AM", task: "Photo Shoot - Preparation", team: "Media", status: "active" },
                  { time: "11:30 AM", task: "Lunch for Entourage", team: "Catering", status: "pending" },
                  { time: "01:00 PM", task: "Processional Line-up", team: "Coordination", status: "pending" },
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-lg border flex items-center justify-between transition-all",
                    item.status === "active" ? "bg-primary/5 border-primary shadow-sm" : "bg-card"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-mono text-muted-foreground w-20">{item.time}</div>
                      <div>
                        <div className="font-medium">{item.task}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.team} Team</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.status === "completed" && <Badge className="bg-green-500/10 text-green-500 border-none">Done</Badge>}
                      {item.status === "active" && <Badge className="bg-primary animate-pulse">Live</Badge>}
                      {item.status === "pending" && <Badge variant="outline">Pending</Badge>}
                      <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="forms" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dynamic forms based on event type */}
                {eventType === "wedding" ? (
                  <>
                    <ProductionFormCard title="Wedding Details" icon={Users} description="Entourage, VIPs, Traditions" />
                    <ProductionFormCard title="HMU Schedule" icon={Clock} description="Preparation slots & locations" />
                    <ProductionFormCard title="Shot List" icon={Radio} description="Photo & Video priorities" />
                    <ProductionFormCard title="Program Flow" icon={FileText} description="Script & Music cues" />
                  </>
                ) : eventType === "corporate" ? (
                  <>
                    <ProductionFormCard title="Corporate Specs" icon={Settings2} description="Branding & Protocols" />
                    <ProductionFormCard title="Speaker Management" icon={Users} description="Profiles & AV needs" />
                    <ProductionFormCard title="Technical Rider" icon={Radio} description="Sound, Light, LED specs" />
                  </>
                ) : (
                  <>
                    <ProductionFormCard title="Shoot Breakdown" icon={Filter} description="Scene & Location list" />
                    <ProductionFormCard title="Logistics" icon={MapPin} description="Transport & Crew schedule" />
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="staff" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crew Management</CardTitle>
                  <CardDescription>Real-time check-in and task assignment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-6">
                    <Button variant="outline" className="flex-1 bg-green-500/5 hover:bg-green-500/10 text-green-500 border-green-500/20">
                      Staff Arrival
                    </Button>
                    <Button variant="outline" className="flex-1 bg-red-500/5 hover:bg-red-500/10 text-red-500 border-red-500/20">
                      Departure
                    </Button>
                  </div>
                  {/* Staff List Placeholder */}
                  <div className="space-y-4 text-sm text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    Connect staff profiles to view real-time GPS check-ins
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-purple-500" /> AI Command Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-xs italic">
                "We are 12 minutes ahead. Suggesting a longer photo session at the garden to optimize the golden hour light."
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="justify-start text-xs h-8">
                  Predict Delays
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8">
                  Suggest Staff Reallocation
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8">
                  Generate Post-Event Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-red-500">
                <AlertOctagon className="h-4 w-4" /> Monitoring & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="destructive" className="w-full justify-start gap-2 h-9 text-xs">
                <Radio className="h-3 w-3" /> Report Production Issue
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs border-orange-500/50 text-orange-600">
                <AlertOctagon className="h-3 w-3" /> High Risk Alert
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 h-9 text-xs">
                <Users className="h-3 w-3" /> Broadcast to Crew
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Timeline Completion</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-1" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Vendor Deliverables</span>
                  <span>8/12</span>
                </div>
                <Progress value={66} className="h-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProductionFormCard({ title, icon: Icon, description }: { title: string, icon: any, description: string }) {
  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-colors group">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
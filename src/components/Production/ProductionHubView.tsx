import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  Calendar, 
  Zap, 
  MessageSquare,
  FileText,
  Shield,
  Heart,
  Camera,
  Music,
  Video,
  Truck,
  Settings,
  MoreVertical,
  ChevronRight,
  Send,
  Save
} from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Validation Schemas
const weddingSchema = z.object({
  bride_name: z.string().min(2, "Bride name is required"),
  groom_name: z.string().min(2, "Groom name is required"),
  ceremony_type: z.string().min(1, "Ceremony type is required"),
  reception_details: z.string().min(5, "Reception details are required"),
  theme_colors: z.string().min(1, "Theme colors are required"),
  photo_priorities: z.string().optional(),
});

const corporateSchema = z.object({
  branding_guidelines: z.string().min(5, "Branding guidelines are required"),
  vip_protocols: z.string().min(5, "VIP protocols are required"),
  technical_requirements: z.string().min(5, "Technical requirements are required"),
  security_needs: z.string().optional(),
});

const filmSchema = z.object({
  scene_list: z.string().min(5, "Scene list is required"),
  location_details: z.string().min(5, "Location details are required"),
  cast_requirements: z.string().min(5, "Cast requirements are required"),
  permit_status: z.string().min(1, "Permit status is required"),
});

type WeddingFormData = z.infer<typeof weddingSchema>;
type CorporateFormData = z.infer<typeof corporateSchema>;
type FilmFormData = z.infer<typeof filmSchema>;

export function ProductionHubView() {
  const { activeEvent } = useEvent();
  const { toast } = useToast();
  const [productionStatus, setProductionStatus] = useState<"idle" | "running" | "paused" | "completed">("idle");

  // Wedding Form
  const weddingForm = useForm<WeddingFormData>({
    resolver: zodResolver(weddingSchema),
    defaultValues: {
      bride_name: "",
      groom_name: "",
      ceremony_type: "",
      reception_details: "",
      theme_colors: "",
      photo_priorities: "",
    }
  });

  // Corporate Form
  const corporateForm = useForm<CorporateFormData>({
    resolver: zodResolver(corporateSchema),
    defaultValues: {
      branding_guidelines: "",
      vip_protocols: "",
      technical_requirements: "",
      security_needs: "",
    }
  });

  // Film Form
  const filmForm = useForm<FilmFormData>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      scene_list: "",
      location_details: "",
      cast_requirements: "",
      permit_status: "",
    }
  });

  const onSubmitWedding = (data: WeddingFormData) => {
    console.log("Wedding Data:", data);
    toast({ title: "Success", description: "Wedding production data saved." });
  };

  const onSubmitCorporate = (data: CorporateFormData) => {
    console.log("Corporate Data:", data);
    toast({ title: "Success", description: "Corporate production data saved." });
  };

  const onSubmitFilm = (data: FilmFormData) => {
    console.log("Film Data:", data);
    toast({ title: "Success", description: "Film production data saved." });
  };

  if (!activeEvent) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <Calendar className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Event Selected</h2>
        <p className="text-slate-500 max-w-md font-medium">Please select an event from the top-bar selector to activate the Production Hub and view specialized workflows.</p>
      </div>
    );
  }

  const eventType = activeEvent.type || "Wedding";

  return (
    <div className="space-y-8 pb-12">
      {/* 1) MASTER EVENT CONTROL PANEL */}
      <Card className="border-none shadow-2xl shadow-blue-500/10 overflow-hidden rounded-3xl">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none",
                  productionStatus === "running" ? "bg-emerald-500 text-white hover:bg-emerald-600" : 
                  productionStatus === "paused" ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-slate-700 text-white hover:bg-slate-800"
                )}>
                  {productionStatus === "running" ? "LIVE PRODUCTION" : productionStatus.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-700 text-[10px] uppercase font-bold tracking-widest">
                  {eventType}
                </Badge>
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-none">
                {activeEvent.client_name || "Untitled Production"}
              </h1>
              <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  {new Date(activeEvent.event_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  {activeEvent.location || "Main Ballroom"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {productionStatus !== "running" ? (
                <Button 
                  onClick={() => setProductionStatus("running")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 h-12 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  START PRODUCTION
                </Button>
              ) : (
                <Button 
                  onClick={() => setProductionStatus("paused")}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-black px-6 h-12 rounded-xl"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  PAUSE EVENT
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 font-black px-6 h-12 rounded-xl"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                EMERGENCY MODE
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-slate-100 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <ControlActionButton icon={Clock} label="Run Sheet" color="text-slate-600" />
            <ControlActionButton icon={Users} label="Staff Logs" color="text-slate-600" />
            <ControlActionButton icon={Zap} label="AI Insights" color="text-blue-600" />
            <ControlActionButton icon={MessageSquare} label="Client Chat" color="text-slate-600" />
            <ControlActionButton icon={FileText} label="Reports" color="text-slate-600" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2) CORE FORMS (DYNAMIC) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">Event Production Details</CardTitle>
                  <CardDescription className="font-medium text-slate-500">Core workflow forms for {eventType} productions.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {eventType === "Wedding" && (
                <form onSubmit={weddingForm.handleSubmit(onSubmitWedding)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bride's Full Name</Label>
                      <Input 
                        {...weddingForm.register("bride_name")} 
                        className={cn("h-12 rounded-xl", weddingForm.formState.errors.bride_name && "border-red-500 focus-visible:ring-red-500")} 
                      />
                      {weddingForm.formState.errors.bride_name && <p className="text-[10px] font-bold text-red-500">{weddingForm.formState.errors.bride_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Groom's Full Name</Label>
                      <Input 
                        {...weddingForm.register("groom_name")} 
                        className={cn("h-12 rounded-xl", weddingForm.formState.errors.groom_name && "border-red-500 focus-visible:ring-red-500")} 
                      />
                      {weddingForm.formState.errors.groom_name && <p className="text-[10px] font-bold text-red-500">{weddingForm.formState.errors.groom_name.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ceremony Type & Traditions</Label>
                    <Input 
                      {...weddingForm.register("ceremony_type")} 
                      placeholder="e.g. Catholic Mass, Garden Wedding, Beach Ceremony"
                      className={cn("h-12 rounded-xl", weddingForm.formState.errors.ceremony_type && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {weddingForm.formState.errors.ceremony_type && <p className="text-[10px] font-bold text-red-500">{weddingForm.formState.errors.ceremony_type.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Theme & Color Palette</Label>
                    <Input 
                      {...weddingForm.register("theme_colors")} 
                      placeholder="e.g. Emerald Green and Gold, Dusty Rose"
                      className={cn("h-12 rounded-xl", weddingForm.formState.errors.theme_colors && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {weddingForm.formState.errors.theme_colors && <p className="text-[10px] font-bold text-red-500">{weddingForm.formState.errors.theme_colors.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Reception Program Details</Label>
                    <Textarea 
                      {...weddingForm.register("reception_details")} 
                      className={cn("min-h-[120px] rounded-2xl resize-none", weddingForm.formState.errors.reception_details && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {weddingForm.formState.errors.reception_details && <p className="text-[10px] font-bold text-red-500">{weddingForm.formState.errors.reception_details.message}</p>}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-slate-900 text-white font-bold h-12 px-8 rounded-xl hover:bg-slate-800 transition-all">
                      <Save className="mr-2 h-4 w-4" />
                      SAVE WEDDING SPECS
                    </Button>
                  </div>
                </form>
              )}

              {eventType === "Corporate" && (
                <form onSubmit={corporateForm.handleSubmit(onSubmitCorporate)} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Branding & Visual Guidelines</Label>
                    <Textarea 
                      {...corporateForm.register("branding_guidelines")} 
                      className={cn("min-h-[100px] rounded-2xl", corporateForm.formState.errors.branding_guidelines && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {corporateForm.formState.errors.branding_guidelines && <p className="text-[10px] font-bold text-red-500">{corporateForm.formState.errors.branding_guidelines.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">VIP & Protocol Requirements</Label>
                    <Textarea 
                      {...corporateForm.register("vip_protocols")} 
                      className={cn("min-h-[100px] rounded-2xl", corporateForm.formState.errors.vip_protocols && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {corporateForm.formState.errors.vip_protocols && <p className="text-[10px] font-bold text-red-500">{corporateForm.formState.errors.vip_protocols.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical & AV Specifications</Label>
                    <Textarea 
                      {...corporateForm.register("technical_requirements")} 
                      className={cn("min-h-[100px] rounded-2xl", corporateForm.formState.errors.technical_requirements && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {corporateForm.formState.errors.technical_requirements && <p className="text-[10px] font-bold text-red-500">{corporateForm.formState.errors.technical_requirements.message}</p>}
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-slate-900 text-white font-bold h-12 px-8 rounded-xl hover:bg-slate-800 transition-all">
                      <Save className="mr-2 h-4 w-4" />
                      SAVE CORPORATE SPECS
                    </Button>
                  </div>
                </form>
              )}

              {eventType === "Film" && (
                <form onSubmit={filmForm.handleSubmit(onSubmitFilm)} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Scene List & Breakdown</Label>
                    <Textarea 
                      {...filmForm.register("scene_list")} 
                      className={cn("min-h-[100px] rounded-2xl", filmForm.formState.errors.scene_list && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {filmForm.formState.errors.scene_list && <p className="text-[10px] font-bold text-red-500">{filmForm.formState.errors.scene_list.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cast & Crew Requirements</Label>
                    <Textarea 
                      {...filmForm.register("cast_requirements")} 
                      className={cn("min-h-[100px] rounded-2xl", filmForm.formState.errors.cast_requirements && "border-red-500 focus-visible:ring-red-500")} 
                    />
                    {filmForm.formState.errors.cast_requirements && <p className="text-[10px] font-bold text-red-500">{filmForm.formState.errors.cast_requirements.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location Permits</Label>
                      <Input 
                        {...filmForm.register("permit_status")} 
                        className={cn("h-12 rounded-xl", filmForm.formState.errors.permit_status && "border-red-500 focus-visible:ring-red-500")} 
                      />
                      {filmForm.formState.errors.permit_status && <p className="text-[10px] font-bold text-red-500">{filmForm.formState.errors.permit_status.message}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-slate-900 text-white font-bold h-12 px-8 rounded-xl hover:bg-slate-800 transition-all">
                      <Save className="mr-2 h-4 w-4" />
                      SAVE FILM SPECS
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* 3) RUN SHEET / LIVE TIMELINE */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">Live Production Run Sheet</CardTitle>
                    <CardDescription className="font-medium text-slate-500">Real-time status of event segments and cues.</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg font-bold border-slate-200">
                  <Plus className="mr-2 h-4 w-4" />
                  ADD CUE
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <RunSheetItem 
                  time="08:00 AM" 
                  title="Team Call Time & Briefing" 
                  status="done" 
                  assigned="Production Lead" 
                />
                <RunSheetItem 
                  time="09:30 AM" 
                  title="Venue Ingress & Tech Setup" 
                  status="active" 
                  assigned="Logistics Team" 
                />
                <RunSheetItem 
                  time="11:00 AM" 
                  title="Client Prep & HMU Start" 
                  status="pending" 
                  assigned="Coordination" 
                />
                <RunSheetItem 
                  time="01:30 PM" 
                  title="Photo & Video Session" 
                  status="pending" 
                  assigned="Media Crew" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4) SIDEBAR PANELS */}
        <div className="space-y-8">
          {/* STAFF PANEL */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900">Staff Control</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">RT</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-none">Ronnel Torralba</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Super Admin</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black">ON-SITE</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                  CHECK-IN
                </Button>
                <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-bold text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                  <Pause className="mr-2 h-4 w-4 text-red-500" />
                  CHECK-OUT
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Coverage</p>
                <div className="space-y-2">
                  <TeamProgress label="Coordination" value={100} color="bg-emerald-500" />
                  <TeamProgress label="Media Crew" value={80} color="bg-blue-500" />
                  <TeamProgress label="Logistics" value={45} color="bg-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI COMMAND CENTER */}
          <Card className="border-none bg-slate-900 text-white shadow-xl shadow-blue-900/20 rounded-3xl overflow-hidden">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <CardTitle className="text-lg font-black uppercase tracking-tight">AI Command</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                <p className="text-xs font-bold text-blue-300 leading-relaxed italic">
                  "Logistics setup is currently at 45%. Based on event start time, I suggest reallocating 2 staff members from Coordination to assist with Venue Ingress."
                </p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl">
                APPROVE REALLOCATION
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ControlActionButton({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <Button variant="ghost" className={cn("h-auto py-2 px-3 flex flex-col items-center gap-1 hover:bg-slate-50 rounded-xl", color)}>
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </Button>
  );
}

function RunSheetItem({ time, title, status, assigned }: { time: string, title: string, status: "pending" | "active" | "done", assigned: string }) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start gap-6">
        <div className="text-sm font-black text-slate-900 w-20">{time}</div>
        <div className="space-y-1">
          <p className={cn("font-bold text-sm", status === "done" ? "text-slate-400 line-through" : "text-slate-900")}>
            {title}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ASSIGNED: {assigned}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge className={cn(
          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-none",
          status === "done" ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" :
          status === "active" ? "bg-blue-100 text-blue-600 hover:bg-blue-200 animate-pulse" :
          "bg-slate-100 text-slate-400 hover:bg-slate-200"
        )}>
          {status}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-full">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function TeamProgress({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-bold text-slate-400">{value}%</span>
      </div>
      <Progress value={value} className="h-1" classNameIndicator={color} />
    </div>
  );
}
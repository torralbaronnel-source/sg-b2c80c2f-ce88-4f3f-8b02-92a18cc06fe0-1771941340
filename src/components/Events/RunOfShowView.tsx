import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Settings2,
  Mic2,
  Music,
  Utensils,
  Video
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/contexts/EventContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type CueStatus = "pending" | "live" | "completed" | "overrun";
type CueType = "program" | "av" | "catering" | "talent" | "transition";

interface ROSCue {
  id: string;
  start_time: string;
  duration: number; // in minutes
  title: string;
  description?: string;
  status: CueStatus;
  cue_type: CueType;
  assigned_to?: string;
}

export function RunOfShowView() {
  const { currentEvent } = useEvents();
  const { toast } = useToast();
  const [cues, setCues] = useState<ROSCue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentEvent?.id) {
      fetchCues();
    }
  }, [currentEvent?.id]);

  const fetchCues = async () => {
    try {
      const { data, error } = await supabase
        .from("event_cues")
        .select("*")
        .eq("event_id", currentEvent.id)
        .order("start_time", { ascending: true });

      if (error) throw error;
      // Map database 'duration_minutes' to 'duration' for the UI
      const mappedCues = (data || []).map(cue => ({
        ...cue,
        duration: cue.duration_minutes || 0
      }));
      setCues(mappedCues as ROSCue[]);
    } catch (err) {
      console.error("Error fetching cues:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCueStatus = async (id: string, status: CueStatus) => {
    try {
      const { error } = await supabase
        .from("event_cues")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      setCues(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      
      toast({
        title: `Cue is now ${status.toUpperCase()}`,
        description: "The team has been notified in real-time.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not sync cue status.",
      });
    }
  };

  const getCueIcon = (type: CueType) => {
    switch (type) {
      case "program": return <Play className="h-4 w-4" />;
      case "av": return <Video className="h-4 w-4" />;
      case "talent": return <Mic2 className="h-4 w-4" />;
      case "catering": return <Utensils className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: CueStatus) => {
    switch (status) {
      case "live": return "bg-red-500 text-white animate-pulse border-red-600";
      case "completed": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      case "overrun": return "bg-amber-500 text-white border-amber-600";
      default: return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Master Run of Show</h1>
          <p className="text-muted-foreground">Minute-by-minute live production schedule.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button size="sm" variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" /> Config
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Cue
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading Master ROS...</div>
        ) : cues.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No Cues Scheduled</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                Build your event timeline by adding cues for AV, Talent, and Catering.
              </p>
              <Button variant="outline" size="sm">Create First Cue</Button>
            </CardContent>
          </Card>
        ) : (
          cues.map((cue, index) => (
            <Card 
              key={cue.id} 
              className={cn(
                "transition-all duration-300 border-l-4 overflow-hidden",
                cue.status === "live" ? "ring-2 ring-red-500/20 border-l-red-500" : "border-l-slate-300 dark:border-l-slate-700"
              )}
            >
              <div className="flex items-stretch">
                {/* Time Section */}
                <div className="w-24 flex-shrink-0 bg-muted/30 p-4 flex flex-col items-center justify-center border-r">
                  <span className="text-lg font-bold tabular-nums">
                    {new Date(cue.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {cue.duration} MIN
                  </span>
                </div>

                {/* Content Section */}
                <div className="flex-grow p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1.5 capitalize font-semibold py-0.5">
                        {getCueIcon(cue.cue_type)}
                        {cue.cue_type}
                      </Badge>
                      <h3 className={cn(
                        "font-bold text-base",
                        cue.status === "completed" && "text-muted-foreground line-through"
                      )}>
                        {cue.title}
                      </h3>
                    </div>
                    <Badge className={cn("capitalize px-2 py-0.5", getStatusColor(cue.status))}>
                      {cue.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{cue.description}</p>
                </div>

                {/* Action Section */}
                <div className="p-2 flex items-center gap-1 border-l">
                  {cue.status === "pending" && (
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                      onClick={() => updateCueStatus(cue.id, "live")}
                    >
                      <Play className="h-4 w-4 text-white" />
                    </Button>
                  )}
                  {cue.status === "live" && (
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                      onClick={() => updateCueStatus(cue.id, "completed")}
                    >
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </Button>
                  )}
                   {cue.status === "live" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 w-8 p-0 border-amber-500 text-amber-500"
                      onClick={() => updateCueStatus(cue.id, "overrun")}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  )}
                  {cue.status === "completed" && (
                     <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => updateCueStatus(cue.id, "pending")}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
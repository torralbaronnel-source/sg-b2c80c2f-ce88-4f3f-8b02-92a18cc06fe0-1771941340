import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  PieChart as PieChartIcon, 
  BarChart3, 
  TrendingUp,
  AlertCircle,
  MapPin,
  RefreshCcw,
  Download,
  FileJson,
  FileText,
  ChevronDown,
  ExternalLink,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { lifecycleService } from "@/services/lifecycleService";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEvents } from "@/contexts/EventContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LiveDashboardProps {
  eventId: string;
}

export function LiveEventDashboard({ eventId }: LiveDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  const { subscribeToLiveUpdates } = useEvents();

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [statsRes, guestRes] = await Promise.all([
        lifecycleService.getEventGuestStats(eventId),
        lifecycleService.getEventGuests(eventId, 1, 1000)
      ]);

      if (!statsRes.error && statsRes.data) setStats(statsRes.data);
      if (!guestRes.error && guestRes.data) setGuests(guestRes.data || []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchDashboardData();
    
    // Subscribe to real-time changes
    const unsubscribe = subscribeToLiveUpdates(eventId, (payload) => {
      console.log("Real-time update received:", payload);
      fetchDashboardData(true); // Silent refresh on change
    });

    return () => {
      unsubscribe();
    };
  }, [eventId, fetchDashboardData, subscribeToLiveUpdates]);

  const checkInData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Arrived", value: stats.checkedIn, color: "#10b981" },
      { name: "Confirmed RSVP", value: stats.pending, color: "#3b82f6" },
      { name: "No Response", value: stats.total - (stats.checkedIn + stats.pending), color: "#94a3b8" },
    ];
  }, [stats]);

  const seatingData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.tableOccupancy).map(([table, count]) => ({
      table: `T${table}`,
      guests: count,
    })).sort((a, b) => {
      const numA = parseInt(a.table.replace(/\D+/g, '')) || 0;
      const numB = parseInt(b.table.replace(/\D+/g, '')) || 0;
      return numA - numB;
    }).slice(0, isMobile ? 6 : 12); // Limit visible bars on mobile for clarity
  }, [stats, isMobile]);

  const checkInPercentage = stats ? Math.round((stats.checkedIn / stats.total) * 100) : 0;
  const vipPercentage = stats ? Math.round((stats.vipsArrived / stats.vips) * 100) : 0;

  const handleExport = (format: 'csv' | 'json') => {
    setExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      let content = "";
      let fileName = `Orchestrix_Report_${timestamp}`;
      let mimeType = "";

      if (format === 'csv') {
        const headers = ["Guest", "Org", "Group", "Status", "Tier", "Table", "Check-in"];
        const rows = guests.map(g => [
          `"${g.name || ''}"`,
          `"${g.organization || 'Individual'}"`,
          `"${g.group_name || 'N/A'}"`,
          g.attendance_status?.toUpperCase() || 'PENDING',
          g.is_vip ? "VIP" : "GENERAL",
          g.table_number ? `Table ${g.table_number}` : "UNSEATED",
          g.check_in_time ? new Date(g.check_in_time).toLocaleString() : "-"
        ]);
        content = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        fileName += ".csv";
        mimeType = "text/csv;charset=utf-8;";
      } else {
        content = JSON.stringify({ summary: stats, manifest: guests }, null, 2);
        fileName += ".json";
        mimeType = "application/json;charset=utf-8;";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="relative mb-6">
          <RefreshCcw className="w-12 h-12 animate-spin text-primary/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Preparing Live Analytics</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">Optimizing data stream for your device...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
      {/* Header - Sticky on Mobile */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4 pt-2 md:relative md:top-auto md:bg-transparent md:p-0 md:m-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 md:border-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Live Intelligence</h2>
            {refreshing && <RefreshCcw className="h-3 w-3 animate-spin text-primary" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] md:text-sm text-muted-foreground">
              {isMobile ? `Synced ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : `Monitoring active session: ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchDashboardData()} disabled={refreshing} className="hidden sm:flex h-9 shadow-sm">
            <RefreshCcw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="flex-1 sm:flex-none h-10 md:h-9 bg-primary shadow-lg shadow-primary/10 font-bold">
                <Download className="h-4 w-4 mr-2" />
                {isMobile ? "Export" : "Export Reports"}
                <ChevronDown className="h-3 w-3 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] p-2">
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">Available Formats</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('csv')} className="py-3 cursor-pointer">
                <FileText className="h-4 w-4 mr-3 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="font-semibold">Guest Manifest</span>
                  <span className="text-[10px] text-muted-foreground italic">Excel / CSV compatible</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')} className="py-3 cursor-pointer">
                <FileJson className="h-4 w-4 mr-3 text-amber-500" />
                <div className="flex flex-col">
                  <span className="font-semibold">Raw Intelligence</span>
                  <span className="text-[10px] text-muted-foreground italic">Full API data dump</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* KPI Grid - Horizontal Scroll on Mobile */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 snap-x no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:p-0 md:m-0 md:gap-4">
        {[
          { 
            label: "Arrivals", 
            value: stats?.checkedIn, 
            sub: `${checkInPercentage}% Rate`, 
            icon: CheckCircle2, 
            color: "emerald",
            progress: checkInPercentage 
          },
          { 
            label: "Pending", 
            value: stats?.pending, 
            sub: "Expected", 
            icon: Clock, 
            color: "amber",
            trend: `${Math.round(stats?.checkedIn / 1.5)}/hr`
          },
          { 
            label: "VIP Status", 
            value: `${stats?.vipsArrived}/${stats?.vips}`, 
            sub: `${vipPercentage}% Arrived`, 
            icon: UserCheck, 
            color: "indigo",
            progress: vipPercentage 
          },
          { 
            label: "Seated", 
            value: stats?.seated, 
            sub: `${stats?.unseated} Lobbied`, 
            icon: MapPin, 
            color: "blue" 
          },
        ].map((kpi, i) => (
          <Card key={i} className={cn(
            "flex-shrink-0 w-[80%] snap-center mr-3 md:w-full md:mr-0 md:snap-align-none border-l-4",
            `border-l-${kpi.color}-500 shadow-sm`
          )}>
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                  <h3 className="text-2xl md:text-3xl font-black mt-1 tabular-nums">{kpi.value}</h3>
                </div>
                <div className={cn("p-2 rounded-xl", `bg-${kpi.color}-500/10`)}>
                  <kpi.icon className={cn("h-5 w-5", `text-${kpi.color}-500`)} />
                </div>
              </div>
              <div className="mt-4">
                {kpi.progress !== undefined ? (
                  <>
                    <div className="flex justify-between text-[10px] mb-1.5 font-bold">
                      <span className="text-muted-foreground italic">{kpi.sub}</span>
                      <span className={`text-${kpi.color}-600 dark:text-${kpi.color}-400`}>{kpi.progress}%</span>
                    </div>
                    <Progress value={kpi.progress} className={cn("h-1.5", `bg-${kpi.color}-500/10`)} />
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <span className="text-muted-foreground italic">{kpi.sub}</span>
                    {kpi.trend && (
                      <Badge variant="outline" className="ml-auto text-[9px] py-0 h-4 border-emerald-500/30 text-emerald-600 bg-emerald-50">
                        <TrendingUp className="h-2 w-2 mr-1" /> {kpi.trend}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts - Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                  <PieChartIcon className="h-4 w-4 text-emerald-600" />
                </div>
                <CardTitle className="text-base md:text-lg">Arrival Momentum</CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px]">{checkInPercentage}% In</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6 h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={checkInData}
                  cx="50%"
                  cy="45%"
                  innerRadius={isMobile ? 60 : 75}
                  outerRadius={isMobile ? 85 : 100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={800}
                >
                  {checkInData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-base md:text-lg">Floor Saturation</CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px]">Tables 1-{seatingData.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6 h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seatingData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="table" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  fontWeight="bold"
                />
                <YAxis fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                <Tooltip 
                  cursor={{fill: 'rgba(59, 130, 246, 0.03)'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="guests" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={isMobile ? 24 : 36}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Production Alerts - Sticky Bottom on Mobile */}
      <AnimatePresence>
        {stats?.pending > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 left-4 right-4 z-30 md:relative md:bottom-0 md:left-0 md:right-0"
          >
            <div className="rounded-2xl border border-amber-500/20 bg-amber-50 dark:bg-amber-950/20 p-4 shadow-xl shadow-amber-500/10 flex items-start gap-3 backdrop-blur-md">
              <div className="p-2 bg-amber-500 rounded-xl flex-shrink-0 shadow-lg shadow-amber-500/20">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 pr-4">
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">Alert: Arrival Surge</h4>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-tight font-medium">
                  {stats?.pending} guests expected. {stats?.unseated > 10 && "Lobby congestion imminent."}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-900/50 hover:bg-amber-500/10">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
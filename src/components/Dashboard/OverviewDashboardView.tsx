import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  Server
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function OverviewDashboardView() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || "Ronnel Torralba";

  const stats = [
    {
      title: "Total Events",
      value: "12",
      change: "+2.5%",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Production",
      value: "3",
      change: "Stable",
      icon: Activity,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Upcoming (Month)",
      value: "8",
      change: "+12%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Guests Managed",
      value: "1,240",
      change: "+450",
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border bg-slate-950/50 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Mission Control</h1>
            <p className="text-slate-400 text-sm md:text-base max-w-md">
              Welcome back, {userName.split(' ')[0]}. Your production ecosystem is fully synchronized.
            </p>
          </div>
          <div className="relative h-32 md:h-40 w-full md:w-64 rounded-xl border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-sm overflow-hidden group">
            <img 
              src="/Capture.PNG" 
              alt="System Overview" 
              className="h-full w-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-primary/20 blur-[100px]" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-slate-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-medium text-emerald-600">{stat.change}</span>
                <span className="text-[10px] text-slate-400 font-medium italic">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 overflow-hidden border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg">System Performance</CardTitle>
            <CardDescription>Live telemetry from active production nodes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video w-full bg-slate-50">
              <img 
                src="/uploads/image_c8b24bc1-dcef-49cd-80e7-448bd8426a35.png" 
                alt="Dashboard Preview" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Summary */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              Infrastructure
            </CardTitle>
            <CardDescription>Active production server status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Node</p>
                    <h3 className="text-xl font-bold">RED_PROD_MAIN</h3>
                  </div>
                  <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">CPU Usage</span>
                    <span className="font-bold">24%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[24%]" />
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-400 font-medium">Memory</span>
                    <span className="font-bold">4.2 / 16 GB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-700">Storage Cluster</span>
                </div>
                <span className="text-xs font-bold text-slate-500">92% Free</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-700">CDN Edge</span>
                </div>
                <span className="text-xs font-bold text-slate-500">Optimal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
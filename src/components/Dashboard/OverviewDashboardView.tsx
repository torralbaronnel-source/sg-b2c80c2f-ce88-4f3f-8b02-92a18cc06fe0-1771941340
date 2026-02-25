import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  Server,
  Layers
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl border bg-slate-950/50 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Mission Control</h1>
            <p className="text-slate-400 max-w-md">
              Welcome back to Orchestrix. Your production ecosystem is fully synchronized and ready for execution.
            </p>
          </div>
          <div className="relative h-40 w-64 rounded-xl border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-sm overflow-hidden group">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden border-none bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative aspect-video w-full">
            <img 
              src="/uploads/image_975e9db6-e94d-4ca6-90fc-0d2c85e7f617.png" 
              alt="Dashboard Analytics" 
              className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </Card>

        {/* Recent Events / Schedule */}
        <Card className="md:col-span-4 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent & Upcoming Events</CardTitle>
              <CardDescription>Scheduled production timeline for the next 7 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-semibold">
              View Calendar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Global Tech Summit 2026", date: "Feb 28", status: "In Progress", type: "Conference" },
                { name: "Skyline Wedding Gala", date: "Mar 02", status: "Preparation", type: "Social" },
                { name: "Digital Innovation Expo", date: "Mar 05", status: "Scheduled", type: "Exhibition" }
              ].map((event, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-white">
                      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{event.date.split(' ')[0]}</span>
                      <span className="text-lg font-bold text-slate-900 leading-none">{event.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{event.name}</h4>
                      <p className="text-xs font-medium text-slate-500">{event.type} • Management Node Alpha</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      event.status === 'In Progress' ? 'bg-emerald-100 text-emerald-700' : 
                      event.status === 'Preparation' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Server Infrastructure Summary */}
        <Card className="md:col-span-3 border-none shadow-sm bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              Infrastructure
            </CardTitle>
            <CardDescription>Active production server status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 text-white relative overflow-hidden group">
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

            <Button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-none font-bold text-xs uppercase tracking-wider h-11">
              Infrastructure Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Users, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  Sparkles
} from "lucide-react";

export function OverviewDashboardView() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">Welcome, Orchestrix Leader.</h1>
          <p className="text-slate-500 mt-2 text-lg">Your production empire is currently managing 12 events across the PH.</p>
        </div>
        <Button className="bg-amber-100 text-amber-900 hover:bg-amber-200 border-none font-bold gap-2">
          <Sparkles className="w-4 h-4" />
          AI Insights: 3 Critical To-dos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Clients", value: "24", icon: Users, change: "+12%", color: "text-blue-600" },
          { label: "Booked Events", value: "82", icon: Calendar, change: "+5%", color: "text-amber-600" },
          { label: "Total Revenue", value: "₱4.2M", icon: TrendingUp, change: "+24%", color: "text-emerald-600" },
          { label: "Unread Messages", value: "14", icon: MessageSquare, change: "Hot", color: "text-rose-600" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-slate-50", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  {stat.change}
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-serif">Recent Intelligence</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 font-bold">View History</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">Inquiry from Maria Clara</p>
                  <p className="text-sm text-slate-500 truncate">Interested in Garden Wedding Package • 200 Guests</p>
                </div>
                <span className="text-xs font-medium text-slate-400">2h ago</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-amber-400">AI Taskmaster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-300 text-sm leading-relaxed">Based on your upcoming schedule, I've prioritized these actions:</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer">
                <div className="mt-1 w-2 h-2 rounded-full bg-amber-400" />
                <p className="text-sm font-medium">Follow up with Palacio de Memoria for Santos wedding permit.</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-sm font-medium">Send remaining balance invoice to Sofia Rodriguez (Debut).</p>
              </div>
            </div>
            <Button className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300 font-bold">
              Run Morning Briefing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
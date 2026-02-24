import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2
} from "lucide-react";

export function OverviewDashboardView() {
  const stats = [
    { label: "Active Projects", value: "12", change: "+2", icon: Calendar, trend: "up" },
    { label: "Revenue (MTD)", value: "₱450k", change: "+12%", icon: DollarSign, trend: "up" },
    { label: "Active Inquiries", value: "28", change: "+5", icon: Users, trend: "up" },
    { label: "Pending Tasks", value: "64", change: "-8", icon: CheckCircle2, trend: "down" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
        <p className="text-slate-500 text-sm">Financial performance and operational alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-rose-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-emerald-600 text-xs" : "text-rose-600 text-xs"}>
                      {stat.change} vs last month
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 text-indigo-600">
                  <stat.icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Production Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg">
              <p className="text-sm text-slate-400">Activity graph visualization placeholder</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Contract signed by Santos Wedding</p>
                    <p className="text-xs text-slate-400">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
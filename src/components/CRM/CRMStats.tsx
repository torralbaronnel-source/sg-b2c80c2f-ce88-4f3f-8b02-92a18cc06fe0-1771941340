import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Zap, Target } from "lucide-react";

export function CRMStats() {
  const stats = [
    { title: "Total Leads", value: "1,284", icon: Users, trend: "+12.5%", color: "text-blue-500" },
    { title: "Active Quotes", value: "48", icon: Target, trend: "+3.2%", color: "text-[#6264a7]" },
    { title: "Conversion", value: "24.8%", icon: Zap, trend: "+5.1%", color: "text-amber-500" },
    { title: "Revenue Node", value: "$420K", icon: TrendingUp, trend: "+18.2%", color: "text-green-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{stat.trend}</span> vs last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
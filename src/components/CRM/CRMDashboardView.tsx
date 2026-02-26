import React, { useState } from "react";
import { CRMStats } from "./CRMStats";
import { LeadTable } from "./LeadTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, PieChart, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CRMDashboardView() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">CRM Intelligence</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Lead & Client Matrix</p>
        </div>
        <Button className="bg-[#6264a7] hover:bg-[#50528e] text-white gap-2 h-10 px-6 font-bold uppercase tracking-wider text-[11px] shadow-lg shadow-[#6264a7]/20">
          <Plus className="h-4 w-4" /> New Lead Node
        </Button>
      </div>

      <CRMStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LeadTable />
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-xs font-bold uppercase tracking-wider">Conversion Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  { label: "Discovery", value: 85, color: "bg-blue-500" },
                  { label: "Proposal", value: 65, color: "bg-[#6264a7]" },
                  { label: "Negotiation", value: 45, color: "bg-amber-500" },
                  { label: "Synchronized", value: 25, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-1000`} 
                        style={{ width: `${item.value}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#6264a7] text-white border-none shadow-xl shadow-[#6264a7]/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Globe className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/70">Neural Proxy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">98.4% Accuracy</div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider font-medium">Lead validation system operational</p>
              <Button variant="outline" className="mt-4 w-full bg-white/10 border-white/20 hover:bg-white/20 text-white text-[10px] font-bold uppercase h-8">
                View Detailed Diagnostics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
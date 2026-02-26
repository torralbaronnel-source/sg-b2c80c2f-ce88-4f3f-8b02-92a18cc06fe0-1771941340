import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, FileText, Clock, CheckCircle2 } from "lucide-react";

export function InvoicesDashboardView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Financial Transaction Records</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Invoiced", value: "$124,500", icon: TrendingUp, color: "text-blue-500" },
          { title: "Pending", value: "12", icon: Clock, color: "text-amber-500" },
          { title: "Paid", value: "48", icon: CheckCircle2, color: "text-green-500" },
          { title: "Drafts", value: "5", icon: FileText, color: "text-muted-foreground" },
        ].map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-none shadow-md">
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-muted-foreground italic">
          <FileText className="h-12 w-12 mb-4 opacity-20" />
          <p>Initializing Invoices Ledger...</p>
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, FileText, CheckCircle2 } from "lucide-react";

export function CRMDashboardView() {
  const stats = [
    { label: "Active Inquiries", value: "24", icon: UserPlus, color: "text-blue-600" },
    { label: "Total Clients", value: "156", icon: Users, color: "text-indigo-600" },
    { label: "Pending Contracts", value: "12", icon: FileText, color: "text-amber-600" },
    { label: "Booking Rate", value: "68%", icon: CheckCircle2, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CRM & Leads</h1>
        <p className="text-slate-500 text-sm">Manage inquiries, client relationships, and contracts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 italic">Integrate your inquiry form to start seeing leads here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
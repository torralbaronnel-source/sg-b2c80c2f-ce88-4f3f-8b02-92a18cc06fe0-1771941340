import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";

const pipelineStages = [
  { name: "Inquiry", count: 12, value: "$45,000", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "Proposal", count: 8, value: "$82,000", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { name: "Negotiation", count: 5, value: "$125,000", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { name: "Closed/Won", count: 24, value: "$450,000", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads & Pipeline</h1>
            <p className="text-slate-500 text-lg">Manage your sales funnel and track potential bookings.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pipelineStages.map((stage) => (
              <Card key={stage.name} className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold">{stage.name}</CardTitle>
                  <Badge variant="outline" className={stage.color}>{stage.count} Leads</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stage.value}</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Pipeline Board</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg bg-slate-50">
                <div className="text-center">
                  <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Interactive Pipeline Board Loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}